"use client";

import { useState, useEffect } from "react";
import { Users, UserPlus, Copy, Check, Shield, AlertCircle, Sparkles } from "lucide-react";
import { api } from "@/lib/api";

export default function TeamManagementPage() {
  const [team, setTeam] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [teamName, setTeamName] = useState("");
  const [track, setTrack] = useState("Generative AI & RAG");
  const [joinCode, setJoinCode] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [copied, setCopied] = useState(false);

  const loadTeam = async () => {
    try {
      const t = await api.getMyTeam();
      setTeam(t);
    } catch (e) {
      setTeam(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeam();
  }, []);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) return;
    setError(null);
    try {
      const res = await api.createTeam({ name: teamName.trim(), track });
      setTeam(res);
    } catch (err: any) {
      setError(err.message || "Failed to create team");
    }
  };

  const handleJoinTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    setError(null);
    try {
      const res = await api.joinTeam(joinCode.trim());
      setTeam(res);
    } catch (err: any) {
      setError(err.message || "Failed to join team");
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberEmail.trim() || !team) return;
    setError(null);
    try {
      const res = await api.addMember(team.id, memberEmail.trim());
      setTeam(res);
      setMemberEmail("");
    } catch (err: any) {
      setError(err.message || "Failed to add member");
    }
  };

  const copyCode = () => {
    if (!team) return;
    navigator.clipboard.writeText(team.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-slate-400">
        <Sparkles className="w-8 h-8 animate-spin mx-auto text-indigo-400 mb-2" />
        <p className="text-sm">Loading team details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Team Management</h1>
        <p className="text-xs text-slate-400 mt-1">Form a team of up to 4 members or join an existing hackathon squad.</p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {team ? (
        /* Active Team View */
        <div className="space-y-6">
          <div className="p-6 rounded-2xl glass-panel border border-indigo-500/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-indigo-400 font-bold">Track: {team.track}</span>
                <h2 className="text-2xl font-bold text-white mt-0.5">{team.name}</h2>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400">Invite Code:</span>
                <div className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-sm text-indigo-300 font-bold">
                  <span>{team.code}</span>
                  <button onClick={copyCode} className="p-1 hover:text-white transition-colors">
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Member List */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                <span>Team Members ({team.members.length}/4)</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {team.members.map((m: any) => (
                  <div key={m.id} className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-xs text-white">
                        {m.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-slate-200 block">{m.name}</span>
                        <span className="text-[10px] font-mono text-slate-400">{m.email}</span>
                      </div>
                    </div>
                    {m.id === team.leader_id && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        LEAD
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Add Member Form */}
            {team.members.length < 4 && (
              <form onSubmit={handleAddMember} className="pt-4 border-t border-slate-800 space-y-2">
                <label className="block text-xs font-semibold text-slate-300">Invite Member by Email</label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={memberEmail}
                    onChange={(e) => setMemberEmail(e.target.value)}
                    placeholder="teammate@hackathon.org"
                    className="flex-1 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl gradient-button text-white text-xs font-semibold flex items-center space-x-1.5"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Invite</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      ) : (
        /* Create or Join Option */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Create Team */}
          <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" />
              <span>Create a New Team</span>
            </h3>

            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Team Name</label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  required
                  placeholder="e.g. Vector Mavericks"
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Challenge Track</label>
                <select
                  value={track}
                  onChange={(e) => setTrack(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Generative AI & RAG">Generative AI & RAG Systems</option>
                  <option value="FinTech & DeFI Analytics">FinTech & DeFI Analytics</option>
                  <option value="Healthcare & MedTech">Healthcare & MedTech</option>
                  <option value="Open Innovation">Open Innovation</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl gradient-button text-white text-xs font-semibold"
              >
                Create Team
              </button>
            </form>
          </div>

          {/* Join Team */}
          <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-purple-400" />
              <span>Join via Team Code</span>
            </h3>

            <form onSubmit={handleJoinTeam} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Enter 8-Character Join Code</label>
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  required
                  placeholder="e.g. A1B2C3D4"
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 uppercase font-mono tracking-widest placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition-colors"
              >
                Join Team
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
