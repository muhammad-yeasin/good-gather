"use client";

import React from "react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import {
  Calendar,
  MapPin,
  Tag,
  ArrowRight,
  User,
  Trash2,
  Edit,
} from "lucide-react";

export interface EventData {
  _id?: string;
  id?: string;
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

interface EventCardProps {
  event: EventData;
  onEdit?: (event: EventData) => void;
  onDelete?: (id: string) => void;
  showManageActions?: boolean;
  joinedAt?: string;
}

export function EventCard({
  event,
  onEdit,
  onDelete,
  showManageActions = false,
  joinedAt,
}: EventCardProps) {
  const eventId = (event._id || event.id || "").toString();

  const getBadgeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case "donation":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
      case "cleanup":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "plantation":
        return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20";
      case "health camp":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      case "education":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      default:
        return "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20";
    }
  };

  const fallbackThumbnail =
    "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80";

  return (
    <div className="group relative flex flex-col rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Thumbnail Banner */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        <img
          src={event.thumbnail || fallbackThumbnail}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackThumbnail;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

        {/* Event Type Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full backdrop-blur-md border shadow-sm ${getBadgeColor(
              event.eventType
            )} bg-card/90`}
          >
            <Tag className="w-3 h-3" />
            {event.eventType}
          </span>
        </div>

        {/* Date pill overlay */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-white text-xs font-semibold">
          <Calendar className="w-3.5 h-3.5 text-teal-400" />
          <span>{formatDate(event.date)}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-bold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors mb-2">
          {event.title}
        </h3>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
          <MapPin className="w-4 h-4 text-primary shrink-0" />
          <span className="truncate font-medium">{event.location}</span>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-4 flex-1">
          {event.description}
        </p>

        {/* Organizer or joined indicator */}
        <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
          {joinedAt ? (
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              Joined {formatDate(joinedAt)}
            </span>
          ) : (
            <span className="truncate flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-primary" />
              {event.userName || event.userEmail.split("@")[0]}
            </span>
          )}
        </div>

        {/* Card Actions */}
        <div className="mt-4 pt-2">
          {showManageActions ? (
            <div className="flex items-center gap-2">
              <Link
                href={`/events/${eventId}`}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-secondary hover:bg-muted text-foreground text-xs font-semibold transition-colors"
              >
                View
              </Link>
              {onEdit && (
                <button
                  onClick={() => onEdit(event)}
                  className="inline-flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold hover:bg-indigo-100 transition-colors cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(eventId)}
                  className="inline-flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 text-xs font-semibold hover:bg-rose-100 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              )}
            </div>
          ) : (
            <Link
              href={`/events/${eventId}`}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-95 transition-all shadow-sm hover:shadow-md group/btn"
            >
              <span>View Event</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

