"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Cpu, Code2, Rocket, Radio, CheckCircle2, Bot } from "lucide-react";
import Link from "next/link";

interface ScheduleItem {
  time: string;
  title: string;
  track: "main" | "workshop";
  description?: string;
  speaker?: string;
}

export default function ScheduleWorkshopsPage() {
  const [activeTab, setActiveTab] = useState<"sat" | "sun">("sat");

  const saturdayEvents: ScheduleItem[] = [
    { time: "10:00 AM", title: "Check-In & Hardware Lab Opens", track: "main", description: "Collect hacker badges, welcome hardware swag kits, and register hardware components." },
    { time: "11:00 AM", title: "Opening Keynote & Rules Briefing", track: "main", description: "Official event kickoff presented by the Embedded & Robotics Society & Sponsors." },
    { time: "12:00 PM", title: "Hacking Begins & Team Lock-In", track: "main", description: "24-hour hacking timer commences. Hacking spaces and soldering benches active." },
    { time: "12:15 PM - 01:15 PM", title: "Workshop 1: Intro to Microcontrollers & Sensors", track: "workshop", description: "Hands-on sensor setup with Arduino & Raspberry Pi.", speaker: "CreatED Hardware Team" },
    { time: "01:00 PM", title: "Free Hacker Lunch & Sponsor Lounge", track: "main", description: "Catered lunch at Appleton Tower Concourse." },
    { time: "01:30 PM - 02:30 PM", title: "Workshop 2: Algorithmic Coding Challenge", track: "workshop", description: "Quantitative problem solving & algorithm design.", speaker: "BlackRock Engineering" },
    { time: "03:00 PM - 04:00 PM", title: "Workshop 3: Startup Entrepreneurship & Pitching", track: "workshop", description: "Turning hackathon builds into commercial startups.", speaker: "Edinburgh Innovations" },
    { time: "05:00 PM - 06:00 PM", title: "Workshop 4: Voice APIs & Telecommunications", track: "workshop", description: "Integrating real-time speech and telephony into apps.", speaker: "Nexmo / Vonage" },
    { time: "07:00 PM", title: "Free Dinner & Networking", track: "main", description: "Dinner buffet served for all registered participants." },
    { time: "08:00 PM - 09:00 PM", title: "MLH Werewolf Social Game", track: "workshop", description: "Fun community game session hosted by MLH reps.", speaker: "Major League Hacking" },
    { time: "09:00 PM", title: "Sleep Drop-In Lounge Opens", track: "main", description: "Quiet rest areas and sleeping pods accessible." },
  ];

  const sundayEvents: ScheduleItem[] = [
    { time: "00:00 AM", title: "Midnight Pizza Feast", track: "main", description: "Late-night fuel for overnight hackers." },
    { time: "08:00 AM", title: "Breakfast & Espresso Bar", track: "main", description: "Fresh pastries, coffee, and energy drinks." },
    { time: "12:00 PM", title: "Hacking Ends & Hard Submission Deadline", track: "main", description: "All repositories, videos, and devpost links must be submitted." },
    { time: "01:15 PM - 02:30 PM", title: "Live Pitching & Hardware Demo Judging", track: "main", description: "Judges review physical hardware tables and software demos." },
    { time: "03:00 PM - 04:00 PM", title: "Closing Ceremony & Award Presentation", track: "main", description: "Announcing track winners and $50,000 prize distribution." },
    { time: "05:00 PM", title: "Venue Closes", track: "main", description: "Wrap-up and departure." },
  ];

  const currentEvents = activeTab === "sat" ? saturdayEvents : sundayEvents;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4 max-w-3xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-mono font-semibold border border-indigo-500/30">
          <Calendar className="w-3.5 h-3.5" />
          <span>CREATED HACK '26 DUAL TRACK SCHEDULE</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          Event Timetable & <span className="gradient-text">Workshops</span>
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed">
          Appleton Tower Concourse, The University of Edinburgh. Explore main event milestones side-by-side with sponsor-led technical workshops.
        </p>
      </motion.div>

      {/* Tab Switcher */}
      <div className="flex justify-center">
        <div className="p-1 rounded-2xl glass-panel border border-slate-800 flex space-x-2">
          <button
            onClick={() => setActiveTab("sat")}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === "sat"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Saturday (Day 1)
          </button>
          <button
            onClick={() => setActiveTab("sun")}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === "sun"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Sunday (Day 2)
          </button>
        </div>
      </div>

      {/* Schedule Timetable Grid */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Main Track Column */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                <Rocket className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-extrabold text-white">Main Track Milestones</h3>
            </div>

            <div className="space-y-3">
              {currentEvents
                .filter((e) => e.track === "main")
                .map((ev, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-indigo-500/40 transition-colors space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">
                        {ev.time}
                      </span>
                      <span className="text-slate-500">Appleton Concourse</span>
                    </div>
                    <h4 className="text-base font-bold text-white pt-1">{ev.title}</h4>
                    {ev.description && <p className="text-xs text-slate-400">{ev.description}</p>}
                  </motion.div>
                ))}
            </div>
          </div>

          {/* Workshops Track Column */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                <Code2 className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-extrabold text-white">Workshops & Socials</h3>
            </div>

            <div className="space-y-3">
              {currentEvents.filter((e) => e.track === "workshop").length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm font-mono italic">
                  No workshops scheduled for this morning. Focus on finalizing hacks & submission demos!
                </div>
              ) : (
                currentEvents
                  .filter((e) => e.track === "workshop")
                  .map((ev, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="p-4 rounded-2xl bg-slate-900/80 border border-purple-500/30 hover:border-purple-500/60 transition-colors space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
                          {ev.time}
                        </span>
                        {ev.speaker && (
                          <span className="text-purple-400 font-semibold flex items-center gap-1">
                            <Bot className="w-3 h-3" /> {ev.speaker}
                          </span>
                        )}
                      </div>
                      <h4 className="text-base font-bold text-white">{ev.title}</h4>
                      {ev.description && <p className="text-xs text-slate-400">{ev.description}</p>}
                    </motion.div>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
