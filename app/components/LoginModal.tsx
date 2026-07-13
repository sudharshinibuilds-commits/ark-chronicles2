"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
  initialMode?: "login" | "signup";
};

export default function LoginModal({ isOpen, onClose, onLoginSuccess, initialMode = "login" }: LoginModalProps) {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [college, setCollege] = useState("");
  const [role, setRole] = useState("Reader");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Sync mode with initialMode prop when it changes or when modal is opened
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError("");
      setSuccessMsg("");
    }
  }, [isOpen, initialMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      if (mode === "login") {
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) {
          setError(authError.message);
          setLoading(false);
          return;
        }

        setLoading(false);
        onClose();
        onLoginSuccess?.();
        window.location.reload();
      } else {
        // Signup Flow
        const { data, error: authError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (authError) {
          setError(authError.message);
          setLoading(false);
          return;
        }

        if (data.user) {
          // Insert profile with correct role and fields
          const { error: profileError } = await supabase.from("profiles").insert({
            id: data.user.id,
            email,
            name,
            college,
            role: role.toLowerCase(),
          });

          if (profileError) {
            console.error("Profile insertion error:", profileError);
          }
        }

        setSuccessMsg("Account created successfully! Please check your email to verify your account.");
        setLoading(false);
        // Reset fields
        setName("");
        setCollege("");
        setEmail("");
        setPassword("");
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            style={{ zIndex: 99990 }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 24 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl overflow-hidden shadow-2xl bg-white"
            style={{ zIndex: 99999 }}
          >
            {/* Top brand bar */}
            <div className="px-8 py-5" style={{ backgroundColor: "#1B2A6B" }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-display text-lg font-black uppercase tracking-[0.22em]">
                    <span style={{ color: "#D4A017" }}>A.R.K</span>
                    <span className="ml-2 text-white">CHRONICLES</span>
                  </div>
                  <div className="text-[9px] font-semibold uppercase tracking-[0.22em] mt-0.5" style={{ color: "#9AA3B8" }}>
                    Architects of Rising Knowledge
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full p-1.5 transition-all duration-150 hover:bg-white/10 text-white"
                  aria-label="Close"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="px-8 py-7 max-h-[80vh] overflow-y-auto">
              {/* Tab Selection */}
              <div className="flex mb-6 bg-zinc-100 rounded-full p-1 border border-black/5">
                <button
                  type="button"
                  onClick={() => { setMode("login"); setError(""); setSuccessMsg(""); }}
                  className={`flex-1 py-2 text-center text-xs font-bold rounded-full transition-all ${
                    mode === "login"
                      ? "bg-[#1B2A6B] text-white shadow-sm"
                      : "text-zinc-500 hover:text-zinc-800"
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => { setMode("signup"); setError(""); setSuccessMsg(""); }}
                  className={`flex-1 py-2 text-center text-xs font-bold rounded-full transition-all ${
                    mode === "signup"
                      ? "bg-[#1B2A6B] text-white shadow-sm"
                      : "text-zinc-500 hover:text-zinc-800"
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Status messages */}
              {error && (
                <div className="mb-4 rounded-xl bg-red-50 border border-red-100 p-3.5 text-xs text-red-600 font-medium">
                  {error}
                </div>
              )}

              {successMsg && (
                <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-100 p-3.5 text-xs text-emerald-600 font-medium">
                  {successMsg}
                </div>
              )}

              {/* Heading */}
              <div className="mb-5">
                <h2 className="text-lg font-bold text-gray-900">
                  {mode === "login" ? "Welcome back 👋" : "Create your account ✨"}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  {mode === "login"
                    ? "Sign in to access your ARK Chronicle dashboard."
                    : "Join our decentralized knowledge network."}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "signup" && (
                  <>
                    {/* Full Name */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                        required
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-xs text-gray-900 placeholder-gray-400 outline-none transition-all duration-150 focus:border-[#1B2A6B] focus:ring-2 focus:ring-[#1B2A6B]/10"
                      />
                    </div>

                    {/* College */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                        College / Institution
                      </label>
                      <input
                        type="text"
                        value={college}
                        onChange={(e) => setCollege(e.target.value)}
                        placeholder="e.g. IIT Delhi, BITS Pilani"
                        required
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-xs text-gray-900 placeholder-gray-400 outline-none transition-all duration-150 focus:border-[#1B2A6B] focus:ring-2 focus:ring-[#1B2A6B]/10"
                      />
                    </div>

                    {/* Role dropdown */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                        I am a
                      </label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-xs text-gray-900 bg-white outline-none transition-all duration-150 focus:border-[#1B2A6B] focus:ring-2 focus:ring-[#1B2A6B]/10 font-medium"
                      >
                        <option>Reader</option>
                        <option>Founder</option>
                        <option>Investor</option>
                        <option>Journalist</option>
                      </select>
                    </div>
                  </>
                )}

                {/* Email */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    required
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-xs text-gray-900 placeholder-gray-400 outline-none transition-all duration-150 focus:border-[#1B2A6B] focus:ring-2 focus:ring-[#1B2A6B]/10"
                  />
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={6}
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 pr-11 text-xs text-gray-900 placeholder-gray-400 outline-none transition-all duration-150 focus:border-[#1B2A6B] focus:ring-2 focus:ring-[#1B2A6B]/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl py-2.5 text-xs font-bold text-white transition-all duration-150 hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                  style={{ backgroundColor: "#1B2A6B" }}
                >
                  {loading
                    ? "Processing..."
                    : mode === "login"
                    ? "Sign In →"
                    : "Create Account →"}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
