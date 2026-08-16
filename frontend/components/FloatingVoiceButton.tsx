"use client";

import { Mic, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface FloatingVoiceButtonProps {
  onClick: () => void;
}

export default function FloatingVoiceButton({ onClick }: FloatingVoiceButtonProps) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 15 }}
      className="fixed bottom-6 right-6 z-40"
    >
      <button
        onClick={onClick}
        aria-label="Open AI Voice Assistant"
        className="group relative flex items-center gap-3 px-5 py-3.5 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-2xl hover:shadow-indigo-500/50 hover:scale-105 transition-all duration-300 border border-white/20 backdrop-blur-lg"
      >
        {/* Pulsing ring background */}
        <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-40 blur group-hover:opacity-75 transition duration-500 animate-pulse pointer-events-none" />

        <div className="relative flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Mic className="w-4 h-4 text-white animate-bounce" />
          </div>
          <div className="text-left hidden sm:block">
            <span className="text-xs font-bold block leading-none flex items-center gap-1">
              AI Voice Assistant <Sparkles className="w-3 h-3 text-amber-300" />
            </span>
            <span className="text-[10px] text-indigo-200 font-mono leading-none">Speak or navigate</span>
          </div>
        </div>
      </button>
    </motion.div>
  );
}
