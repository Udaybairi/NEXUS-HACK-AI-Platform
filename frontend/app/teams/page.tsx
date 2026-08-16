"use client";

import { motion } from "framer-motion";
import { Users, Globe, Code2, Sparkles, Cpu, ShieldCheck } from "lucide-react";

export default function TeamsPage() {
  const teamMembers = [
    {
      name: "Alex Cameron",
      role: "Hackathon President",
      bio: "Final-year Electronics & Computer Science student leading CreatED 2026 operations and organizer strategy.",
      avatar: "AC",
      socials: { github: "https://github.com", linkedin: "https://linkedin.com" },
    },
    {
      name: "Dr. Elena Rostova",
      role: "Hardware & Robotics Lead",
      bio: "Embedded Systems researcher managing the 24-hour hardware lab, component stocking, and 3D printing stations.",
      avatar: "ER",
      socials: { github: "https://github.com", linkedin: "https://linkedin.com" },
    },
    {
      name: "Marcus Vance",
      role: "Head of Sponsorships",
      bio: "Connecting industry leaders like BlackRock, Vonage, and Edinburgh Innovations with student builders.",
      avatar: "MV",
      socials: { github: "https://github.com", linkedin: "https://linkedin.com" },
    },
    {
      name: "Sophia Chen",
      role: "Logistics & Venue Manager",
      bio: "Overseeing Appleton Tower Concourse logistics, hacker catering, sleeping lounge, and security compliance.",
      avatar: "SC",
      socials: { github: "https://github.com", linkedin: "https://linkedin.com" },
    },
    {
      name: "Liam O'Connor",
      role: "AI Platform & Tech Lead",
      bio: "Architecting the Grounded RAG Search pipeline, Web Speech AI Assistant, and automated submission grading.",
      avatar: "LO",
      socials: { github: "https://github.com", linkedin: "https://linkedin.com" },
    },
    {
      name: "Maya Patel",
      role: "Participant Experience & MLH Liaison",
      bio: "Managing hacker check-in, mentor allocation, social games, and MLH code of conduct enforcement.",
      avatar: "MP",
      socials: { github: "https://github.com", linkedin: "https://linkedin.com" },
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4 max-w-3xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-mono font-semibold border border-indigo-500/30">
          <Users className="w-3.5 h-3.5" />
          <span>MEET THE ORGANIZERS</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          The Team Behind <span className="gradient-text">CreatED Hack</span>
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed">
          Organized by the University of Edinburgh Embedded & Robotics Society (EERS). Meet the committee working behind the scenes to deliver Scotland's premiere hardware & AI hackathon.
        </p>
      </motion.div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="glass-panel p-6 rounded-3xl border border-slate-800 hover:border-indigo-500/40 transition-all duration-300 space-y-4 bg-slate-950/80 group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white font-extrabold text-lg shadow-lg group-hover:scale-105 transition-transform">
                {member.avatar}
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-white group-hover:text-indigo-300 transition-colors">
                  {member.name}
                </h3>
                <span className="text-xs font-mono text-indigo-400 font-semibold">{member.role}</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">{member.bio}</p>

            <div className="pt-3 border-t border-slate-800/80 flex items-center space-x-3 text-slate-400">
              <a href={member.socials.github} target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-1 text-xs">
                <Code2 className="w-4 h-4 text-indigo-400" /> GitHub
              </a>
              <a href={member.socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-indigo-400 transition-colors flex items-center gap-1 text-xs">
                <Globe className="w-4 h-4 text-purple-400" /> LinkedIn
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
