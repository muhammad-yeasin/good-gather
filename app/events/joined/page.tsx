"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { EventCard } from "@/components/EventCard";
import { CheckCircle2, ArrowRight, Calendar, HeartHandshake } from "lucide-react";

export default function JoinedEventsPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [joinedList, setJoinedList] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login?redirect=/events/joined");
    }
  }, [user, isLoading, router]);

  const fetchJoinedEvents = async () => {
    setLoadingEvents(true);
    try {
      const res = await fetch("/api/events/joined");
      const data = await res.json();
      if (res.ok) {
        setJoinedList(data.joinedEvents || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchJoinedEvents();
    }
  }, [user]);

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
      <div className="space-y-3 pb-6 border-b border-border/80">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          My Volunteer Commitments
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-foreground">
          Joined Events
        </h1>
        <p className="text-sm text-muted-foreground max-w-xl">
          Here are all the social development and community service drives you have signed up for, sorted by event date.
        </p>
      </div>

      {loadingEvents ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-72 rounded-2xl bg-muted/40 animate-pulse border border-border"
            />
          ))}
        </div>
      ) : joinedList.length === 0 ? (
        <div className="p-16 text-center rounded-3xl border border-dashed border-border bg-card/40 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto">
            <HeartHandshake className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-foreground">
            You Haven&apos;t Joined Any Events Yet
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Discover active community cleanups, blanket distributions, and winter relief drives in your area and join hands!
          </p>
          <div className="pt-2">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-md hover:opacity-95 transition-all"
            >
              <span>Explore Upcoming Events</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {joinedList.map((item) => (
            <EventCard
              key={item._id}
              event={{
                _id: item.eventId,
                title: item.eventTitle,
                description: "You have signed up as a confirmed volunteer for this initiative.",
                eventType: item.eventType,
                thumbnail: item.thumbnail,
                location: item.eventLocation,
                date: item.eventDate,
                userEmail: item.userEmail,
              }}
              joinedAt={item.joinedAt}
            />
          ))}
        </div>
      )}
    </div>
  );
}

