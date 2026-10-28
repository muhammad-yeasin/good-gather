"use client";

import React from "react";
import Link from "next/link";
import {
  HeartHandshake,
  Heart,
  Mail,
  MapPin,
  Calendar,
  Sparkles,
  Globe,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-card/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 font-bold text-xl group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <span className="text-xl font-black bg-gradient-to-r from-teal-600 to-emerald-500 dark:from-teal-400 dark:to-emerald-300 bg-clip-text text-transparent">
                GoodGather
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A community-driven event management platform empowering everyday citizens to create, join, and track impactful social development drives.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="w-4 h-4 text-teal-500 shrink-0" />
              <span>Dhaka, Bangladesh • Nationwide Impact</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
              Explore Platform
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link href="/events" className="hover:text-primary transition-colors flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  Upcoming Events
                </Link>
              </li>
              <li>
                <Link href="/events/create" className="hover:text-primary transition-colors flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal-500" />
                  Create an Event
                </Link>
              </li>
              <li>
                <Link href="/events/manage" className="hover:text-primary transition-colors">
                  Manage My Events
                </Link>
              </li>
              <li>
                <Link href="/events/joined" className="hover:text-primary transition-colors">
                  My Joined Events
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Causes */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
              Active Causes
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                Winter Clothes & Blanket Relief
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                City Clean-up & Waste Segregation
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Urban Tree Plantation Drives
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Underprivileged Meal Sharing
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                Free Medical & Health Camps
              </li>
            </ul>
          </div>

          {/* Mission & Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
              Community Spirit
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every small action counts. Connect with local volunteers, turn compassion into direct community aid, and be the change your city needs.
            </p>
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold">
                <Globe className="w-3.5 h-3.5" />
                100% Volunteer Driven
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} GoodGather. Built with care for community service and social development.</p>
          <div className="flex items-center gap-1 text-xs">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for a better tomorrow</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
