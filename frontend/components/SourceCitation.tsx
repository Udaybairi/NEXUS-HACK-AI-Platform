"use client";

import { useState } from "react";
import { FileText, ChevronDown, ExternalLink } from "lucide-react";

export interface SourceCitationProps {
  document: string;
  page: number;
  chunk_index: number;
  snippet: string;
}

export default function SourceCitation({ citations }: { citations: SourceCitationProps[] }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!citations || citations.length === 0) return null;

  return (
    <div className="mt-3 pt-2 border-t border-slate-800/80">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1.5 text-xs font-mono text-indigo-400 hover:text-indigo-300 transition-colors"
      >
        <FileText className="w-3.5 h-3.5" />
        <span>Grounded Sources ({citations.length})</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="mt-2 space-y-2">
          {citations.map((cite, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs space-y-1 text-slate-300 hover:border-indigo-500/30 transition-colors"
            >
              <div className="flex items-center justify-between font-mono text-[11px] text-indigo-300 font-semibold">
                <span className="flex items-center space-x-1">
                  <span>📄 {cite.document}</span>
                  <span className="text-slate-500">(Page {cite.page})</span>
                </span>
                <span className="text-[10px] text-slate-500">Chunk #{cite.chunk_index}</span>
              </div>
              <p className="text-[11px] text-slate-400 italic line-clamp-2">
                "{cite.snippet}"
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
