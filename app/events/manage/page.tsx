"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { EventCard, EventData } from "@/components/EventCard";
import { toast } from "sonner";
import { isFutureDate } from "@/lib/utils";
import {
  Settings,
  PlusCircle,
  Edit,
  Trash2,
  X,
  Type,
  Tag,
  Calendar,
  MapPin,
  Image as ImageIcon,
  AlertTriangle,
} from "lucide-react";

const EVENT_TYPES = [
  "Donation",
  "Cleanup",
  "Plantation",
  "Winter Relief",
  "Food Drive",
  "Health Camp",
  "Education",
];

export default function ManageEventsPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const [events, setEvents] = useState<EventData[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  // Edit Modal State
  const [editingEvent, setEditingEvent] = useState<EventData | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editType, setEditType] = useState("");
  const [editThumbnail, setEditThumbnail] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editDate, setEditDate] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [editError, setEditError] = useState("");

  // Delete Confirmation Modal State
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const todayStr = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login?redirect=/events/manage");
    }
  }, [user, isLoading, router]);

  const fetchMyEvents = async () => {
    setLoadingEvents(true);
    try {
      const res = await fetch("/api/events/manage");
      const data = await res.json();
      if (res.ok) {
        setEvents(data.events || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyEvents();
    }
  }, [user]);

  // Open Edit Modal
  const handleOpenEdit = (evt: EventData) => {
    setEditingEvent(evt);
    setEditTitle(evt.title);
    setEditDescription(evt.description);
    setEditType(evt.eventType);
    setEditThumbnail(evt.thumbnail);
    setEditLocation(evt.location);
    setEditDate(evt.date);
    setEditError("");
  };

  // Submit Update
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    setEditError("");

    // Form Validation for Update form as required
    if (!editTitle.trim()) {
      setEditError("Title is required.");
      toast.error("Title is required.");
      return;
    }

    if (!editDescription.trim()) {
      setEditError("Description is required.");
      toast.error("Description is required.");
      return;
    }

    if (!editThumbnail.trim()) {
      setEditError("Thumbnail URL is required.");
      toast.error("Thumbnail URL is required.");
      return;
    }

    if (!editLocation.trim()) {
      setEditError("Location is required.");
      toast.error("Location is required.");
      return;
    }

    if (!editDate) {
      setEditError("Event date is required.");
      toast.error("Event date is required.");
      return;
    }

    if (!isFutureDate(editDate)) {
      const msg = "Event date must be in the future. Past dates are not allowed.";
      setEditError(msg);
      toast.error(msg);
      return;
    }

    setIsUpdating(true);
    try {
      const eventId = (editingEvent._id || editingEvent.id || "").toString();
      const res = await fetch(`/api/events/${eventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle.trim(),
          description: editDescription.trim(),
          eventType: editType,
          thumbnail: editThumbnail.trim(),
          location: editLocation.trim(),
          date: editDate,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to update event");
        setEditError(data.error || "Failed to update event");
        return;
      }

      toast.success("Event updated successfully!");
      setEditingEvent(null);
      fetchMyEvents();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsUpdating(false);
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deletingId) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/events/${deletingId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to delete event");
        return;
      }

      toast.success("Event deleted successfully!");
      setDeletingId(null);
      fetchMyEvents();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete event");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-border/80">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
            <Settings className="w-3.5 h-3.5" />
            Organizer Dashboard
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-foreground">
            Manage My Events
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl">
            View, edit, and manage the social drives you have published. Only you have permission to edit or delete your created initiatives.
          </p>
        </div>

        <Link
          href="/events/create"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-md hover:opacity-95 transition-all self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Event</span>
        </Link>
      </div>

      {/* Events List */}
      {loadingEvents ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-80 rounded-2xl bg-muted/40 animate-pulse border border-border"
            />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="p-16 text-center rounded-3xl border border-dashed border-border bg-card/40 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <Settings className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-foreground">
            You Haven&apos;t Created Any Events Yet
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Take the initiative! Create a winter clothes drive, blanket distribution, or cleanup campaign in your neighborhood.
          </p>
          <div className="pt-2">
            <Link
              href="/events/create"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-md hover:opacity-95 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create an Event</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((evt) => (
            <EventCard
              key={evt._id || evt.id}
              event={evt}
              showManageActions={true}
              onEdit={handleOpenEdit}
              onDelete={(id) => setDeletingId(id)}
            />
          ))}
        </div>
      )}

      {/* UPDATE EVENT MODAL */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-card border border-border rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-foreground">
                  Update Event
                </h3>
                <p className="text-xs text-muted-foreground">
                  Modify the details for your social service initiative
                </p>
              </div>
              <button
                onClick={() => setEditingEvent(null)}
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editError && (
              <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
                {editError}
              </div>
            )}

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Title</label>
                <div className="relative">
                  <Type className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                  />
                </div>
              </div>

              {/* Event Type & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Event Type</label>
                  <div className="relative">
                    <Tag className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={editType}
                      onChange={(e) => setEditType(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm cursor-pointer"
                    >
                      {EVENT_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Event Date</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="date"
                      required
                      min={todayStr}
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Location</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                  />
                </div>
              </div>

              {/* Thumbnail */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Thumbnail Image URL</label>
                <div className="relative">
                  <ImageIcon className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    required
                    value={editThumbnail}
                    onChange={(e) => setEditThumbnail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Description</label>
                <textarea
                  required
                  rows={4}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm leading-relaxed"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="px-5 py-2.5 rounded-xl border border-border text-foreground text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-md hover:opacity-95 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isUpdating ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-card border border-border rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-foreground">
                Delete Event?
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Are you sure you want to delete this event? This action cannot be undone and will also remove all volunteer registrations.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="flex-1 py-2.5 rounded-xl border border-border text-foreground text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-destructive text-destructive-foreground text-xs font-bold shadow-md hover:opacity-95 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

