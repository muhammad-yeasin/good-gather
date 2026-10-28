"use client";

import React, { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    toast.success("Thank you for subscribing to community alerts!");
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-teal-500/15 via-card to-emerald-500/10 p-8 sm:p-12 md:p-16 text-center space-y-6">
      <div className="max-w-xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-primary">
          Stay Connected
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-foreground">
          Subscribe to Local Cause Alerts
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Get notified when new winter drives, blanket distributions, or emergency cleanups are organized in your neighborhood.
        </p>
      </div>

      {subscribed ? (
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-sm border border-emerald-500/20">
          <CheckCircle2 className="w-5 h-5" />
          <span>You&apos;re subscribed to local community alerts!</span>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="max-w-md mx-auto flex flex-col sm:flex-row gap-3"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="flex-1 px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-md hover:opacity-95 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Subscribe</span>
          </button>
        </form>
      )}

      <p className="text-[11px] text-muted-foreground">
        No spam guaranteed. Unsubscribe at any time.
      </p>
    </div>
  );
}

