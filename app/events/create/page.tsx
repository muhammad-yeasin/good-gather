"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { toast } from "sonner";
import { isFutureDate } from "@/lib/utils";
import {
  Calendar,
  MapPin,
  Tag,
  Image as ImageIcon,
  FileText,
  Type,
  PlusCircle,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const EVENT_TYPES = [
  "Donation",
  "Cleanup",
  "Plantation",
  "Winter Relief",
  "Food Drive",
  "Health Camp",
  "Education",
];

export default function CreateEventPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventType, setEventType] = useState(EVENT_TYPES[0]);
  const [thumbnail, setThumbnail] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState("");

  // Get tomorrow's or today's date formatted as YYYY-MM-DD for min attribute
  const todayStr = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!isLoading && !user) {
      toast.error("Please log in to create an event.");
      router.push("/login?redirect=/events/create");
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    // Form validations
    if (!title.trim()) {
      setValidationError("Event title is required.");
      toast.error("Event title is required.");
      return;
    }

    if (!description.trim()) {
      setValidationError("Event description is required.");
      toast.error("Event description is required.");
      return;
    }

    if (!thumbnail.trim()) {
      setValidationError("Thumbnail image URL is required.");
      toast.error("Thumbnail image URL is required.");
      return;
    }

    if (!location.trim()) {
      setValidationError("Location is required.");
      toast.error("Location is required.");
      return;
    }

    if (!date) {
      setValidationError("Event date is required.");
      toast.error("Event date is required.");
      return;
    }

    // Ensure no past date can be added
    if (!isFutureDate(date)) {
      const msg = "Event date must be in the future. Past dates are not allowed.";
      setValidationError(msg);
      toast.error(msg);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          eventType,
          thumbnail,
          location,
          date,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to create event");
        setValidationError(data.error || "Failed to create event");
        return;
      }

      // Success message and redirect to Upcoming Events page as required
      toast.success("Event created successfully!");
      router.push("/events");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-6">
        <Link
          href="/events"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Upcoming Events
        </Link>
      </div>

      <div className="p-6 sm:p-10 rounded-3xl border border-border bg-card shadow-xl space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            Social Service Drive
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">
            Create a Community Event
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Organize a local relief effort, environmental cleanup, or community support drive.
          </p>
        </div>

        {validationError && (
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
            {validationError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground">
              Event Title <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <Type className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Winter Clothes Distribution – Mirpur 10, Dhaka"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              />
            </div>
          </div>

          {/* Event Type & Date (2 columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Event Type dropdown */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground">
                Event Type <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <Tag className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm appearance-none cursor-pointer"
                >
                  {EVENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Event Date (future only) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground">
                Event Date <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="date"
                  required
                  min={todayStr}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm cursor-pointer"
                />
              </div>
              <p className="text-[11px] text-muted-foreground">
                Dates must be in the future (today or later)
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground">
              Location / Venue <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Mohammadpur Town Hall, Dhaka"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              />
            </div>
          </div>

          {/* Thumbnail Image URL */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground">
              Thumbnail Image URL <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <ImageIcon className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                required
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              />
            </div>
            {/* Quick preset suggestions */}
            <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-muted-foreground">
              <span>Quick photo presets:</span>
              <button
                type="button"
                onClick={() =>
                  setThumbnail(
                    "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80"
                  )
                }
                className="text-primary hover:underline cursor-pointer"
              >
                Winter Clothes
              </button>
              •
              <button
                type="button"
                onClick={() =>
                  setThumbnail(
                    "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=800&q=80"
                  )
                }
                className="text-primary hover:underline cursor-pointer"
              >
                Blanket Relief
              </button>
              •
              <button
                type="button"
                onClick={() =>
                  setThumbnail(
                    "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80"
                  )
                }
                className="text-primary hover:underline cursor-pointer"
              >
                Cleanup
              </button>
              •
              <button
                type="button"
                onClick={() =>
                  setThumbnail(
                    "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80"
                  )
                }
                className="text-primary hover:underline cursor-pointer"
              >
                Tree Plantation
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground">
              Event Description <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the purpose of the drive, volunteers required, items being distributed or tasks to complete..."
                className="w-full p-4 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm leading-relaxed"
              />
            </div>
          </div>

          {/* Creator Information note */}
          <div className="p-4 rounded-xl bg-muted/60 border border-border flex items-center justify-between text-xs text-muted-foreground">
            <span>Organizer Email attached:</span>
            <span className="font-semibold text-foreground">{user.email}</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-md hover:opacity-95 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                <span>Publish Event</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

