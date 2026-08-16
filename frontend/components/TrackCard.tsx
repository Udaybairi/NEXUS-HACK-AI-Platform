"use client";

import { Cpu, DollarSign, Activity, Sparkles, ArrowUpRight } from "lucide-react";
import AnimatedCard from "./AnimatedCard";

interface TrackProps {
  title: string;
  category: string;
  description: string;
  prize: string;
  tags: string[];
  iconName: string;
}

export default function TrackCard({ title, category, description, prize, tags, iconName }: TrackProps) {
  const getIcon = () => {
    switch (iconName) {
      case "cpu": return <Cpu className="w-6 h-6 text-indigo-400" />;
      case "dollar": return <DollarSign className="w-6 h-6 text-emerald-400" />;
      case "activity": return <Activity className="w-6 h-6 text-pink-400" />;
      default: return <Sparkles className="w-6 h-6 text-purple-400" />;
    }
  };

  return (
    <AnimatedCard className="glass-panel glass-panel-hover border border-slate-800 p-6 flex flex-col justify-between space-y-4 group overflow-hidden">
      <div className="absolute top-0 right-0 w-28 h-28 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all" />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            {getIcon()}
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-slate-900 text-indigo-300 border border-slate-700 shadow-inner">
            {prize}
          </span>
        </div>

        <div>
          <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-indigo-400">{category}</span>
          <h3 className="text-xl font-bold text-white mt-1 group-hover:text-indigo-300 transition-colors flex items-center justify-between">
            <span>{title}</span>
            <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400" />
          </h3>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="pt-3 border-t border-slate-800/80 flex flex-wrap gap-1.5">
        {tags.map((tag, i) => (
          <span key={i} className="text-[10px] font-mono px-2.5 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-800">
            #{tag}
          </span>
        ))}
      </div>
    </AnimatedCard>
  );
}
