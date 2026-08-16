"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Users, Code2, Send, Bot, Sparkles, CheckCircle2, ArrowRight, Shield, Award } from "lucide-react";
import DashboardCard from "@/components/DashboardCard";
import { getStoredUser, User } from "@/lib/auth";
import { api } from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [team, setTeam] = useState<any | null>(null);
  const [project, setProject] = useState<any | null>(null);
  const [submission, setSubmission] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = getStoredUser();
    if (!u) {
      router.push("/login");
      return;
    }
    setUser(u);

    // Fetch team & project info
    const fetchData = async () => {
      try {
        try {
          const t = await api.getMyTeam();
          setTeam(t);
        } catch (e) {}

        try {
          const p = await api.getMyProject();
          setProject(p);
        } catch (e) {}

        try {
          const s = await api.getMySubmission();
          setSubmission(s);
        } catch (e) {}
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400">
        <Sparkles className="w-8 h-8 animate-spin mx-auto text-indigo-400 mb-2" />
        <p className="text-sm">Loading your hackathon workspace...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl glass-panel border border-indigo-500/20 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-mono font-semibold">
              PARTICIPANT DASHBOARD
            </span>
            <span className="text-xs font-mono text-slate-400">• Role: {user?.role}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            Welcome back, <span className="gradient-text">{user?.name}</span>!
          </h1>
          <p className="text-xs text-slate-400">
            Manage your team, refine your project details, and perform final submissions.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/chat"
            className="gradient-button text-white text-xs font-semibold px-5 py-2.5 rounded-xl flex items-center space-x-2 shadow-lg"
          >
            <Bot className="w-4 h-4" />
            <span>Launch AI Assistant</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Team Status"
          value={team ? team.name : "No Team"}
          subtitle={team ? `${team.members.length} Members • Code: ${team.code}` : "Create or join a team"}
          icon={<Users className="w-5 h-5" />}
          badge={team ? "Active" : "Action Needed"}
          badgeColor={team ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"}
        />

        <DashboardCard
          title="Project Workspace"
          value={project ? project.title : "Not Started"}
          subtitle={project ? `Track: ${project.track}` : "Setup your project"}
          icon={<Code2 className="w-5 h-5" />}
          badge={project ? project.status : "Draft"}
          badgeColor={project?.status === "SUBMITTED" ? "bg-emerald-500/20 text-emerald-300" : "bg-indigo-500/20 text-indigo-300"}
        />

        <DashboardCard
          title="Submission State"
          value={submission ? "Submitted" : "Pending"}
          subtitle={submission ? `Recorded at ${new Date(submission.submitted_at).toLocaleTimeString()}` : "Deadline approaching"}
          icon={<Send className="w-5 h-5" />}
          badge={submission ? "Locked & Final" : "Incomplete"}
          badgeColor={submission ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"}
        />
      </div>

      {/* Action Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/dashboard/team"
          className="p-6 rounded-2xl glass-panel glass-panel-hover border border-slate-800 space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors flex items-center justify-between">
            <span>Team Management</span>
            <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform" />
          </h3>
          <p className="text-xs text-slate-400">Create a team, invite members via code, assign track, and manage team leaders.</p>
        </Link>

        <Link
          href="/dashboard/project"
          className="p-6 rounded-2xl glass-panel glass-panel-hover border border-slate-800 space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
            <Code2 className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors flex items-center justify-between">
            <span>Project Details</span>
            <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
          </h3>
          <p className="text-xs text-slate-400">Edit project title, tech stack, GitHub repo link, demo link, and use AI Architect ideation.</p>
        </Link>

        <Link
          href="/dashboard/submission"
          className="p-6 rounded-2xl glass-panel glass-panel-hover border border-slate-800 space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20 flex items-center justify-center">
            <Send className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white group-hover:text-pink-300 transition-colors flex items-center justify-between">
            <span>Final Submission</span>
            <ArrowRight className="w-4 h-4 text-pink-400 group-hover:translate-x-1 transition-transform" />
          </h3>
          <p className="text-xs text-slate-400">Validate project fields, lock submission timestamp, and preview rubric pre-score.</p>
        </Link>
      </div>
    </div>
  );
}
