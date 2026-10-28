"use client";

import React, { useState, useEffect } from "react";
import { EventCard, EventData } from "@/components/EventCard";
import {
  CalendarDays,
  Search,
  Filter,
  Sparkles,
  RefreshCw,
  PlusCircle,
} from "lucide-react";
import Link from "next/link";

const CATEGORIES = [
  "All",
  "Donation",
  "Cleanup",
  "Plantation",
  "Winter Relief",
  "Food Drive",
  "Health Camp",
  "Education",
];

export default function UpcomingEventsPage() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUpcomingEvents = async () => {
    setIsLoading(true);
    try {
      // strictly upcomingOnly=true to filter out passed events
      let url = `/api/events?upcomingOnly=true`;
      if (selectedCategory !== "All") {
        url += `&type=${encodeURIComponent(selectedCategory)}`;
      }
      if (searchQuery.trim()) {
        url += `&search=${encodeURIComponent(searchQuery.trim())}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        setEvents(data.events || []);
      }
    } catch (error) {
      console.error("Failed to load events", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcomingEvents();
  }, [selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUpcomingEvents();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/80">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-bold">
            <CalendarDays className="w-3.5 h-3.5" />
            Future Community Drives
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-foreground">
            Upcoming Events
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
            Discover verified volunteer initiatives scheduled for upcoming dates.
            Past events are automatically excluded so you can focus on active drives that need support.
          </p>
        </div>

        <Link
          href="/events/create"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-md hover:opacity-95 transition-all self-start md:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create Event</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative w-full md:w-72 flex items-center"
        >
          <Search className="w-4 h-4 text-muted-foreground absolute left-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events or areas..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-card text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
          />
        </form>
      </div>

      {/* Events Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-80 rounded-2xl bg-muted/40 animate-pulse border border-border"
            />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="p-16 text-center rounded-3xl border border-dashed border-border bg-card/40 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mx-auto text-muted-foreground">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-foreground">No Upcoming Events Found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            There are currently no upcoming events matching your selected filter or search term.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="px-4 py-2 rounded-xl border border-border bg-card text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
            <Link
              href="/events/create"
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-all cursor-pointer"
            >
              Create New Event
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((evt) => (
            <EventCard key={evt._id || evt.id} event={evt} />
          ))}
        </div>
      )}
    </div>
  );
}

