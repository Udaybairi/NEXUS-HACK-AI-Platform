"use client";

import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Send, CheckCircle2, AlertCircle, Sparkles, Trophy, Award, Lock } from "lucide-react";
import { api } from "@/lib/api";

export default function SubmissionPage() {
  const [project, setProject] = useState<any | null>(null);
  const [submission, setSubmission] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
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

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmitProject = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await api.submitProject();
      setSubmission(res);
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
      loadData();
    } catch (err: any) {
      setError(err.message || "Failed to submit project");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRunAIEvaluation = async () => {
    if (!project) return;
    setEvaluating(true);
    try {
      const res = await api.evaluateProject(project.id);
      setEvaluation(res);
    } catch (err: any) {
      console.error(err);
    } finally {
      setEvaluating(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center text-slate-400">
        <Sparkles className="w-8 h-8 animate-spin mx-auto text-indigo-400 mb-2" />
        <p className="text-sm">Checking submission status...</p>
      </div>
    );
  }

  const isReady = project && project.github_url && project.description && project.description.trim().length >= 10;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Final Project Submission</h1>
        <p className="text-xs text-slate-400 mt-1">Review checklist, perform submission lock, and preview rubric pre-score.</p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {submission ? (
        /* Submitted View */
        <div className="p-8 rounded-2xl glass-panel border border-emerald-500/30 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-mono uppercase text-emerald-400 font-bold tracking-widest">SUBMISSION CONFIRMED & LOCKED</span>
            <h2 className="text-2xl font-extrabold text-white mt-1">{project?.title}</h2>
            <p className="text-xs text-slate-400 mt-1">
              Submitted on {new Date(submission.submitted_at).toLocaleString()}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex flex-col items-center justify-center space-y-3">
            <button
              onClick={handleRunAIEvaluation}
              disabled={evaluating}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center space-x-2 shadow-lg disabled:opacity-50"
            >
              {evaluating ? <Sparkles className="w-4 h-4 animate-spin" /> : <Award className="w-4 h-4 text-amber-400" />}
              <span>{evaluating ? "Evaluating Rubric..." : "Preview AI Pre-Score & Feedback"}</span>
            </button>

            {evaluation && (
              <div className="w-full text-left p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between font-mono font-bold text-amber-400">
                  <span>Rubric Score</span>
                  <span>{evaluation.score} / 10</span>
                </div>
                <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{evaluation.feedback}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Submission Checklist */
        <div className="p-8 rounded-2xl glass-panel border border-slate-800 space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Send className="w-5 h-5 text-indigo-400" />
            <span>Submission Requirements Checklist</span>
          </h3>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-2">
                {project ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-amber-400" />}
                <span>Project Workspace Created</span>
              </span>
              <span className="font-mono text-slate-400">{project ? project.title : "Missing"}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-2">
                {project?.github_url ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-amber-400" />}
                <span>GitHub Repository URL Linked</span>
              </span>
              <span className="font-mono text-slate-400">{project?.github_url || "Missing"}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-2">
                {project?.description && project.description.length >= 10 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                )}
                <span>Project Description</span>
              </span>
              <span className="font-mono text-slate-400">{project?.description ? `${project.description.length} chars` : "Missing"}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-center">
            <button
              onClick={handleSubmitProject}
              disabled={!isReady || submitting}
              className="w-full py-3.5 rounded-xl gradient-button text-white text-sm font-semibold flex items-center justify-center space-x-2 shadow-xl disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? <Sparkles className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              <span>{submitting ? "Locking Submission..." : "Lock & Confirm Final Project Submission"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
