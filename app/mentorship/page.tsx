"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AudioPlayer from "../components/AudioPlayer";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LiveTicker from "../components/LiveTicker";

export default function MentorshipPage() {
  const currentDate = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExpertise, setSelectedExpertise] = useState("All");

  // Booking states
  const [bookingMentor, setBookingMentor] = useState<any | null>(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingSlot, setBookingSlot] = useState("");
  const [bookingTopic, setBookingTopic] = useState("");
  const [bookingConfirmed, setBookingConfirmed] = useState<any | null>(null);

  const domains = ["All", "AI/ML", "ClimateTech", "Biotech", "Fundraising", "SaaS Scale"];

  const mockMentors = [
    {
      id: "mentor-1",
      name: "Dr. Srinivas Rao",
      title: "Head of AI Research",
      institution: "KLH AI Lab",
      domain: "AI/ML",
      bio: "Academic researcher specializing in swarm systems and routing layers. Happy to review research papers, patent formulations, and algorithmic limits.",
      avatar: "https://picsum.photos/seed/sri/150/150",
      topics: ["Research Feedback", "Algorithm Review", "Patent Drafting"],
    },
    {
      id: "mentor-2",
      name: "Aditya Vora",
      title: "General Partner",
      institution: "Vora Capital",
      domain: "Fundraising",
      bio: "Operator VC backing early seed stage teams working in Deep Tech and Climate Hardware. Reviewing pitch structures and unit-economics models.",
      avatar: "https://picsum.photos/seed/aditya/150/150",
      topics: ["Pitch Review", "Capital Strategy", "Market Sizing"],
    },
    {
      id: "mentor-3",
      name: "Priya Sharma",
      title: "Founder & CEO",
      institution: "Zyra Bio",
      domain: "ClimateTech",
      bio: "Scaling climate hardware and biomaterials startups. Specialist in supply chains, bootstrapping, and enterprise validation loops.",
      avatar: "https://picsum.photos/seed/priya/150/150",
      topics: ["Scale Sprints", "Bootstrapping Guide", "Partnership Pitch"],
    },
  ];

  const filteredMentors = mockMentors.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.bio.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDomain = selectedExpertise === "All" || m.domain === selectedExpertise;
    return matchesSearch && matchesDomain;
  });

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingConfirmed({
      mentorName: bookingMentor.name,
      date: bookingDate,
      time: bookingSlot,
      topic: bookingTopic || "General Mentorship Q&A",
      meetingNo: `ARK-MEET-${Math.floor(100000 + Math.random() * 900000)}`,
    });
    setBookingMentor(null);
  };

  return (
    <main className="min-h-screen bg-[#faf9f6]">
      <Header
        currentDate={currentDate}
        navLinks={[
          { label: "Home", href: "/" },
          { label: "Chronicles", href: "/chronicles" },
          { label: "Founders", href: "/founders" },
          { label: "Magazines", href: "/magazines" },
          { label: "Research", href: "/research" },
          { label: "Investors", href: "/investors" },
          { label: "Opportunities", href: "/opportunities" },
          { label: "College Collabs", href: "/college-collabs" },
          { label: "Submit Story", href: "/submit-story" },
          { label: "About Us", href: "/about" },
        ]}
        cityLinks={[
          { label: "Bengaluru", href: "#" },
          { label: "Mumbai", href: "#" },
          { label: "Delhi", href: "#" },
          { label: "Hyderabad", href: "#" },
        ]}
      />
      <LiveTicker
        items={[
          "Zyra Bio closes a $14M seed round to scale climate-first materials for advanced manufacturing.",
          "Founders in Bengaluru launch a cross-border fintech rail for emerging market exporters.",
          "ARK Research briefs investors on AI-native industrial software and deep-tech resilience.",
          "Mumbai mobility startup reports 3x retention growth after rolling out community-led fleet financing.",
          "Delhi health-tech collective opens applications for its women-led diagnostics accelerator cohort.",
        ]}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-5xl font-bold text-ark-black">Mentorship Platform</h1>
            <p className="mt-2 text-xl text-ark-navy">Book Private Advisory sessions with Elite Operators</p>
          </div>

          <div className="relative max-w-xs w-full">
            <input
              type="text"
              placeholder="Search mentors by name, title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm outline-none focus:border-ark-navy focus:ring-1 focus:ring-ark-navy"
            />
            <span className="absolute right-4 top-3 text-zinc-400">🔍</span>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-wrap gap-2">
          {domains.map((dom) => (
            <button
              key={dom}
              type="button"
              onClick={() => setSelectedExpertise(dom)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide transition-all ${
                selectedExpertise === dom
                  ? "bg-ark-navy text-white shadow-md"
                  : "border border-black/10 bg-white text-zinc-650 hover:bg-zinc-50"
              }`}
            >
              {dom}
            </button>
          ))}
        </div>

        {/* Mentors Grid list */}
        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredMentors.map((m) => (
            <div
              key={m.id}
              className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-black/8 bg-white p-6 shadow-lg transition-all duration-150 hover:scale-[1.02]"
            >
              <div className="text-center md:text-left flex flex-col md:flex-row gap-4 items-center md:items-start border-b border-black/5 pb-4">
                <img src={m.avatar} alt={m.name} className="h-16 w-16 rounded-full object-cover ring-2 ring-ark-gold/25 shrink-0" />
                <div>
                  <h3 className="font-display text-xl font-bold text-ark-black">{m.name}</h3>
                  <p className="text-xs text-ark-navy font-bold uppercase tracking-wider">{m.title}</p>
                  <p className="text-[10px] text-zinc-500 font-semibold">{m.institution}</p>
                </div>
              </div>

              <div className="py-4">
                <p className="text-xs text-zinc-600 leading-relaxed line-clamp-4">{m.bio}</p>

                <div className="mt-4">
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">Available for:</span>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {m.topics.map((t) => (
                      <span key={t} className="rounded bg-ark-navy/5 px-2 py-0.5 text-[9px] font-bold text-ark-navy">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-black/5 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setBookingMentor(m);
                    setBookingDate("");
                    setBookingSlot("");
                    setBookingTopic("");
                  }}
                  className="w-full rounded-full bg-ark-navy py-2.5 text-xs font-bold text-white transition-all hover:bg-[#22378c]"
                >
                  Book 1-on-1 Session
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Calendar Modal */}
      <AnimatePresence>
        {bookingMentor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-black/5"
            >
              <h3 className="font-display text-xl font-bold text-ark-black border-b border-black/5 pb-2">
                Book Mentorship Session
              </h3>
              <p className="text-xs text-zinc-450 mt-1">Mentor: {bookingMentor.name}</p>

              <form onSubmit={handleBookingSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Select Date</label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full rounded-full border border-black/10 px-4 py-2.5 text-sm bg-white outline-none focus:border-ark-navy"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Select Time Slot</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["10:00 AM - 10:45 AM", "2:00 PM - 2:45 PM", "4:00 PM - 4:45 PM", "6:00 PM - 6:45 PM"].map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setBookingSlot(slot)}
                        className={`rounded-full py-2 text-[10px] font-bold border transition-all ${
                          bookingSlot === slot
                            ? "bg-ark-navy text-white border-ark-navy"
                            : "bg-white border-black/10 text-zinc-650 hover:bg-zinc-50"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Review Topic</label>
                  <select
                    value={bookingTopic}
                    onChange={(e) => setBookingTopic(e.target.value)}
                    className="w-full rounded-full border border-black/10 px-4 py-2.5 text-xs bg-white outline-none focus:border-ark-navy"
                  >
                    <option value="">Select advisory topic</option>
                    {bookingMentor.topics.map((t: string) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="mt-6 flex gap-2">
                  <button
                    type="submit"
                    disabled={!bookingDate || !bookingSlot}
                    className="flex-1 rounded-full bg-ark-gold py-3 text-xs font-bold text-ark-navy hover:bg-[#e1b54b] disabled:opacity-40"
                  >
                    Request Advisory Session
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookingMentor(null)}
                    className="rounded-full bg-zinc-100 px-4 py-3 text-xs font-bold text-zinc-700 hover:bg-zinc-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmation Pass Modal */}
      <AnimatePresence>
        {bookingConfirmed && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-3xl bg-[#faf9f6] p-6 text-center shadow-xl border border-black/10"
            >
              <span className="text-4xl">🎉</span>
              <h3 className="mt-4 font-display text-xl font-bold text-ark-black">Session Requested</h3>
              <p className="mt-2 text-xs text-zinc-550">
                Your private advisory request has been sent to <span className="font-semibold text-ark-navy">{bookingConfirmed.mentorName}</span>.
              </p>

              <div className="my-4 rounded-2xl bg-white p-4 border border-black/5 text-left space-y-2 text-xs leading-relaxed">
                <div>
                  <span className="text-[10px] text-zinc-400 font-bold block">Advisory Topic:</span>
                  <span className="font-bold text-ark-navy">{bookingConfirmed.topic}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 font-bold block">Scheduled Slot:</span>
                  <span className="font-bold text-zinc-700">{bookingConfirmed.date} at {bookingConfirmed.time}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 font-bold block">Simulated Meeting Code:</span>
                  <span className="font-mono text-zinc-500 font-bold">{bookingConfirmed.meetingNo}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setBookingConfirmed(null)}
                className="w-full rounded-full bg-ark-navy py-3 text-xs font-bold text-white hover:bg-[#22378c]"
              >
                Close & Save Pass
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
      <AudioPlayer />
    </main>
  );
}
