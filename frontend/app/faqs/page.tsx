"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown, Search, Bot, Mic, Sparkles, ShieldCheck } from "lucide-react";
import Link from "next/link";

interface FAQItem {
  q: string;
  a: string;
  category: "hardware" | "general" | "submissions" | "venue";
}

export default function FAQsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      q: "What hardware equipment and tools are provided at Nexus Hack?",
      a: "Our dedicated 24-hour Hardware Lab provides microcontrollers (Arduino Uno, Nano, ESP32, Raspberry Pi 4), sensor modules (ultrasonic, temperature, IMUs, camera modules), breadboards, soldering stations, wire strippers, 3D printers, and component kits completely free for all hackers.",
      category: "hardware",
    },
    {
      q: "Who is eligible to participate in Nexus Hack?",
      a: "Nexus Hack is open to undergraduate, postgraduate, and PhD students enrolled in any university across the UK and internationally. Recent graduates who finished within the last 12 months are also welcome.",
      category: "general",
    },
    {
      q: "What is the maximum team size allowed?",
      a: "Teams can range from 1 to 4 members. You can register as a complete team or join our team formation speed-networking session during check-in on Saturday morning.",
      category: "general",
    },
    {
      q: "Where is the venue located and is sleeping space provided?",
      a: "The event is hosted at Appleton Tower Concourse, The University of Edinburgh, George Square, Edinburgh EH8 9LE. We provide designated quiet sleep drop-in areas, rest pods, shower facilities, and continuous food/espresso bars.",
      category: "venue",
    },
    {
      q: "How does project submission work?",
      a: "Projects must be submitted by Sunday at 12:00 PM EST via your participant dashboard. Submissions must include a public GitHub repository link, 2-minute demo video, hardware build list, and challenge track selection.",
      category: "submissions",
    },
    {
      q: "What judging rubrics are used to score hacks?",
      a: "Submissions are scored by industry judges based on: Technical Execution (30%), Innovation & Originality (30%), Design & User Experience (20%), and Impact & Live Demo (20%). Our AI Voice Assistant can also inspect your repo and provide preliminary feedback.",
      category: "submissions",
    },
    {
      q: "Are hardware projects required or can software-only hacks participate?",
      a: "While CreatED is Scotland's flagship hardware hackathon, we welcome hybrid hardware-software projects, IoT applications, and grounded Generative AI software projects that interface with physical or simulated systems.",
      category: "hardware",
    },
    {
      q: "What Code of Conduct is enforced at the hackathon?",
      a: "CreatED adheres strictly to the Major League Hacking (MLH) Code of Conduct. Harassment, discrimination, or abusive behavior will result in immediate disqualification and removal from the venue.",
      category: "general",
    },
  ];

  const filteredFaqs = faqs.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch =
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4 max-w-3xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-mono font-semibold border border-indigo-500/30">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>HELP & KNOWLEDGE BASE</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          Frequently Asked <span className="gradient-text">Questions</span>
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed">
          Everything you need to know about CreatED Hardware & AI Hackathon rules, venue, schedule, hardware kits, and submissions.
        </p>
      </motion.div>

      {/* Search Bar & Category Filter */}
      <div className="space-y-4">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search FAQs or ask questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 focus:border-indigo-500 text-white placeholder-slate-500 text-sm outline-none transition-colors shadow-lg"
          />
          <Link
            href="/chat"
            className="absolute right-2 top-2 px-3.5 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-indigo-500/30"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Ask Voice AI</span>
          </Link>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          {[
            { id: "all", label: "All Questions" },
            { id: "hardware", label: "Hardware & Tools" },
            { id: "general", label: "Eligibility & Teams" },
            { id: "venue", label: "Venue & Logistics" },
            { id: "submissions", label: "Submissions & Rules" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeCategory === cat.id
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12 glass-panel rounded-3xl border border-slate-800 space-y-3">
            <p className="text-slate-400 text-sm">No questions matched your search term.</p>
            <Link
              href="/chat"
              className="gradient-button text-white text-xs font-semibold px-5 py-2.5 rounded-xl inline-flex items-center gap-2"
            >
              <Bot className="w-4 h-4" /> Ask Grounded AI Assistant Directly
            </Link>
          </div>
        ) : (
          filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="glass-panel rounded-2xl border border-slate-800/80 overflow-hidden bg-slate-950/70"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between space-x-4 hover:bg-slate-900/50 transition-colors"
                >
                  <span className="font-bold text-white text-base flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-indigo-400" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-5 pb-5 pt-1 text-xs text-slate-300 leading-relaxed border-t border-slate-900"
                    >
                      <p className="pl-6">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
