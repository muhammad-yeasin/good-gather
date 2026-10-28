export const dynamic = "force-dynamic";

import Link from "next/link";
import { getDb } from "@/lib/mongodb";
import { EventCard } from "@/components/EventCard";
import { Newsletter } from "@/components/Newsletter";
import {
  Sparkles,
  HeartHandshake,
  ArrowRight,
  ShieldCheck,
  Users,
  Compass,
  CalendarCheck2,
  TreePine,
  Shirt,
  Trash2,
  Send,
  MapPin,
  Flame,
} from "lucide-react";

async function getRecentUpcomingEvents() {
  try {
    const { db } = await getDb();
    const todayStr = new Date().toISOString().split("T")[0];

    // Using .limit(6) operator of MongoDB based on date as requested
    const events = await db
      .collection("events")
      .find({ date: { $gte: todayStr } })
      .sort({ date: 1 })
      .limit(6)
      .toArray();

    return JSON.parse(JSON.stringify(events));
  } catch (error) {
    console.error("Failed to fetch recent events:", error);
    return [];
  }
}

export default async function HomePage() {
  const recentEvents = await getRecentUpcomingEvents();

  const galleryImages = [
    {
      url: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=700&q=80",
      title: "Winter Clothes Drive",
      location: "Mirpur 10, Dhaka",
      cause: "Warmth for Rickshaw Pullers",
    },
    {
      url: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=700&q=80",
      title: "Night Blanket Relief",
      location: "Mohammadpur, Dhaka",
      cause: "Shelterless Night Support",
    },
    {
      url: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=700&q=80",
      title: "Dhanmondi Lake Clean-up",
      location: "Dhanmondi, Dhaka",
      cause: "Eco Plastic-Free Waters",
    },
    {
      url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=700&q=80",
      title: "Urban Tree Plantation",
      location: "Uttara, Dhaka",
      cause: "1000 Green Saplings",
    },
    {
      url: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb7?auto=format&fit=crop&w=700&q=80",
      title: "Community Food Relief",
      location: "Old Dhaka",
      cause: "Fresh Meals Sharing",
    },
    {
      url: "https://images.unsplash.com/photo-1497633762267-9d1f1e4a5fb6?auto=format&fit=crop&w=700&q=80",
      title: "Children Book & Bag Drive",
      location: "Rayerbazar, Dhaka",
      cause: "Education for Underprivileged",
    },
  ];

  const features = [
    {
      icon: <Users className="w-6 h-6 text-teal-600 dark:text-teal-400" />,
      title: "Community-Led Drives",
      description:
        "Every citizen can organize cleanups, winter drives, and food distributions in their local area in minutes.",
    },
    {
      icon: <CalendarCheck2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
      title: "One-Click Participation",
      description:
        "Join verified social initiatives with a single click and coordinate directly with local volunteer leaders.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      title: "Creator Controls",
      description:
        "Manage, update, and track participation for your own initiatives with built-in creator authorization.",
    },
    {
      icon: <Compass className="w-6 h-6 text-amber-600 dark:text-amber-400" />,
      title: "Upcoming Only Discovery",
      description:
        "Strict future-date filters guarantee you will always discover upcoming active initiatives that need volunteers.",
    },
  ];

  return (
    <div className="flex flex-col gap-16 md:gap-24 pb-16">
      {/* 1. HERO BANNER SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 bg-gradient-to-b from-teal-500/10 via-emerald-500/5 to-transparent">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(13,148,136,0.18),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(20,184,166,0.22),rgba(0,0,0,0))]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20 text-xs sm:text-sm font-semibold backdrop-blur-md shadow-sm">
            <Sparkles className="w-4 h-4 text-teal-500" />
            <span>Community-Driven Social Development Platform</span>
          </div>

          {/* Heading */}
          <h1 className="max-w-4xl mx-auto text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground leading-[1.15]">
            Gather for Good.{" "}
            <span className="bg-gradient-to-r from-teal-600 via-emerald-500 to-teal-400 bg-clip-text text-transparent">
              Transform Your Neighborhood.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed">
            Create, discover, and join local social service drives in your neighborhood.
            From winter clothes and blanket distribution in Mirpur and Mohammadpur to urban tree plantations and cleanups.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/events"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-lg shadow-teal-500/25 hover:opacity-95 hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
            >
              <span>Explore Upcoming Events</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/events/create"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border-2 border-border bg-card/80 hover:bg-muted text-foreground font-bold text-sm hover:scale-105 active:scale-95 transition-all"
            >
              <HeartHandshake className="w-4 h-4 text-teal-500" />
              <span>Create an Event</span>
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="pt-10 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-card/70 border border-border/80 shadow-sm">
              <p className="text-2xl sm:text-3xl font-black text-primary">1,450+</p>
              <p className="text-xs text-muted-foreground font-medium">Active Volunteers</p>
            </div>
            <div className="p-4 rounded-2xl bg-card/70 border border-border/80 shadow-sm">
              <p className="text-2xl sm:text-3xl font-black text-emerald-500">180+</p>
              <p className="text-xs text-muted-foreground font-medium">Events Completed</p>
            </div>
            <div className="p-4 rounded-2xl bg-card/70 border border-border/80 shadow-sm">
              <p className="text-2xl sm:text-3xl font-black text-indigo-500">24,000+</p>
              <p className="text-xs text-muted-foreground font-medium">Lives Impacted</p>
            </div>
            <div className="p-4 rounded-2xl bg-card/70 border border-border/80 shadow-sm">
              <p className="text-2xl sm:text-3xl font-black text-amber-500">100%</p>
              <p className="text-xs text-muted-foreground font-medium">Community Driven</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURE SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            Platform Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground">
            Built for Grassroots Action
          </h2>
          <p className="text-sm text-muted-foreground">
            A frictionless platform connecting compassionate citizens with direct local community initiatives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-border bg-card/60 hover:bg-card hover:border-primary/40 shadow-sm hover:shadow-md transition-all duration-300 space-y-3"
            >
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                {feature.icon}
              </div>
              <h3 className="font-bold text-base text-foreground">
                {feature.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. RECENT UPCOMING EVENTS SECTION (Dynamic from Database with .limit(6)) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Upcoming Initiatives</span>
            </div>
            <h2 className="text-3xl font-black text-foreground">
              Recent Upcoming Events
            </h2>
            <p className="text-sm text-muted-foreground">
              Latest 6 community drives scheduled in your city. Get involved today.
            </p>
          </div>

          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-teal-700 transition-colors"
          >
            <span>View All Events</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recentEvents.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-card/40">
            <p className="text-sm text-muted-foreground mb-4">
              No upcoming events right now. Be the first to organize one!
            </p>
            <Link
              href="/events/create"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm"
            >
              Create an Event
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentEvents.map((evt: any) => (
              <EventCard key={evt._id || evt.id} event={evt} />
            ))}
          </div>
        )}
      </section>

      {/* 4. GALLERY SECTION (Static photographs of community events) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            Visual Stories
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground">
            Community in Action
          </h2>
          <p className="text-sm text-muted-foreground">
            Moments from volunteer drives, relief distributions, and green initiatives across Dhaka and beyond.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((img, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl aspect-[4/3] border border-border shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <img
                src={img.url}
                alt={img.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

              <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-teal-500/80 backdrop-blur-md">
                  {img.cause}
                </span>
                <h4 className="font-bold text-base">{img.title}</h4>
                <p className="text-xs text-white/80 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-teal-300" />
                  {img.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. NEWSLETTER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Newsletter />
      </section>
    </div>
  );
}
