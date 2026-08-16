"use client";

import { useState, useEffect } from "react";
import { Sparkles, Trophy, Award, ExternalLink, GitBranch, CheckCircle2, Sliders, MessageSquare, Bot, Filter, Radio, Shield, RefreshCw } from "lucide-react";
import { api } from "@/lib/api";
import AnimatedCard from "@/components/AnimatedCard";

interface Project {
  id: string;
  team_id: str;
  title: string;
  description: string;
  track: string;
  tech_stack?: string;
  github_url?: string;
  demo_url?: string;
  status: string;
  judge_score?: number;
  judge_rubric_json?: string;
  feedback?: string;
}

export default function JudgePortalPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<string>("ALL");
  const [loading, setLoading] = useState(true);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  // Rubric Scores state
  const [techExecution, setTechExecution] = useState<number>(25);
  const [innovation, setInnovation] = useState<number>(25);
  const [design, setDesign] = useState<number>(16);
  const [impact, setImpact] = useState<number>(17);
  const [judgeFeedback, setJudgeFeedback] = useState<string>("");

  const [scoring, setScoring] = useState(false);
  const [aiEvaluating, setAiEvaluating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await api.getAllProjects();
      setProjects(data || []);
      if (data && data.length > 0) {
        selectProjectForScoring(data[0]);
      }
    } catch (err) {
      console.error("Failed to load submitted projects:", err);
    } finally {
      setLoading(false);
    }
  };

  const selectProjectForScoring = (proj: Project) => {
    setActiveProject(proj);
    if (proj.judge_rubric_json) {
      try {
        const parsed = JSON.parse(proj.judge_rubric_json);
        setTechExecution(parsed.technical_execution || 25);
        setInnovation(parsed.innovation || 25);
        setDesign(parsed.design || 16);
        setImpact(parsed.impact || 17);
      } catch (e) {}
    } else {
      setTechExecution(25);
      setInnovation(25);
      setDesign(16);
      setImpact(17);
    }
    setJudgeFeedback(proj.feedback || "");
    setMessage(null);
  };

  const handleAiAutoEvaluate = async (projectId: string) => {
    setAiEvaluating(true);
    try {
      const res = await api.evaluateProject(projectId);
      if (res && res.score_breakdown) {
        setTechExecution(res.score_breakdown.technical_execution || 26);
        setInnovation(res.score_breakdown.innovation || 27);
        setDesign(res.score_breakdown.design || 17);
        setImpact(res.score_breakdown.impact || 18);
        setJudgeFeedback(res.summary_feedback || "Strong grounded AI implementation with verified citation logic.");
        setMessage("✨ AI Evaluation breakdown calculated!");
      }
    } catch (err: any) {
      setMessage("AI evaluation unavailable. You can enter scores manually below.");
    } finally {
      setAiEvaluating(false);
    }
  };

  const handleSubmitScore = async () => {
    if (!activeProject) return;
    setScoring(true);
    setMessage(null);

    try {
      const updated = await api.submitJudgeScore(activeProject.id, {
        technical_execution: techExecution,
        innovation: innovation,
        design: design,
        impact: impact,
        feedback: judgeFeedback
      });

      setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
      setActiveProject(updated);
      setMessage("✅ Official Judge Rubric Score Submitted Successfully!");
    } catch (err: any) {
      setMessage(`Scoring failed: ${err.message}`);
    } finally {
      setScoring(false);
    }
  };

  const filteredProjects = selectedTrack === "ALL" 
    ? projects 
    : projects.filter(p => p.track.toLowerCase().includes(selectedTrack.toLowerCase()));

  const currentTotal = techExecution + innovation + design + impact;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-mono font-bold uppercase tracking-widest mb-1">
            <Shield className="w-4 h-4" />
            <span>OFFICIAL JUDGING PORTAL</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px]">
              HYBRID / VIRTUAL / IN-PERSON DEMOS
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Judge Demo & Rubric Evaluation</h1>
          <p className="text-sm text-slate-400 mt-1">Review live submissions, score rubrics, and provide feedback for CreatED Hackathon 2026.</p>
        </div>

        <button
          onClick={loadProjects}
          className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center space-x-2 shadow"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Submissions</span>
        </button>
      </div>

      {/* Track Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono text-slate-400 flex items-center gap-1 mr-2">
          <Filter className="w-3.5 h-3.5" /> Filter Track:
        </span>
        {["ALL", "Generative AI", "FinTech", "MedTech", "Hardware"].map((tr) => (
          <button
            key={tr}
            onClick={() => setSelectedTrack(tr)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedTrack === tr
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            {tr === "ALL" ? "All Submissions" : tr}
          </button>
        ))}
      </div>

      {/* Main Grid: Projects List (Left) & Active Judge Evaluation Form (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Submissions List */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-sm font-mono font-bold text-slate-400 uppercase tracking-wider">
            Submitted Projects ({filteredProjects.length})
          </h3>

          {filteredProjects.length === 0 ? (
            <div className="p-8 rounded-2xl glass-panel border border-slate-800 text-center space-y-3">
              <Award className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400">No project submissions found for this filter track.</p>
            </div>
          ) : (
            filteredProjects.map((proj) => {
              const isSelected = activeProject?.id === proj.id;
              return (
                <div
                  key={proj.id}
                  onClick={() => selectProjectForScoring(proj)}
                  className={`p-5 rounded-2xl cursor-pointer transition-all border ${
                    isSelected
                      ? "bg-slate-900/90 border-indigo-500 shadow-xl ring-1 ring-indigo-500/50"
                      : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {proj.track}
                    </span>
                    {proj.judge_score ? (
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                        <Trophy className="w-3 h-3 text-amber-300" /> {proj.judge_score}/100
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                        Pending Score
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-bold text-white mt-2">{proj.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">{proj.description}</p>

                  {proj.tech_stack && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {proj.tech_stack.split(",").map((tech, idx) => (
                        <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Live Scoring Panel */}
        <div className="lg:col-span-7">
          {activeProject ? (
            <div className="rounded-3xl glass-panel border border-indigo-500/30 p-6 sm:p-8 space-y-6 shadow-2xl bg-slate-950/95 sticky top-24">
              {/* Active Project Details */}
              <div className="border-b border-slate-800 pb-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-indigo-400 uppercase">{activeProject.track}</span>
                  <div className="flex items-center space-x-3 text-xs font-semibold">
                    {activeProject.demo_url && (
                      <a href={activeProject.demo_url} target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-white flex items-center gap-1">
                        <span>Live Demo</span> <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {activeProject.github_url && (
                      <a href={activeProject.github_url} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-white flex items-center gap-1">
                        <GitBranch className="w-3.5 h-3.5" /> <span>Code Repo</span>
                      </a>
                    )}
                  </div>
                </div>

                <h2 className="text-2xl font-black text-white">{activeProject.title}</h2>
                <p className="text-xs text-slate-300 leading-relaxed">{activeProject.description}</p>
              </div>

              {/* AI Auto Evaluation Assistant */}
              <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">AI Rubric Evaluator</h5>
                    <p className="text-[10px] text-slate-400">Generate suggested category scores & code evaluation</p>
                  </div>
                </div>

                <button
                  onClick={() => handleAiAutoEvaluate(activeProject.id)}
                  disabled={aiEvaluating}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow disabled:opacity-50"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${aiEvaluating ? "animate-spin" : ""}`} />
                  <span>{aiEvaluating ? "Analyzing..." : "Auto Evaluate"}</span>
                </button>
              </div>

              {message && (
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-indigo-300">
                  {message}
                </div>
              )}

              {/* Rubric Category Sliders */}
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-indigo-400" />
                    <span>Official Judging Rubric Scores</span>
                  </h4>
                  <span className="text-sm font-black font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                    Total Score: {currentTotal} / 100
                  </span>
                </div>

                {/* Criterion 1: Technical Execution (30 pts) */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-300">1. Technical Execution (30%)</span>
                    <span className="font-mono text-indigo-400 font-bold">{techExecution} / 30 pts</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={30}
                    value={techExecution}
                    onChange={(e) => setTechExecution(Number(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>

                {/* Criterion 2: Innovation & Originality (30 pts) */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-300">2. Innovation & Originality (30%)</span>
                    <span className="font-mono text-purple-400 font-bold">{innovation} / 30 pts</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={30}
                    value={innovation}
                    onChange={(e) => setInnovation(Number(e.target.value))}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                </div>

                {/* Criterion 3: Design & UX (20 pts) */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-300">3. Design & User Experience (20%)</span>
                    <span className="font-mono text-pink-400 font-bold">{design} / 20 pts</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={20}
                    value={design}
                    onChange={(e) => setDesign(Number(e.target.value))}
                    className="w-full accent-pink-500 cursor-pointer"
                  />
                </div>

                {/* Criterion 4: Practical Impact & Live Demo (20 pts) */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-300">4. Impact & Live Demo (20%)</span>
                    <span className="font-mono text-emerald-400 font-bold">{impact} / 20 pts</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={20}
                    value={impact}
                    onChange={(e) => setImpact(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Judge Written Feedback */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Judge Feedback & Critique</span>
                </label>
                <textarea
                  rows={3}
                  value={judgeFeedback}
                  onChange={(e) => setJudgeFeedback(e.target.value)}
                  placeholder="Provide constructive feedback for the team..."
                  className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Action Submit Button */}
              <button
                onClick={handleSubmitScore}
                disabled={scoring}
                className="w-full py-3.5 rounded-xl gradient-button text-white text-sm font-bold flex items-center justify-center space-x-2 shadow-xl disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{scoring ? "Submitting Evaluation..." : `Submit Score (${currentTotal}/100)`}</span>
              </button>
            </div>
          ) : (
            <div className="p-12 rounded-3xl glass-panel border border-slate-800 text-center space-y-3">
              <Trophy className="w-10 h-10 text-slate-600 mx-auto" />
              <h4 className="text-base font-bold text-white">Select a Project to Start Scoring</h4>
              <p className="text-xs text-slate-400">Choose a project from the left panel to open the interactive rubric evaluation form.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
