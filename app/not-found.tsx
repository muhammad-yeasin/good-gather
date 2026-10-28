"use client";

import Link from "next/link";
import { ArrowLeft, HeartHandshake } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center space-y-6">
      <div className="w-16 h-16 rounded-3xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
        <HeartHandshake className="w-8 h-8" />
      </div>
      <div className="space-y-2">
        <h1 className="text-4xl sm:text-5xl font-black text-foreground">404</h1>
        <h2 className="text-xl font-bold text-foreground">Page Not Found</h2>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          The page or social drive you are looking for does not exist or has been moved.
        </p>
      </div>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-md hover:opacity-95 transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Home</span>
      </Link>
    </div>
  );
}

