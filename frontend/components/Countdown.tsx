"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

export default function Countdown() {
  // Target date set to 7 days from now for live demo
  const [timeLeft, setTimeLeft] = useState({
    days: 4,
    hours: 18,
    minutes: 42,
    seconds: 15,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => String(num).padStart(2, "0");

  return (
    <div className="flex flex-col items-center justify-center p-6 rounded-2xl glass-panel border border-indigo-500/20 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
      
      <div className="flex items-center space-x-2 text-indigo-400 font-mono text-xs uppercase tracking-widest mb-3">
        <Clock className="w-4 h-4 animate-pulse text-indigo-400" />
        <span>Submission Deadline Countdown</span>
      </div>

      <div className="grid grid-cols-4 gap-3 sm:gap-6 text-center">
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-center text-2xl sm:text-3xl font-bold font-mono text-white shadow-inner">
            {formatNumber(timeLeft.days)}
          </div>
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mt-2">Days</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-center text-2xl sm:text-3xl font-bold font-mono text-indigo-400 shadow-inner">
            {formatNumber(timeLeft.hours)}
          </div>
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mt-2">Hours</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-center text-2xl sm:text-3xl font-bold font-mono text-purple-400 shadow-inner">
            {formatNumber(timeLeft.minutes)}
          </div>
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mt-2">Mins</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-center text-2xl sm:text-3xl font-bold font-mono text-pink-400 shadow-inner">
            {formatNumber(timeLeft.seconds)}
          </div>
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mt-2">Secs</span>
        </div>
      </div>
    </div>
  );
}
