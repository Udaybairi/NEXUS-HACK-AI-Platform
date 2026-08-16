"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Bot, Rocket, ArrowRight, Code2, Users, Trophy, Radio, ShieldCheck } from "lucide-react";
import Countdown from "./Countdown";
import ThreeCanvas from "./ThreeCanvas";

export default function Hero() {
  return (
    <section className="relative pt-10 pb-20 md:pt-16 md:pb-28 overflow-hidden min-h-[90vh] flex items-center">
      {/* Background ambient lighting glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[450px] h-[350px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[400px] h-[300px] bg-pink-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline, CTAs, Badges */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            {/* Badge */}
            <div className="inline-flex items-center space-x-2.5 px-4 py-2 rounded-full glass-panel border border-indigo-500/30 text-xs font-semibold text-indigo-300 shadow-xl">
              <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" style={{ animationDuration: "8s" }} />
              <span className="tracking-wider">GLOBAL HACKATHON 2026</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-emerald-400 font-mono">LIVE REGISTRATION</span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08]">
              Build the Future with <br />
              <span className="gradient-text">Grounded AI</span> Intelligence
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
              Form your hackathon squad, engineer cutting-edge AI software, and interact with our 3D citation-backed assistant that retrieves accurate answers from verified knowledge documents.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                href="/register"
                className="gradient-button text-white text-base font-bold px-8 py-4 rounded-xl shadow-2xl flex items-center space-x-2 justify-center group"
              >
                <Rocket className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                <span>Register Your Team</span>
              </Link>

              <Link
                href="/chat"
                className="px-8 py-4 rounded-xl glass-panel text-slate-200 hover:text-white font-bold text-base flex items-center space-x-2 border border-slate-700/80 hover:border-indigo-500/50 transition-all justify-center group"
              >
                <Bot className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
                <span>Launch AI Assistant</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Countdown Bar */}
            <div className="pt-6">
              <Countdown />
            </div>
          </motion.div>

          {/* Right Column: WebGL 3D Interactive Torus Canvas */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative w-full h-[420px] sm:h-[480px] rounded-3xl glass-panel border border-indigo-500/30 overflow-hidden shadow-2xl flex items-center justify-center bg-slate-950/60">
              {/* WebGL 3D Graphics Canvas */}
              <ThreeCanvas />

              {/* 3D Floating Feature Pill overlay */}
              <div className="absolute top-4 left-4 p-3 rounded-2xl glass-panel border border-slate-700/80 flex items-center space-x-2 text-xs font-mono font-semibold text-slate-200 animate-float shadow-xl">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>Interactive 3D Graphics</span>
              </div>

              <div className="absolute bottom-4 right-4 p-3.5 rounded-2xl glass-panel border border-indigo-500/30 flex items-center space-x-3 shadow-xl">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                  <Trophy className="w-5 h-5 text-amber-300" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] uppercase font-mono text-slate-400">Total Prize Pool</span>
                  <span className="text-base font-extrabold gradient-text-pink">$50,000 USD</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
