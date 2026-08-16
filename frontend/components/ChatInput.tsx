"use client";

import { useState, KeyboardEvent } from "react";
import { Send, Sparkles } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text.trim() || isLoading) return;
    onSend(text.trim());
    setText("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="relative">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask about hackathon rules, deadlines, judging criteria, or tracks..."
        rows={2}
        disabled={isLoading}
        className="w-full pl-4 pr-12 py-3 bg-slate-900/90 text-slate-100 placeholder-slate-500 rounded-xl border border-slate-700/80 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-sm resize-none"
      />
      <button
        onClick={handleSubmit}
        disabled={!text.trim() || isLoading}
        className="absolute right-3 bottom-3 p-2 rounded-lg gradient-button text-white disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
      >
        {isLoading ? (
          <Sparkles className="w-4 h-4 animate-spin text-white" />
        ) : (
          <Send className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}
