"use client";

import { useState } from "react";
import AudioPlayer from "../components/AudioPlayer";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LiveTicker from "../components/LiveTicker";

export default function CampusAmbassadorPage() {
  const currentDate = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const [tasks, setTasks] = useState([
    { id: "t-1", title: "Conduct an On-Campus AI Workshop", points: 150, status: "Available" },
    { id: "t-2", title: "Share Weekly Opportunities Digest in WhatsApp groups", points: 50, status: "Available" },
    { id: "t-3", title: "Onboard 5 Builders to the Directory", points: 100, status: "Available" },
    { id: "t-4", title: "Host a Meetup / Fireside Chat with a Founder", points: 200, status: "Available" },
  ]);

  const mockAmbassadors = [
    { rank: 1, name: "Siddharth Verma", college: "KLH Hyderabad", points: 1250, tasksDone: 14 },
    { rank: 2, name: "Ananya Sen", college: "IIT Bombay", points: 950, tasksDone: 9 },
    { rank: 3, name: "Vikram Malhotra", college: "BITS Pilani", points: 740, tasksDone: 7 },
    { rank: 4, name: "Riya Sharma", college: "NSUT Delhi", points: 410, tasksDone: 4 },
  ];

  const rewards = [
    { title: "ARK Chronicles Merch Hoodie", pointsCost: 500, icon: "🧥" },
    { title: "VIP Innovation Pass (Summit 2026)", pointsCost: 1000, icon: "🎟️" },
    { title: "1-on-1 Mentorship advisory hour", pointsCost: 300, icon: "🎓" },
  ];

  const handleSubmitProof = (taskId: string) => {
    alert("Proof of task submitted (e.g. photos/links). Review will complete within 24 hours!");
    setTasks(
      tasks.map((t) => {
        if (t.id === taskId) {
          return { ...t, status: "Pending Review" };
        }
        return t;
      })
    );
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
        <div>
          <h1 className="font-display text-5xl font-bold text-ark-black">Ambassador Program</h1>
          <p className="mt-2 text-xl text-ark-navy">Campus Leaders Driving Local Innovation</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 mt-10">
          {/* Active tasks list */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-3xl border border-black/8 bg-white p-6 shadow-md">
              <h3 className="font-display text-2xl font-bold text-ark-black border-b border-black/5 pb-2">Active Task Board</h3>
              <div className="mt-4 space-y-4">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-black/5 gap-4"
                  >
                    <div>
                      <h4 className="font-semibold text-sm text-ark-black">{task.title}</h4>
                      <p className="text-[10px] text-zinc-450 font-bold uppercase mt-1">Value: {task.points} Points</p>
                    </div>

                    <button
                      type="button"
                      disabled={task.status !== "Available"}
                      onClick={() => handleSubmitProof(task.id)}
                      className={`rounded-full px-5 py-2.5 text-xs font-bold transition-all ${
                        task.status === "Available"
                          ? "bg-ark-navy text-white hover:bg-[#22378c]"
                          : "bg-zinc-150 text-zinc-400 cursor-not-allowed"
                      }`}
                    >
                      {task.status === "Available" ? "Submit Proof ✓" : "Review Pending ⏳"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Rewards Redemption catalog */}
            <div className="rounded-3xl border border-black/8 bg-white p-6 shadow-md">
              <h3 className="font-display text-2xl font-bold text-ark-black border-b border-black/5 pb-2">Redeem Rewards</h3>
              <div className="grid gap-4 sm:grid-cols-3 mt-4">
                {rewards.map((rew, i) => (
                  <div
                    key={i}
                    className="p-4 bg-zinc-50 rounded-2xl border border-black/5 text-center flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-3xl block">{rew.icon}</span>
                      <h4 className="text-xs font-bold text-ark-black mt-2 leading-snug">{rew.title}</h4>
                      <p className="text-[10px] text-ark-gold font-bold mt-1">{rew.pointsCost} Points</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => alert(`Claiming Reward: "${rew.title}". Points balance deducted!`)}
                      className="mt-4 w-full rounded-full bg-ark-navy py-2 text-[10px] font-bold text-white hover:bg-[#22378c]"
                    >
                      Redeem Pass
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Leaderboard panel */}
          <div className="lg:col-span-1">
            <div className="rounded-3xl border border-black/8 bg-white p-6 shadow-lg">
              <h3 className="font-display text-xl font-bold text-ark-black border-b border-black/5 pb-2">
                Leaderboard Roster
              </h3>
              <div className="mt-4 space-y-4">
                {mockAmbassadors.map((amb) => (
                  <div
                    key={amb.rank}
                    className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl border border-black/5"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-ark-navy">#{amb.rank}</span>
                      <div>
                        <h4 className="text-xs font-bold text-ark-black">{amb.name}</h4>
                        <p className="text-[9px] text-zinc-400 font-semibold">{amb.college}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-ark-gold">{amb.points} pts</span>
                      <p className="text-[9px] text-zinc-450 font-semibold">{amb.tasksDone} tasks done</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <AudioPlayer />
    </main>
  );
}
