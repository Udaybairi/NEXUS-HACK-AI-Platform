"use client";

import { useState, useEffect } from "react";
import { Code2, Sparkles, GitBranch, Globe, Save, CheckCircle2, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";
import AIProjectAssistantModal from "@/components/AIProjectAssistantModal";

export default function ProjectWorkspacePage() {
  const [project, setProject] = useState<any | null>(null);
  const [team, setTeam] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [track, setTrack] = useState("Generative AI & RAG");
  const [techStack, setTechStack] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");

  const loadProjectData = async () => {
    try {
      try {
        const t = await api.getMyTeam();
        setTeam(t);
        if (t.track) setTrack(t.track);
      } catch (e) {}

      try {
        const p = await api.getMyProject();
        setProject(p);
        setTitle(p.title || "");
        setDescription(p.description || "");
        setTrack(p.track || "Generative AI & RAG");
        setTechStack(p.tech_stack || "");
        setGithubUrl(p.github_url || "");
        setDemoUrl(p.demo_url || "");
      } catch (e) {
        setProject(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjectData();
  }, []);

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setSaving(true);
    setMessage(null);

    try {
      if (project) {
        const updated = await api.updateProject(project.id, {
          title,
          description,
          track,
          tech_stack: techStack,
          github_url: githubUrl,
          demo_url: demoUrl,
        });
        setProject(updated);
        setMessage({ type: "success", text: "Project updated successfully!" });
      } else {
        const created = await api.createProject({
          title,
          description,
          track,
          tech_stack: techStack,
          github_url: githubUrl,
          demo_url: demoUrl,
        });
        setProject(created);
        setMessage({ type: "success", text: "Project workspace created successfully!" });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to save project" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-slate-400">
        <Sparkles className="w-8 h-8 animate-spin mx-auto text-indigo-400 mb-2" />
        <p className="text-sm">Loading project workspace...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Project Workspace</h1>
          <p className="text-xs text-slate-400 mt-1">Define project scope, tech stack, and repository links for judging.</p>
        </div>

        <button
          onClick={() => setIsAIModalOpen(true)}
          className="gradient-button text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center space-x-2 shadow-lg"
        >
          <Sparkles className="w-4 h-4" />
          <span>AI Architect Assistant</span>
        </button>
      </div>

      {message && (
        <div className={`p-3.5 rounded-xl text-xs flex items-center space-x-2 ${message.type === "success" ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30" : "bg-rose-500/10 text-rose-300 border border-rose-500/30"}`}>
          {message.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {!team ? (
        <div className="p-6 rounded-2xl glass-panel border border-amber-500/30 text-amber-300 text-xs">
          ⚠️ You must create or join a team first before setting up a project workspace.
        </div>
      ) : (
        <form onSubmit={handleSaveProject} className="p-8 rounded-2xl glass-panel border border-slate-800 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Project Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. Nexus RAG Platform"
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tech Stack (comma-separated)</label>
                <input
                  type="text"
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                  placeholder="FastAPI, Next.js, SQLite, pgvector, Tailwind"
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Project Description & Architecture Overview</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={5}
                placeholder="Describe your project solution, vector search engine, AI integration, and core user flows..."
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub Repository URL</label>
                <div className="relative">
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/username/hackathon-repo"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <GitBranch className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                </div>
              </div>


              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Live Demo URL (Optional)</label>
                <div className="relative">
                  <input
                    type="url"
                    value={demoUrl}
                    onChange={(e) => setDemoUrl(e.target.value)}
                    placeholder="https://my-hackathon-demo.vercel.app"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <Globe className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="gradient-button text-white text-xs font-semibold px-6 py-2.5 rounded-xl flex items-center space-x-2 disabled:opacity-50"
            >
              {saving ? <Sparkles className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{saving ? "Saving Changes..." : "Save Project Details"}</span>
            </button>
          </div>
        </form>
      )}

      {/* AI Ideator Modal */}
      <AIProjectAssistantModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
      />
    </div>
  );
}
