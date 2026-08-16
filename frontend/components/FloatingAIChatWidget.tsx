"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, X, Sparkles, Send, User as UserIcon, MessageSquare, Volume2, VolumeX, Copy, Check, ThumbsUp, ThumbsDown, Minimize2, Mic } from "lucide-react";
import SourceCitation, { SourceCitationProps } from "./SourceCitation";
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

const QUICK_QUESTIONS = [
  "🍕 Food & Catering Menu",
  "⏱ Schedule & Deadlines",
  "🤖 AI & ChatGPT Rules",
  "⚖️ Judging Rubric (100 pts)",
  "📦 Pre-Submission Checklist",
  "📍 Venue & Hardware Lab"
];

export default function FloatingAIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hey there! 👋 How can I assist you with Nexus Hack today?",
      sources: []
    }
  ]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const userScrolledUpRef = useRef(false);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 70;
    userScrolledUpRef.current = !isAtBottom;
    setShowScrollBottom(!isAtBottom);
  };

  const scrollToBottom = (force = false) => {
    if (force || !userScrolledUpRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const speakText = async (text: string) => {
    if (!speechEnabled) return;
    await speakWithElevenLabs(text);
  };

  const handleSend = async (userText: string) => {
    if (!userText.trim() || isLoading) return;

    userScrolledUpRef.current = false;
    setShowScrollBottom(false);


    const userMsgId = Date.now().toString();
    const assistantMsgId = (Date.now() + 1).toString();

    setMessages((prev) => [
      ...prev,
      { id: userMsgId, role: "user", content: userText },
      { id: assistantMsgId, role: "assistant", content: "", sources: [], isStreaming: true }
    ]);

    setInput("");
    setIsLoading(true);

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
      const streamUrl = `${apiBase}/chat/stream?message=${encodeURIComponent(userText)}${sessionId ? `&session_id=${sessionId}` : ""}`;
      const eventSource = new EventSource(streamUrl);

      let accumulatedContent = "";

      eventSource.onmessage = (event) => {
        if (event.data === "[DONE]") {
          eventSource.close();
          setIsLoading(false);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsgId ? { ...msg, isStreaming: false } : msg
            )
          );
          if (speechEnabled) speakText(accumulatedContent);
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
            accumulatedContent += parsed.content;
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
                    content: "Sorry, an error occurred while looking up knowledge documents. Please try again.",
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
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Action Trigger Button */}
      {!isOpen && (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsVoiceModalOpen(true)}
            className="p-3 rounded-full bg-slate-900 border border-slate-700 text-indigo-400 hover:text-white hover:bg-slate-800 shadow-xl transition-all"
            title="Real-Time Voice Assistant"
          >
            <Mic className="w-5 h-5 animate-pulse" />
          </button>

          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center space-x-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold shadow-2xl hover:scale-105 transition-all duration-300 border border-white/20"
          >
            <div className="relative">
              <Bot className="w-5 h-5 animate-bounce" style={{ animationDuration: '3s' }} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900" />
            </div>
            <span className="text-xs tracking-wide">Ask AI Assistant</span>
            <Sparkles className="w-4 h-4 text-indigo-200 group-hover:rotate-12 transition-transform" />
          </button>
        </div>
      )}

      {/* Voice Assistant Modal */}
      <VoiceAssistantModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
      />

      {/* Floating Chat Drawer Window */}
      {isOpen && (
        <div className="w-[380px] sm:w-[420px] h-[580px] rounded-3xl glass-panel border border-indigo-500/30 shadow-2xl flex flex-col overflow-hidden bg-slate-950/95 backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                  <span>24/7 Realtime AI Assistant</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </h4>
                <p className="text-[10px] text-slate-400">Instant Participant Doubt Clearing & Grounded RAG</p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsVoiceModalOpen(true)}
                className="p-1.5 rounded-lg text-indigo-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Launch Live Voice Mode"
              >
                <Mic className="w-4 h-4" />
              </button>

              <button
                onClick={() => setSpeechEnabled(!speechEnabled)}
                className={`p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors ${speechEnabled ? "text-indigo-400 bg-indigo-500/10" : ""}`}
                title={speechEnabled ? "Mute Voice Output" : "Enable Voice Output"}
              >
                {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>


          {/* Messages Scroll Area */}
          <div ref={scrollContainerRef} onScroll={handleScroll} className="flex-1 p-4 overflow-y-auto space-y-4 text-xs relative">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start space-x-2.5 ${msg.role === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === "user"
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-900 border border-slate-700 text-indigo-400"
                  }`}
                >
                  {msg.role === "user" ? <UserIcon className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl p-3 leading-relaxed relative group ${
                    msg.role === "user"
                      ? "bg-indigo-600 text-white rounded-tr-none shadow-md"
                      : "bg-slate-900/90 text-slate-200 border border-slate-800 rounded-tl-none"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>

                  {msg.isStreaming && !msg.content && (
                    <div className="flex items-center space-x-1.5 text-slate-400 text-[11px] py-1">
                      <Sparkles className="w-3 h-3 animate-spin text-indigo-400" />
                      <span>Searching knowledge base...</span>
                    </div>
                  )}

                  {msg.sources && msg.sources.length > 0 && (
                    <SourceCitation citations={msg.sources} />
                  )}

                  {/* Copy & Feedback controls */}
                  {msg.role === "assistant" && msg.content && (
                    <div className="mt-2 pt-1 border-t border-slate-800/60 flex items-center justify-end space-x-2 text-[10px] text-slate-400 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => copyToClipboard(msg.content, msg.id)}
                        className="hover:text-white transition-colors flex items-center space-x-1"
                        title="Copy Response"
                      >
                        {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
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
                className="sticky bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-indigo-600/90 text-white text-[10px] font-mono font-semibold shadow-xl border border-indigo-400/40 hover:scale-105 transition-all flex items-center gap-1 mx-auto"
              >
                <span>↓ Scroll to latest</span>
              </button>
            )}
          </div>


          {/* Quick Prompts */}
          {messages.length <= 2 && (
            <div className="px-4 py-2 flex flex-wrap gap-1.5 border-t border-slate-900 bg-slate-950/40">
              {QUICK_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q)}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-indigo-300 transition-colors flex items-center space-x-1"
                >
                  <MessageSquare className="w-3 h-3 text-indigo-400" />
                  <span>{q}</span>
                </button>
              ))}
            </div>
          )}

          {/* Input Box */}
          <div className="p-3 border-t border-slate-800 bg-slate-950">
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
                placeholder="Ask about rules, prizes, schedule..."
                disabled={isLoading}
                className="flex-1 px-3.5 py-2.5 bg-slate-900 text-slate-100 placeholder-slate-500 rounded-xl border border-slate-800 text-xs focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={() => handleSend(input)}
                disabled={!input.trim() || isLoading}
                className="p-2.5 rounded-xl gradient-button text-white disabled:opacity-40"
              >
                {isLoading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
