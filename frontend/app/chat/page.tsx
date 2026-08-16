import ChatWindow from "@/components/ChatWindow";

export default function ChatPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-400">CITATIONS-VERIFIED AI ASSISTANT</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Hackathon <span className="gradient-text">AI Assistant</span>
        </h1>
        <p className="text-xs text-slate-400">
          Ask questions about rules, deadlines, judging criteria, track descriptions, or submission guidelines. All answers are grounded in official knowledge base documents.
        </p>
      </div>


      <ChatWindow />
    </div>
  );
}
