"use client";

import { useState } from "react";
import { Sparkles, X, Code2, Layers, CheckCircle2, Rocket } from "lucide-react";
import { api } from "@/lib/api";

interface AIProjectAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyStack?: (stack: string) => void;
}

export default function AIProjectAssistantModal({ isOpen, onClose, onApplyStack }: AIProjectAssistantModalProps) {
  const [idea, setIdea] = useState("");
  const [track, setTrack] = useState("Generative AI & RAG");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!idea.trim()) return;
    setLoading(true);
    try {
      const res = await api.generateProjectAssistant(idea, track);
      setResult(res);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-2xl rounded-2xl glass-panel border border-indigo-500/30 p-6 space-y-6 max-h-[90vh] overflow-y-auto relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">AI Project Architect & Ideator</h3>
            <p className="text-xs text-slate-400">Generate architectural specs, tech stack, and pitch framework from a raw project concept.</p>
          </div>
        </div>

        {/* Input */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Select Track</label>
            <select
              value={track}
              onChange={(e) => setTrack(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="Generative AI & RAG">Generative AI & RAG Systems</option>
              <option value="FinTech & DeFI Analytics">FinTech & DeFI Analytics</option>
              <option value="Healthcare & MedTech">Healthcare & MedTech</option>
              <option value="Open Innovation">Open Innovation</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Your Project Concept / Idea</label>
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="e.g. An AI platform for automated medical diagnosis verification using vector search over verified clinical papers..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={!idea.trim() || loading}
            className="w-full py-3 rounded-xl gradient-button text-white text-sm font-semibold flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />}
            <span>{loading ? "Synthesizing Architecture..." : "Generate AI Architecture Specs"}</span>
          </button>
        </div>

        {/* Results view */}
        {result && (
          <div className="p-5 rounded-xl bg-slate-950/80 border border-indigo-500/20 space-y-4 text-xs">
            <div>
              <span className="font-mono font-bold text-indigo-400 uppercase text-[10px] tracking-wider">Problem Statement</span>
              <p className="text-slate-300 mt-1">{result.problem_statement}</p>
            </div>

            <div>
              <span className="font-mono font-bold text-indigo-400 uppercase text-[10px] tracking-wider">Recommended System Architecture</span>
              <p className="text-slate-300 mt-1 font-mono p-2 bg-slate-900 rounded-lg border border-slate-800">{result.architecture}</p>
            </div>

            <div>
              <span className="font-mono font-bold text-indigo-400 uppercase text-[10px] tracking-wider">Core Features</span>
              <ul className="mt-1 space-y-1 text-slate-300">
                {result.key_features.map((feat: string, i: number) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="font-mono font-bold text-indigo-400 uppercase text-[10px] tracking-wider">Suggested Tech Stack</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {result.suggested_stack.map((st: string, i: number) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-slate-900 text-slate-200 border border-slate-800 font-mono text-[10px]">
                    {st}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
