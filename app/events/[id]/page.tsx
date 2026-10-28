"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import {
  Calendar,
  MapPin,
  Tag,
  User,
  HeartHandshake,
  ArrowLeft,
  CheckCircle2,
  Users,
  Share2,
  Clock,
  Mail,
  Shield,
} from "lucide-react";

interface EventDetail {
  _id: string;
  title: string;
  description: string;
  eventType: string;
  thumbnail: string;
  location: string;
  date: string;
  userEmail: string;
  userName?: string;
  userPhoto?: string;
  createdAt?: string;
}

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const router = useRouter();
  const { user } = useAuth();

  const [event, setEvent] = useState<EventDetail | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [attendeesCount, setAttendeesCount] = useState(0);
  const [attendees, setAttendees] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);

  const fetchEventData = async () => {
    try {
      const res = await fetch(`/api/events/${id}`);
      if (!res.ok) {
        toast.error("Event not found");
        return;
      }
      const data = await res.json();
      setEvent(data.event);
      setIsJoined(data.isJoined);
      setAttendeesCount(data.attendeesCount);
      setAttendees(data.attendees || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEventData();
  }, [id, user]);

  const handleJoinEvent = async () => {
    // If not logged in, prompt and redirect to login
    if (!user) {
      toast.info("Please log in to join this community event.");
      router.push(`/login?redirect=/events/${id}`);
      return;
    }

    setIsJoining(true);
    try {
      if (!isJoined) {
        // Join event
        const res = await fetch(`/api/events/${id}/join`, {
          method: "POST",
        });
        const data = await res.json();
        if (res.ok) {
          setIsJoined(true);
          setAttendeesCount((prev) => prev + 1);
          toast.success("You have successfully joined this event! Thank you for gathering for good!");
          fetchEventData();
        } else {
          toast.error(data.error || "Failed to join event");
        }
      } else {
        // Leave / Unjoin
        const res = await fetch(`/api/events/${id}/join`, {
          method: "DELETE",
        });
        if (res.ok) {
          setIsJoined(false);
          setAttendeesCount((prev) => Math.max(0, prev - 1));
          toast.info("You have left the event.");
          fetchEventData();
        }
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setIsJoining(false);
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Event link copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold">Event Not Found</h2>
        <p className="text-sm text-muted-foreground">
          The event you are looking for might have been removed or does not exist.
        </p>
        <Link
          href="/events"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Upcoming Events
        </Link>
      </div>
    );
  }

  const fallbackThumbnail =
    "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/events"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Upcoming Events
        </Link>
      </div>

      {/* Main Event Card / Container */}
      <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-xl">
        {/* Banner Image */}
        <div className="relative aspect-[21/9] sm:aspect-[21/8] w-full bg-muted overflow-hidden">
          <img
            src={event.thumbnail || fallbackThumbnail}
            alt={event.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = fallbackThumbnail;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Badges on banner */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 px-3.5 py-1 text-xs font-bold rounded-full bg-card/90 backdrop-blur-md text-foreground border border-border shadow-md">
              <Tag className="w-3.5 h-3.5 text-teal-500" />
              {event.eventType}
            </span>
          </div>

          <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 right-4 sm:right-6 text-white space-y-2">
            <h1 className="text-2xl sm:text-4xl font-black leading-tight drop-shadow-md">
              {event.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-white/90">
              <span className="flex items-center gap-1.5 font-medium">
                <MapPin className="w-4 h-4 text-teal-400" />
                {event.location}
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Calendar className="w-4 h-4 text-teal-400" />
                {formatDate(event.date)}
              </span>
            </div>
          </div>
        </div>

        {/* Content & Action Bar */}
        <div className="p-6 sm:p-10 space-y-8">
          {/* Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-muted/40 border border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">
                  {attendeesCount} {attendeesCount === 1 ? "Volunteer" : "Volunteers"} Joined
                </p>
                <p className="text-xs text-muted-foreground">
                  {isJoined ? "You are confirmed for this initiative" : "Sign up to join hands for this drive"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="p-3 rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                title="Share event link"
              >
                <Share2 className="w-4 h-4" />
              </button>

              {/* Functional Join Event Button */}
              <button
                onClick={handleJoinEvent}
                disabled={isJoining}
                className={`inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer ${
                  isJoined
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "bg-primary text-primary-foreground hover:opacity-95"
                } disabled:opacity-50`}
              >
                {isJoining ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : isJoined ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Joined (Click to Leave)</span>
                  </>
                ) : (
                  <>
                    <HeartHandshake className="w-4 h-4" />
                    <span>Join Event</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left 2 Cols: Description */}
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-lg font-bold text-foreground">
                About this Social Initiative
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {event.description}
              </p>

              {/* Verified Volunteer guidelines */}
              <div className="pt-6 border-t border-border space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Volunteer Guidelines
                </h4>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                    <span>Please arrive 15 minutes before the scheduled time at the designated location.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                    <span>Wear comfortable clothing suitable for physical social work and distribution.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                    <span>Bring any pre-coordinated relief packages or distribution items if requested.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Col: Organizer Info */}
            <div className="space-y-6">
              <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Initiative Organizer
                </h4>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-muted border border-border shrink-0">
                    <img
                      src={
                        event.userPhoto ||
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                      }
                      alt={event.userName || event.userEmail}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">
                      {event.userName || "Community Organizer"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {event.userEmail}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-border text-[11px] text-muted-foreground flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-teal-500" />
                  <span>Verified Platform Member</span>
                </div>
              </div>

              {/* Recent Volunteers List if any */}
              {attendees.length > 0 && (
                <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Confirmed Volunteers ({attendees.length})
                  </h4>
                  <div className="space-y-2">
                    {attendees.slice(0, 5).map((att, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-xs text-foreground">
                        <img
                          src={
                            att.userPhoto ||
                            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                          }
                          alt={att.userName}
                          className="w-6 h-6 rounded-full object-cover border border-border"
                        />
                        <span className="font-medium truncate">{att.userName || "Volunteer"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

