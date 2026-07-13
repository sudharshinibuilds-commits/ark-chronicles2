"use client";

import Link from "next/link";
import { useState } from "react";

function SocialIcon({ label }: { label: string }) {
  return (
    <Link
      href="#"
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-sm font-semibold text-white transition-all duration-150 hover:scale-105 hover:border-ark-gold hover:bg-ark-gold hover:text-ark-navy"
    >
      {label}
    </Link>
  );
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        alert("Thank you for subscribing to ARK Chronicles! Your node is registered.");
        setEmail("");
      } else {
        const err = await res.json();
        alert(err.error || "Subscription failed. Please verify email format.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error subscribing to newsletter.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer id="footer" className="mt-14 bg-ark-navy text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.8fr_0.8fr_1fr] lg:px-8">
        <div id="about-ark">
          <div className="font-display text-3xl font-bold uppercase tracking-[0.18em]">
            <span className="text-ark-gold">A.</span>
            <span className="text-white">R.</span>
            <span className="text-ark-gold">K</span>
          </div>
          <div className="mt-2 font-display text-2xl font-bold text-white">
            CHRONICLES
          </div>
          <p className="mt-4 max-w-sm text-sm leading-7 text-white/75">
            Architects of Rising Knowledge for founders, investors, and builders
            navigating the next chapter of startup ambition.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <SocialIcon label="in" />
            <SocialIcon label="X" />
            <SocialIcon label="IG" />
            <SocialIcon label="YT" />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-ark-gold">
            Sections
          </h3>
          <div className="mt-4 flex flex-col gap-3 text-sm text-white/80">
            <Link href="/chronicles">Chronicles</Link>
            <Link href="/founders">Founders</Link>
            <Link href="/investors">Investors</Link>
            <Link href="/research">Research</Link>
            <Link href="/opportunities">Opportunities</Link>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-ark-gold">
            Company
          </h3>
          <div className="mt-4 flex flex-col gap-3 text-sm text-white/80">
            <Link href="/about">About Us</Link>
            <Link href="/founders">Founders Desk</Link>
            <Link href="/college-collabs">College Collabs</Link>
            <Link href="/submit-story">Submit Story</Link>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-ark-gold">
            Legal
          </h3>
          <div className="mt-4 flex flex-col gap-3 text-sm text-white/80">
            <Link href="#">Privacy Policy</Link>
            <Link href="#">Terms of Use</Link>
            <Link href="#">Cookie Policy</Link>
          </div>

          <form onSubmit={handleSubmit} className="mt-8">
            <label
              htmlFor="newsletter-email"
              className="text-sm font-semibold uppercase tracking-[0.2em] text-white"
            >
              Newsletter
            </label>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email address"
                className="min-w-0 flex-1 rounded-full border border-white/20 bg-white px-4 py-3 text-sm text-ark-black outline-none transition-colors duration-150 placeholder:text-zinc-500 focus:border-ark-gold"
              />
              <button
                type="submit"
                disabled={submitting}
                className="rounded-full bg-ark-gold px-5 py-3 text-sm font-semibold text-ark-navy transition-all duration-150 hover:scale-105 hover:bg-[#e1b54b] disabled:opacity-50"
              >
                {submitting ? "..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-sm text-white/65 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>© 2026 ARK CHRONICLES. All rights reserved.</div>
          <div>Built for founders, operators, and believers in rising knowledge.</div>
        </div>
      </div>
    </footer>
  );
}
