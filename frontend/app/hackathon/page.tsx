import Link from "next/link";
import { BookOpen, Trophy, ShieldCheck, CheckCircle2, Bot, ArrowRight } from "lucide-react";

export default function HackathonPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-mono font-semibold border border-indigo-500/30">
          <BookOpen className="w-3.5 h-3.5" />
          <span>OFFICIAL HACKATHON GUIDE & RUBRIC</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
          Hackathon Overview & Guidelines
        </h1>

        <p className="text-slate-400 text-sm max-w-2xl mx-auto">
          Everything you need to know about team creation, track selection, project submission guidelines, and judging rubrics.
        </p>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <span>Eligibility & Rules</span>
          </h3>
          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Teams consist of 1 to 4 participants.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>All code and project assets must be created during the hackathon period.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Repositories must include an open-source license and clear setup instructions.</span>
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>Official Judging Rubric</span>
          </h3>
          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-semibold text-slate-200 mb-1">
                <span>1. Technical Execution</span>
                <span className="text-indigo-400">30% Weight</span>
              </div>
              <p className="text-slate-400">Code cleanliness, architecture, backend API reliability, and vector database integration.</p>
            </div>
            <div>
              <div className="flex justify-between font-semibold text-slate-200 mb-1">
                <span>2. Innovation & Originality</span>
                <span className="text-purple-400">30% Weight</span>
              </div>
              <p className="text-slate-400">Novelty of solution, RAG retrieval accuracy, and creative problem solving.</p>
            </div>
            <div>
              <div className="flex justify-between font-semibold text-slate-200 mb-1">
                <span>3. Design & User Experience</span>
                <span className="text-pink-400">20% Weight</span>
              </div>
              <p className="text-slate-400">Aesthetic brilliance, responsive mobile layouts, and intuitive interface design.</p>
            </div>
            <div>
              <div className="flex justify-between font-semibold text-slate-200 mb-1">
                <span>4. Impact & Pitch</span>
                <span className="text-emerald-400">20% Weight</span>
              </div>
              <p className="text-slate-400">Clear demonstration video, pitch articulation, and real-world applicability.</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Assistant Callout */}
      <div className="p-8 rounded-3xl glass-panel border border-indigo-500/30 text-center space-y-4 bg-gradient-to-br from-slate-900 to-indigo-950/50">
        <Bot className="w-10 h-10 text-indigo-400 mx-auto" />
        <h3 className="text-2xl font-bold text-white">Have a specific question about rules or deadlines?</h3>
        <p className="text-xs text-slate-300 max-w-xl mx-auto">
          Our AI Assistant is pre-loaded with official knowledge documents and can instantly answer questions with exact citations.
        </p>

        <div>
          <Link
            href="/chat"
            className="gradient-button text-white text-sm font-semibold px-6 py-3 rounded-xl inline-flex items-center space-x-2"
          >
            <span>Ask AI Assistant Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
