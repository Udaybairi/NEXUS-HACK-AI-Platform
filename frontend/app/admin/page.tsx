"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, FileText, Database, Sparkles, Search, Layers, Lock } from "lucide-react";
import DocumentIngestionWidget from "@/components/DocumentIngestionWidget";
import { getStoredUser, User } from "@/lib/auth";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const u = getStoredUser();
    if (!u) {
      router.push("/login");
      return;
    }
    setUser(u);
  }, [router]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl glass-panel border border-purple-500/20 bg-gradient-to-r from-slate-950 via-slate-900 to-purple-950/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-mono font-semibold border border-purple-500/30">
              ADMIN CONTROL PANEL
            </span>
            <span className="text-xs font-mono text-slate-400">• Role: {user?.role || "ADMIN"}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            Knowledge Base <span className="gradient-text">Management</span>
          </h1>
          <p className="text-xs text-slate-400">
            Upload official documents, manage chunking & vector indexing, and run similarity search tests.
          </p>
        </div>
      </div>


      {/* Event Logistics & Catering Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl glass-panel border border-indigo-500/20 bg-slate-950/80 space-y-4 shadow-xl">
          <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
              🥗
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Participant Dietary Logistics</h3>
              <p className="text-[10px] text-slate-400">Meal counts & dietary restriction distribution</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block font-mono">No Preference</span>
              <span className="text-lg font-bold text-white">65%</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-[10px] text-emerald-400 block font-mono">Vegetarian</span>
              <span className="text-lg font-bold text-emerald-300">18%</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-[10px] text-purple-400 block font-mono">Halal (H)</span>
              <span className="text-lg font-bold text-purple-300">10%</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-[10px] text-pink-400 block font-mono">Vegan (VG)</span>
              <span className="text-lg font-bold text-pink-300">4%</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-[10px] text-amber-400 block font-mono">Gluten-Free</span>
              <span className="text-lg font-bold text-amber-300">2%</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-[10px] text-rose-400 block font-mono">Nut Allergy</span>
              <span className="text-lg font-bold text-rose-300">1%</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl glass-panel border border-purple-500/20 bg-slate-950/80 space-y-4 shadow-xl">
          <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
              📡
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Event Format & Attendance</h3>
              <p className="text-[10px] text-slate-400">In-Person at Appleton Tower vs Virtual / Hybrid</p>
            </div>
          </div>

          <div className="space-y-3 pt-1 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 font-semibold mb-1">
                <span>In-Person (Appleton Concourse)</span>
                <span className="font-mono text-indigo-400">72% (360 hackers)</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full w-[72%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 font-semibold mb-1">
                <span>Hybrid (Lab + Virtual Team)</span>
                <span className="font-mono text-purple-400">18% (90 hackers)</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full w-[18%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 font-semibold mb-1">
                <span>Virtual Online (Discord / Stream)</span>
                <span className="font-mono text-pink-400">10% (50 hackers)</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div className="bg-pink-500 h-full w-[10%]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RAG Document Management Pipeline */}
      <DocumentIngestionWidget />
    </div>
  );
}
