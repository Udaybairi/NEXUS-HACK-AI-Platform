"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, VolumeX, Sparkles, X, Bot, RefreshCw, Radio } from "lucide-react";
import SourceCitation, { SourceCitationProps } from "./SourceCitation";
import { api } from "@/lib/api";
import { speakWithElevenLabs, stopElevenLabsAudio } from "@/lib/elevenlabs";

import { useRouter } from "next/navigation";

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VoiceAssistantModal({ isOpen, onClose }: VoiceAssistantModalProps) {
  const router = useRouter();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [sources, setSources] = useState<SourceCitationProps[]>([]);
  const [statusText, setStatusText] = useState("Tap microphone to start real-time voice consultation");
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [apiKey, setApiKey] = useState<string>("");
  const [showKeyInput, setShowKeyInput] = useState<boolean>(false);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedKey = localStorage.getItem("elevenlabs_api_key") || "";
      setApiKey(savedKey);

      synthRef.current = window.speechSynthesis;

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onstart = () => {
          setIsListening(true);
          setStatusText("Listening... Speak your question clearly now");
        };

        recognition.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };

        recognition.onerror = (event: any) => {
          setIsListening(false);
          setStatusText(`Voice recognition error: ${event.error || "Microphone access denied"}`);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  // Automatically process when speech stops and transcript is non-empty
  useEffect(() => {
    if (!isListening && transcript.trim().length > 3) {
      handleAskVoiceQuery(transcript.trim());
    }
  }, [isListening]);

  const startListening = () => {
    if (synthRef.current) synthRef.current.cancel();
    setIsSpeaking(false);
    setTranscript("");
    setAiResponse("");
    setSources([]);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        // Recognition already active
      }
    } else {
      setStatusText("Web Speech Recognition is not supported in this browser. You can type questions directly.");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const speakText = async (text: string) => {
    if (!autoSpeak) return;
    setIsSpeaking(true);
    await speakWithElevenLabs(text);
    setIsSpeaking(false);
  };

  const checkNavigationIntent = (query: string): { route: string; name: string } | null => {
    const q = query.toLowerCase();
    if (q.includes("schedule") || q.includes("workshop") || q.includes("agenda") || q.includes("timetable")) {
      return { route: "/workshops", name: "Schedule & Workshops Page" };
    }
    if (q.includes("sponsor") || q.includes("partner") || q.includes("blackrock") || q.includes("nexmo")) {
      return { route: "/sponsors", name: "Sponsors Showcase" };
    }
    if (q.includes("team") || q.includes("organizer") || q.includes("who is running") || q.includes("committee")) {
      return { route: "/teams", name: "CreatED Organizers Team" };
    }
    if (q.includes("faq") || q.includes("question") || q.includes("help") || q.includes("rule")) {
      return { route: "/faqs", name: "Frequently Asked Questions" };
    }
    if (q.includes("home") || q.includes("main page") || q.includes("front page")) {
      return { route: "/", name: "CreatED Home Page" };
    }
    if (q.includes("dashboard") || q.includes("submission") || q.includes("my project") || q.includes("my team")) {
      return { route: "/dashboard", name: "Participant Dashboard" };
    }
    if (q.includes("chat") || q.includes("ask ai") || q.includes("grounded search")) {
      return { route: "/chat", name: "Grounded AI Chat Assistant" };
    }
    return null;
  };

  const handleAskVoiceQuery = async (query: string) => {
    const navMatch = checkNavigationIntent(query);
    if (navMatch) {
      const msg = `Navigating to ${navMatch.name}...`;
      setAiResponse(msg);
      setStatusText(msg);
      speakText(msg);
      setTimeout(() => {
        router.push(navMatch.route);
        onClose();
      }, 1200);
      return;
    }

    setStatusText("Searching official knowledge base for verified answer...");
    setAiResponse("");

    try {
      const res = await api.askChat(query);
      setAiResponse(res.answer);
      setSources(res.sources || []);
      setStatusText("Answer ready");

      if (autoSpeak) {
        speakText(res.answer);
      }
    } catch (err: any) {
      setStatusText("Failed to retrieve information. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="w-full max-w-xl rounded-3xl glass-panel border border-indigo-500/30 p-6 space-y-6 shadow-2xl relative bg-slate-950/95 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <span>Real-Time Voice Assistant</span>
                <span className="flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Radio className="w-3 h-3 animate-pulse" /> LIVE VOICE
                </span>
              </h3>
              <p className="text-xs text-slate-400">Speak naturally to query rules, schedules, and judging criteria</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ElevenLabs API Key Config bar */}
        <div className="px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className={`w-2 h-2 rounded-full ${apiKey ? "bg-emerald-400 animate-ping" : "bg-amber-400"}`} />
            <span className="font-mono text-slate-300 text-[11px]">
              {apiKey ? "ElevenLabs Voice Active (Voice ID: JBFqnCBsd6RMkjVDRZzb)" : "ElevenLabs Key Required for Realistic Voice"}
            </span>
          </div>
          <button
            onClick={() => setShowKeyInput(!showKeyInput)}
            className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold underline"
          >
            {showKeyInput ? "Close" : apiKey ? "Change Key" : "Set API Key"}
          </button>
        </div>

        {showKeyInput && (
          <div className="p-3 rounded-xl bg-slate-900 border border-indigo-500/30 space-y-2 text-xs">
            <label className="block text-slate-300 font-mono font-semibold">ElevenLabs API Key:</label>
            <div className="flex gap-2">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Paste your ElevenLabs API Key here..."
                className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={() => {
                  if (typeof window !== "undefined") {
                    localStorage.setItem("elevenlabs_api_key", apiKey.trim());
                  }
                  setShowKeyInput(false);
                }}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-xs shadow-md"
              >
                Save
              </button>
            </div>
          </div>
        )}

        {/* Voice Visualizer Central Circle */}
        <div className="flex flex-col items-center justify-center py-6 space-y-4">
          <button
            onClick={isListening ? stopListening : startListening}
            className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${
              isListening
                ? "bg-rose-600 animate-pulse ring-8 ring-rose-500/30 scale-110"
                : isSpeaking
                ? "bg-indigo-600 ring-8 ring-indigo-500/30 scale-105"
                : "bg-gradient-to-tr from-indigo-600 to-purple-600 hover:scale-105 shadow-indigo-500/40"
            }`}
          >
            {isListening ? (
              <MicOff className="w-10 h-10 text-white animate-bounce" />
            ) : (
              <Mic className="w-10 h-10 text-white" />
            )}

            {/* Audio Wave animation lines */}
            {(isListening || isSpeaking) && (
              <div className="absolute -inset-4 border-2 border-indigo-500/40 rounded-full animate-ping pointer-events-none" />
            )}
          </button>

          <span className="text-xs font-mono font-semibold text-slate-300 text-center px-4">
            {statusText}
          </span>
        </div>

        {/* Live Speech Transcript */}
        {transcript && (
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200">
            <span className="font-mono text-indigo-400 font-bold block mb-1">🗣️ You Said:</span>
            <p className="italic">"{transcript}"</p>
          </div>
        )}

        {/* AI Answer Display */}
        {aiResponse && (
          <div className="p-4 rounded-xl bg-slate-900/90 border border-indigo-500/30 text-xs space-y-2 max-h-44 overflow-y-auto">
            <div className="flex items-center justify-between text-indigo-300 font-mono font-bold">
              <span className="flex items-center gap-1.5"><Bot className="w-4 h-4" /> AI Grounded Answer</span>
              <button
                onClick={() => setAutoSpeak(!autoSpeak)}
                className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1"
              >
                {autoSpeak ? <Volume2 className="w-3.5 h-3.5 text-indigo-400" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span>{autoSpeak ? "Voice On" : "Voice Off"}</span>
              </button>
            </div>
            <p className="text-slate-200 whitespace-pre-wrap leading-relaxed">{aiResponse}</p>
            {sources.length > 0 && <SourceCitation citations={sources} />}
          </div>
        )}

        {/* Footer controls */}
        <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
          <span>Supported browsers: Chrome, Edge, Safari</span>
          <button
            onClick={startListening}
            className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Voice Session</span>
          </button>
        </div>
      </div>
    </div>
  );
}
