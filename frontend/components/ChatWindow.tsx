"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, User as UserIcon, Sparkles, AlertCircle, RefreshCw, MessageSquare, Mic, Volume2, VolumeX, Copy, Check } from "lucide-react";
import SourceCitation, { SourceCitationProps } from "./SourceCitation";
import ChatInput from "./ChatInput";
import VoiceAssistantModal from "./VoiceAssistantModal";
import { api } from "@/lib/api";
import { speakWithElevenLabs } from "@/lib/elevenlabs";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: SourceCitationProps[];
  isStreaming?: boolean;
}

const CATEGORY_DOUBT_CHIPS = [
  { label: "🍕 Food & Pizza Menu", query: "What food & catering is provided during the 24 hours?" },
  { label: "⏱ Schedule & Cutoffs", query: "When does hacking start and what is the submission deadline?" },
  { label: "🤖 AI & ChatGPT Rules", query: "Can we use AI tools like ChatGPT, Claude or GitHub Copilot?" },
  { label: "⚖️ Judging Rubric (100 pts)", query: "What are the 4 official judging criteria and point values?" },
  { label: "📦 Submission Checklist", query: "Give me the official pre-submission checklist." },
  { label: "📍 Venue & Hardware Lab", query: "Where is the venue and what hardware components are provided?" },
  { label: "📡 In-Person vs Virtual", query: "Can participants join virtually or in-person at Appleton Tower?" }
];

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm your official Nexus Hack AI Assistant. I can instantly clear your doubts about rules, schedule, tracks, catering, hardware lab, or submission guidelines!",
      sources: []
    }
  ]);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const userScrolledUpRef = useRef(false);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 80;
    userScrolledUpRef.current = !isAtBottom;
    setShowScrollBottom(!isAtBottom);
  };

  const scrollToBottom = (force = false) => {
    if (force || !userScrolledUpRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const speakText = async (text: string) => {
    if (!speechEnabled) return;
    await speakWithElevenLabs(text);
  };

  const handleSendMessage = async (userText: string) => {
    userScrolledUpRef.current = false;
    setShowScrollBottom(false);
    const userMsgId = Date.now().toString();
    const assistantMsgId = (Date.now() + 1).toString();

    setMessages((prev) => [
      ...prev,
      { id: userMsgId, role: "user", content: userText },
      { id: assistantMsgId, role: "assistant", content: "", sources: [], isStreaming: true }
    ]);

    setIsLoading(true);

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
      const streamUrl = `${apiBase}/chat/stream?message=${encodeURIComponent(userText)}${sessionId ? `&session_id=${sessionId}` : ""}`;
      const eventSource = new EventSource(streamUrl);
      let accumulatedText = "";

      eventSource.onmessage = (event) => {
        if (event.data === "[DONE]") {
          eventSource.close();
          setIsLoading(false);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsgId ? { ...msg, isStreaming: false } : msg
            )
          );
          if (speechEnabled) speakText(accumulatedText);
          return;
        }

        try {
          const parsed = JSON.parse(event.data);
          if (parsed.type === "metadata") {
            setSessionId(parsed.session_id);
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMsgId
                  ? { ...msg, sources: parsed.sources || [] }
                  : msg
              )
            );
          } else if (parsed.type === "token") {
            accumulatedText += parsed.content;
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMsgId
                  ? { ...msg, content: msg.content + parsed.content }
                  : msg
              )
            );
          }
        } catch (e) {}
      };

      eventSource.onerror = async () => {
        eventSource.close();
        try {
          const res = await api.askChat(userText, sessionId);
          setSessionId(res.session_id);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsgId
                ? { ...msg, content: res.answer, sources: res.sources, isStreaming: false }
                : msg
            )
          );
          if (speechEnabled) speakText(res.answer);
        } catch (err: any) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsgId
                ? {
                    ...msg,
                    content: "Sorry, an error occurred while searching official knowledge base documents.",
                    isStreaming: false
                  }
                : msg
            )
          );
        } finally {
          setIsLoading(false);
        }
      };

    } catch (err) {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, msgId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl glass-panel border border-slate-800 shadow-2xl flex flex-col h-[720px] overflow-hidden">
      {/* Voice Assistant Modal */}
      <VoiceAssistantModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
      />

      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <span>Expert AI Doubt Assistant</span>
              <span className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
                24/7 Grounded RAG
              </span>
            </h3>
            <p className="text-xs text-slate-400">Answers verified against official Nexus Hack knowledge base</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSpeechEnabled(!speechEnabled)}
            className={`p-2 rounded-xl text-xs font-semibold border transition-all ${
              speechEnabled
                ? "bg-indigo-600/30 text-indigo-300 border-indigo-500/50"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
            }`}
            title={speechEnabled ? "Mute ElevenLabs Voice" : "Enable ElevenLabs Voice Output"}
          >
            {speechEnabled ? <Volume2 className="w-4 h-4 text-indigo-400" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setIsVoiceModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm"
          >
            <Mic className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span>Interactive Voice</span>
          </button>
        </div>
      </div>

      {/* Category Chips Bar */}
      <div className="px-6 py-2.5 bg-slate-900/60 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-mono text-slate-400 uppercase font-bold shrink-0">Clear Doubts:</span>
        {CATEGORY_DOUBT_CHIPS.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(chip.query)}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-indigo-950/60 border border-slate-800 hover:border-indigo-500/50 text-slate-300 hover:text-white transition-all shrink-0 font-medium"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Messages Scroll View */}
      <div ref={scrollContainerRef} onScroll={handleScroll} className="flex-1 p-6 overflow-y-auto space-y-6 relative">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-3 ${msg.role === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === "user"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-900 border border-slate-700 text-indigo-400"
              }`}
            >
              {msg.role === "user" ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed relative group ${
                msg.role === "user"
                  ? "bg-indigo-600 text-white rounded-tr-none shadow-md"
                  : "bg-slate-900/90 text-slate-200 border border-slate-800 rounded-tl-none"
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>

              {msg.isStreaming && !msg.content && (
                <div className="flex items-center space-x-1.5 text-slate-400 text-xs py-1">
                  <Sparkles className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                  <span>Searching official knowledge base...</span>
                </div>
              )}

              {msg.sources && msg.sources.length > 0 && (
                <SourceCitation citations={msg.sources} />
              )}

              {msg.role === "assistant" && msg.content && (
                <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-end space-x-3 text-[11px] text-slate-400 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => speakWithElevenLabs(msg.content)}
                    className="hover:text-white transition-colors flex items-center space-x-1"
                    title="Speak with ElevenLabs AI Voice"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Listen</span>
                  </button>
                  <button
                    onClick={() => copyToClipboard(msg.content, msg.id)}
                    className="hover:text-white transition-colors flex items-center space-x-1"
                    title="Copy Text"
                  >
                    {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />

        {showScrollBottom && (
          <button
            onClick={() => scrollToBottom(true)}
            className="sticky bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-indigo-600/90 text-white text-xs font-mono font-semibold shadow-xl border border-indigo-400/40 hover:scale-105 transition-all flex items-center gap-1 mx-auto"
          >
            <span>↓ Scroll to latest</span>
          </button>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/80">
        <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}
