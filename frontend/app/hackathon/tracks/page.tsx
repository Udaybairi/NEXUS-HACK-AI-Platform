"use client";

import TrackCard from "@/components/TrackCard";
import { Cpu, DollarSign, Activity, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function TracksPage() {
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
      description: "Develop intelligent automated financial risk evaluation tools and decentralized transaction monitoring.",
      prize: "$15,000 Prize",
      tags: ["FinTech", "Analytics", "Automation"],
      iconName: "dollar"
    },
    {
      title: "Healthcare & MedTech AI",
      category: "Track 3",
      description: "Create AI tools for medical record processing, diagnostic assistance, and clinical data synthesis.",
      prize: "$5,000 Prize",
      tags: ["MedTech", "Healthcare", "NLP"],
      iconName: "activity"
    },
    {
      title: "Open AI Innovation",
      category: "Track 4",
      description: "Any groundbreaking software solution combining creative design with cutting-edge AI services.",
      prize: "$5,000 Prize",
      tags: ["OpenInnovation", "FullStack"],
      iconName: "sparkles"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3"
      >
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-400">CHALLENGE CATEGORIES</span>
        <h1 className="text-4xl font-extrabold text-white">Hackathon Tracks</h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">Explore track focuses, target technologies, and prize allocations.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tracks.map((track, idx) => (
          <TrackCard key={idx} {...track} />
        ))}
      </div>
    </div>
  );
}
