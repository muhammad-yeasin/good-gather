"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  HeartHandshake,
  CalendarDays,
  PlusCircle,
  Settings,
  CheckCircle2,
  LogOut,
  LogIn,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

export function Navbar() {
  const { user, logout, isLoading } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoverName, setHoverName] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown when route changes
  useEffect(() => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  const defaultAvatar =
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/85 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & App Name */}
          <Link
            href="/"
            className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-foreground group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="leading-none text-lg font-black bg-gradient-to-r from-teal-600 to-emerald-500 dark:from-teal-400 dark:to-emerald-300 bg-clip-text text-transparent">
                GoodGather
              </span>
              <span className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase">
                Community Action
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/events"
              className={`flex items-center gap-1.5 text-sm font-semibold transition-colors hover:text-primary ${
                pathname === "/events"
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              Upcoming Events
            </Link>
          </nav>

          {/* Right Action Section */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />

            {isLoading ? (
              <div className="w-24 h-9 bg-muted/60 animate-pulse rounded-lg" />
            ) : user ? (
              <div className="flex items-center gap-3">
                {/* Profile Picture with hover name and dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <div
                    className="relative flex items-center gap-1.5 cursor-pointer select-none"
                    onMouseEnter={() => setHoverName(true)}
                    onMouseLeave={() => setHoverName(false)}
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <div className="relative w-10 h-10 rounded-full ring-2 ring-primary/40 hover:ring-primary overflow-hidden transition-all duration-200">
                      <img
                        src={user.photoURL || defaultAvatar}
                        alt={user.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = defaultAvatar;
                        }}
                      />
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                        dropdownOpen ? "rotate-180 text-primary" : ""
                      }`}
                    />

                    {/* Hover Display Name Tooltip */}
                    {hoverName && !dropdownOpen && (
                      <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50 px-2.5 py-1 text-xs font-medium text-white bg-slate-900 dark:bg-slate-800 rounded-md shadow-lg pointer-events-none whitespace-nowrap animate-in fade-in duration-150">
                        {user.name}
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 dark:bg-slate-800 rotate-45" />
                      </div>
                    )}
                  </div>

                  {/* Profile Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-card border border-border shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-4 py-2 border-b border-border/60">
                        <p className="text-sm font-bold text-foreground truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>

                      <div className="py-1">
                        <Link
                          href="/events/create"
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors font-medium"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <PlusCircle className="w-4 h-4 text-teal-500" />
                          Create Event
                        </Link>
                        <Link
                          href="/events/manage"
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors font-medium"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <Settings className="w-4 h-4 text-indigo-500" />
                          Manage Events
                        </Link>
                        <Link
                          href="/events/joined"
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors font-medium"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          Joined Events
                        </Link>
                      </div>

                      <div className="pt-1 border-t border-border/60">
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors font-medium text-left cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Explicit Logout Button as required by spec */}
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-destructive/30 text-destructive hover:bg-destructive hover:text-white transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            ) : (
              /* If not logged in, show Login button */
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all shadow-md shadow-primary/20 hover:shadow-lg cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-card px-4 pt-2 pb-4 space-y-2">
          <Link
            href="/events"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted text-foreground"
          >
            <CalendarDays className="w-4 h-4 text-primary" />
            Upcoming Events
          </Link>

          {user ? (
            <>
              <div className="flex items-center gap-3 px-3 py-2 border-y border-border/50 my-2">
                <img
                  src={user.photoURL || defaultAvatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-bold text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <Link
                href="/events/create"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted text-foreground"
              >
                <PlusCircle className="w-4 h-4 text-teal-500" />
                Create Event
              </Link>
              <Link
                href="/events/manage"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted text-foreground"
              >
                <Settings className="w-4 h-4 text-indigo-500" />
                Manage Events
              </Link>
              <Link
                href="/events/joined"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted text-foreground"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Joined Events
              </Link>
              <button
                onClick={() => logout()}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 text-left"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-md"
            >
              <LogIn className="w-4 h-4" />
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
}

