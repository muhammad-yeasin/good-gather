"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { toast } from "sonner";
import {
  HeartHandshake,
  User,
  Mail,
  Image as ImageIcon,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  Check,
  X,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Password Validation criteria: uppercase, lowercase, >= 6 characters
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const isMinLength = password.length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim()) {
      setErrorMsg("Please enter your full name.");
      toast.error("Name is required.");
      return;
    }

    if (!email.trim()) {
      setErrorMsg("Please enter your email address.");
      toast.error("Email is required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMsg("Please enter a valid email address.");
      toast.error("Invalid email address format.");
      return;
    }

    // Explicit check for assignment requirement
    if (!hasUppercase) {
      const msg = "Password must contain at least one uppercase letter.";
      setErrorMsg(msg);
      toast.error(msg);
      return;
    }

    if (!hasLowercase) {
      const msg = "Password must contain at least one lowercase letter.";
      setErrorMsg(msg);
      toast.error(msg);
      return;
    }

    if (!isMinLength) {
      const msg = "Password must be at least 6 characters long.";
      setErrorMsg(msg);
      toast.error(msg);
      return;
    }

    setIsSubmitting(true);
    const finalPhotoURL =
      photoURL.trim() ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80";

    const success = await register(
      name.trim(),
      email.trim(),
      password,
      finalPhotoURL
    );
    setIsSubmitting(false);

    if (success) {
      router.push("/events");
      router.refresh();
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md mx-auto p-6 sm:p-8 rounded-3xl border border-border bg-card shadow-xl">
        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-md shadow-teal-500/25 mb-1">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">
            Create Account
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Join the community and start driving social change
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
            {errorMsg}
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tanvir Ahmed"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              />
            </div>
          </div>

          {/* photoURL */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">
              Profile Photo URL
            </label>
            <div className="relative">
              <ImageIcon className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              />
            </div>
            <p className="text-[11px] text-muted-foreground">
              Optional: Leave empty for default avatar
            </p>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Validation Checklist */}
            <div className="pt-2 grid grid-cols-1 gap-1 text-[11px]">
              <div
                className={`flex items-center gap-1.5 ${
                  hasUppercase ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-muted-foreground"
                }`}
              >
                {hasUppercase ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5 text-muted-foreground/60" />}
                <span>At least one uppercase letter (A-Z)</span>
              </div>
              <div
                className={`flex items-center gap-1.5 ${
                  hasLowercase ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-muted-foreground"
                }`}
              >
                {hasLowercase ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5 text-muted-foreground/60" />}
                <span>At least one lowercase letter (a-z)</span>
              </div>
              <div
                className={`flex items-center gap-1.5 ${
                  isMinLength ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-muted-foreground"
                }`}
              >
                {isMinLength ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5 text-muted-foreground/60" />}
                <span>Minimum 6 characters length</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-3 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-md hover:opacity-95 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Register</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Redirect to Login */}
        <div className="mt-6 text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-bold text-primary hover:underline ml-1"
          >
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}

