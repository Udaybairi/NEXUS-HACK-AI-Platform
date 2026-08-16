"use client";

import { motion } from "framer-motion";
import { Building2, Award, ExternalLink, Briefcase, Sparkles, HeartHandshake, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function SponsorsPage() {
  const sponsorsList = [
    {
      name: "BlackRock",
      tier: "Title Sponsor",
      description: "Global leader in investment management, fintech innovation, and risk analytics. Sponsoring the FinTech challenge track and hosting exclusive coding workshops.",
      website: "https://www.blackrock.com",
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    },
    {
      name: "Nexmo / Vonage",
      tier: "Title Sponsor",
      description: "Leading cloud communications platform providing voice, SMS, and video APIs. Providing API access credits and hosting telephony workshops.",
      website: "https://www.vonage.com",
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    },
    {
      name: "Edinburgh Innovations",
      tier: "Platinum Sponsor",
      description: "The University of Edinburgh's commercialization service helping hackers turn innovative software & hardware builds into venture-backed startups.",
      website: "https://www.edinburgh-innovations.ed.ac.uk",
      badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    },
    {
      name: "Major League Hacking (MLH)",
      tier: "Official Hackathon League",
      description: "The official student hackathon league powering hackathons globally. Providing trust badge certification, hardware lab gear, and social events.",
      website: "https://mlh.io",
      badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    },
    {
      name: "RS Components",
      tier: "Hardware Partner",
      description: "Global distributor of electronics, robotics components, soldering stations, microcontrollers, and engineering tools for hackers.",
      website: "https://www.rs-components.com",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    },
    {
      name: "Embedded & Robotics Society (EERS)",
      tier: "Host Society",
      description: "Student-run society at the University of Edinburgh bringing together passionate hardware hackers, embedded engineers, and AI developers.",
      website: "https://createdhack.com",
      badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
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
          <HeartHandshake className="w-3.5 h-3.5" />
          <span>OUR SPONSORS & PARTNERS</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          Empowered by <span className="gradient-text">Industry Leaders</span>
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed">
          CreatED Hack is made possible by amazing partner companies actively hiring for internships, graduate roles, and hardware/AI engineering positions.
        </p>
      </motion.div>

      {/* Sponsors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sponsorsList.map((sponsor, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="glass-panel p-6 rounded-3xl border border-slate-800 hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between space-y-5 group bg-slate-950/70"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-bold border ${sponsor.badgeColor}`}>
                  {sponsor.tier}
                </span>
                <Building2 className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 transition-colors" />
              </div>

              <h3 className="text-2xl font-extrabold text-white group-hover:text-indigo-300 transition-colors">
                {sponsor.name}
              </h3>

              <p className="text-xs text-slate-400 leading-relaxed">{sponsor.description}</p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-emerald-400 font-mono font-semibold flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5" /> Hiring Hackers
              </span>
              <a
                href={sponsor.website}
                target="_blank"
                rel="noreferrer"
                className="text-slate-300 hover:text-white font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform"
              >
                <span>Visit Sponsor</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Sponsorship Opportunities CTA */}
      <section className="glass-panel rounded-3xl p-8 sm:p-12 border border-indigo-500/30 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/50 relative overflow-hidden text-center space-y-6">
        <div className="max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-400">PARTNER WITH US</span>
          <h2 className="text-3xl font-extrabold text-white">Interested in Sponsoring CreatED Hack?</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Gain direct access to top hardware, robotics, and software engineering talent from the University of Edinburgh and across the UK.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/chat"
            className="gradient-button text-white text-xs font-semibold px-6 py-3 rounded-xl inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Ask AI Sponsor Packet</span>
          </Link>
          <a
            href="mailto:sponsor@createdhack.com"
            className="px-6 py-3 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white transition-colors"
          >
            Contact Sponsorship Team
          </a>
        </div>
      </section>
    </div>
  );
}
