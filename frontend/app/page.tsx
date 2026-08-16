"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import TrackCard from "@/components/TrackCard";
import AnimatedCard from "@/components/AnimatedCard";
import { Sparkles, Bot, Rocket, ShieldCheck, HelpCircle, Trophy, Calendar, CheckCircle2, ArrowRight, Cpu, ExternalLink, Users, Code } from "lucide-react";

export default function Home() {
  const tracks = [
    {
      title: "Generative AI & Search",
      category: "Track 1",
      description: "Build verifiable, citation-backed AI systems leveraging vector databases and hybrid semantic retrieval.",
      prize: "$25,000 Prize",
      tags: ["VectorDB", "FastAPI", "LLM"],
      iconName: "cpu"
    },
    {
      title: "FinTech & DeFI Analytics",
      category: "Track 2",
      description: "Develop intelligent automated financial risk evaluation tools supported by BlackRock engineering.",
      prize: "$15,000 Prize",
      tags: ["BlackRock", "FinTech", "Analytics"],
      iconName: "dollar"
    },
    {
      title: "Healthcare & MedTech AI",
      category: "Track 3",
      description: "Create AI tools for medical record processing, diagnostic assistance, and clinical hardware sensors.",
      prize: "$5,000 Prize",
      tags: ["MedTech", "Healthcare", "Sensors"],
      iconName: "activity"
    },
    {
      title: "Hardware & Robotics",
      category: "Track 4",
      description: "Physical devices, microcontrollers, Raspberry Pi systems, and open hardware robotics innovations.",
      prize: "$5,000 Prize",
      tags: ["Hardware", "IoT", "Robotics"],
      iconName: "sparkles"
    }
  ];

  const pastProjects = [
    {
      title: "BioSense Haptic Glove",
      track: "Best Hardware Hack",
      description: "Custom PCB haptic feedback glove assisting stroke rehabilitation patients using sensor telemetry.",
      devpostUrl: "https://created-april-2018.devpost.com/",
      badge: "1st Place 2018",
    },
    {
      title: "NeuroRAG Voice Assistant",
      track: "Best AI Innovation",
      description: "Offline edge-AI voice model querying hospital guidelines with verified source citations.",
      devpostUrl: "https://created-april-2018.devpost.com/",
      badge: "CreatED Winner",
    },
    {
      title: "BlackRock Risk Engine",
      track: "FinTech Track Winner",
      description: "Real-time algorithmic portfolio stress-testing dashboard built during the 24-hour sprint.",
      devpostUrl: "https://created-april-2018.devpost.com/",
      badge: "Sponsor Award",
    },
  ];

  const faqList = [
    {
      q: "How does the AI Voice Assistant answer questions?",
      a: "Our voice assistant indexes official Nexus Hack rules, schedule, track details, and judging rubrics. It performs vector retrieval in real-time and speaks back grounded answers with source citations."
    },
    {
      q: "What hardware lab equipment is provided at Appleton Tower?",
      a: "We supply Arduino, Raspberry Pi, sensor kits, soldering stations, wire strippers, 3D printers, and electronic component kits for all registered hackers."
    },
    {
      q: "What is the maximum team size allowed?",
      a: "Teams can consist of 1 to 4 participants. You can register as an existing team or join our team formation speed networking on Saturday morning."
    },
    {
      q: "When is the project submission hard deadline?",
      a: "All final code repositories, demo videos, and project documentation must be submitted by Sunday at 12:00 PM EST via the participant dashboard."
    }
  ];

  return (
    <div className="space-y-28 pb-20">
      {/* Hero Section with 3D Canvas */}
      <Hero />

      {/* CreatED About Diagonal Section (Matching Reference) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-panel p-8 sm:p-12 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 relative overflow-hidden space-y-6 shadow-2xl"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-6">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-400">ORGANIZED BY EERS</span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mt-1">About CreatED Hack</h2>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href="/workshops"
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
              >
                View 2-Day Schedule
              </Link>
              <Link
                href="/register"
                className="gradient-button text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-lg"
              >
                Apply Now
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-slate-300 leading-relaxed">
            <p>
              CreatED is Scotland's premiere 24-hour hardware & AI hackathon organised by the University of Edinburgh Embedded & Robotics Society (EERS). We bring together students from top universities across the UK to build physical electronics, robotics, and grounded AI models.
            </p>
            <p>
              Hosted at the iconic <strong className="text-white">Appleton Tower Concourse</strong>, hackers get access to free hardware kits, catered meals, midnight pizza, expert industry workshops by <strong className="text-indigo-300">BlackRock</strong> & <strong className="text-purple-300">Nexmo</strong>, and $50,000 in prizes.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Challenge Tracks Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-3 mb-12"
        >
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-400">CHALLENGE CATEGORIES</span>
          <h2 className="text-3xl sm:text-5xl font-black text-white">Hackathon Challenge Tracks</h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">Choose a track that aligns with your passion and build high-impact hardware & AI solutions.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tracks.map((track, i) => (
            <TrackCard key={i} {...track} />
          ))}
        </div>
      </section>

      {/* Past Projects Showcase Section (Matching createdhack Reference) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-400">PROJECT INSPIRATION</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Featured Past Winners</h2>
          <p className="text-sm text-slate-400 max-w-lg mx-auto">Explore previous winning hardware & software projects built at CreatED Hack.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pastProjects.map((proj, idx) => (
            <AnimatedCard key={idx} className="p-6 glass-panel border border-slate-800 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {proj.badge}
                  </span>
                  <Code className="w-4 h-4 text-slate-500" />
                </div>
                <h4 className="text-lg font-bold text-white pt-1">{proj.title}</h4>
                <span className="text-xs text-indigo-400 font-semibold block">{proj.track}</span>
                <p className="text-xs text-slate-400 leading-relaxed">{proj.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-800/80">
                <a
                  href={proj.devpostUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-slate-300 hover:text-white font-semibold flex items-center gap-1"
                >
                  <span>View Project on Devpost</span>
                  <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
                </a>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </section>

      {/* Grounded AI Assistant Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="rounded-3xl glass-panel p-8 sm:p-12 border border-indigo-500/30 relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 shadow-2xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-mono font-semibold border border-indigo-500/30">
                <Bot className="w-3.5 h-3.5" />
                <span>REAL-TIME VOICE & GROUNDED SEARCH</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Got Questions? Ask Our <br />
                <span className="gradient-text">Grounded AI Voice Assistant</span>
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed">
                Consult official CreatED rules, hardware lab inventory, venue rules, and schedule hands-free using natural voice input.
              </p>

              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Real-time vector search with chunk citations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Hands-free voice navigation ("Go to schedule", "Show sponsors")</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Speech synthesis response playback</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/chat"
                  className="gradient-button text-white text-sm font-semibold px-6 py-3.5 rounded-xl inline-flex items-center space-x-2 shadow-lg"
                >
                  <Bot className="w-4 h-4" />
                  <span>Launch AI Assistant</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 font-mono text-xs shadow-2xl">
              <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-3">
                <span className="flex items-center gap-1.5"><Bot className="w-4 h-4 text-indigo-400" /> AI Retrieval Pipeline Trace</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Active</span>
              </div>
              
              <div className="space-y-2 text-[11px]">
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
                  <span className="text-indigo-400 font-bold">Voice Input:</span> "Where is the hardware lab located?"
                </div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-slate-300 space-y-1">
                  <div className="text-purple-400 font-bold">Retrieved Context:</div>
                  <div className="text-slate-400 italic text-[10px]">
                    📄 Official_CreatED_Hackathon_Guide_2026.md (Page 1)
                    <br />"Appleton Tower Concourse Edinburgh. Hardware lab provides Arduino, Raspberry Pi..."
                  </div>
                </div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-emerald-300">
                  <span className="font-bold">Voice AI Answer:</span> The hardware lab is located at Appleton Tower Concourse with Arduino & Raspberry Pi kits available.
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-3 mb-10"
        >
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-400">FREQUENTLY ASKED QUESTIONS</span>
          <h2 className="text-3xl font-extrabold text-white">Got Questions?</h2>
        </motion.div>

        <div className="space-y-4">
          {faqList.map((item, idx) => (
            <AnimatedCard key={idx} className="p-6 glass-panel border border-slate-800 space-y-2">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>{item.q}</span>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed pl-6">{item.a}</p>
            </AnimatedCard>
          ))}
        </div>
      </section>
    </div>
  );
}
