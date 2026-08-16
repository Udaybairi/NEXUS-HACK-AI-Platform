"use client";

import { useState, useEffect } from "react";
import { Upload, FileText, Trash2, Search, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";

export default function DocumentIngestionWidget() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  // Test search console
  const [testQuery, setTestQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  const loadDocuments = async () => {
    try {
      const data = await api.listDocuments();
      setDocuments(data);
    } catch (err: any) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadMessage(null);

    try {
      await api.uploadDocument(file);
      setUploadMessage({ type: "success", text: `Successfully extracted, chunked & vector indexed "${file.name}"` });
      loadDocuments();
    } catch (err: any) {
      setUploadMessage({ type: "error", text: err.message || "Failed to index document" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteDocument(id);
      loadDocuments();
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleTestSearch = async () => {
    if (!testQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await api.testSearch(testQuery.trim());
      setSearchResults(res);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const totalChunks = documents.reduce((acc, d) => acc + (d.chunk_count || 0), 0);

  return (
    <div className="space-y-8">
      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl glass-panel border border-slate-800">
          <span className="text-xs font-mono uppercase text-slate-400">Indexed Knowledge Documents</span>
          <p className="text-3xl font-extrabold text-white mt-1">{documents.length}</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800">
          <span className="text-xs font-mono uppercase text-slate-400">Total Vector Chunks</span>
          <p className="text-3xl font-extrabold text-indigo-400 mt-1">{totalChunks}</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800">
          <span className="text-xs font-mono uppercase text-slate-400">Embedding Engine</span>
          <p className="text-lg font-bold text-emerald-400 mt-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Cosine Hybrid Index
          </p>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="p-8 rounded-2xl glass-panel border border-indigo-500/20 text-center space-y-4 relative">
        <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/30">
          <Upload className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-lg font-bold text-white">Upload Knowledge Document</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Drag and drop or select PDF, DOCX, Markdown, or TXT files. The pipeline automatically extracts text, performs overlapping chunking, and generates vector embeddings.
          </p>
        </div>

        <div>
          <label className="gradient-button text-white text-sm font-semibold px-6 py-2.5 rounded-xl cursor-pointer inline-flex items-center space-x-2">
            {isUploading ? (
              <Sparkles className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            <span>{isUploading ? "Chunking & Indexing..." : "Choose File to Ingest"}</span>
            <input type="file" onChange={handleFileUpload} accept=".pdf,.docx,.txt,.md" className="hidden" disabled={isUploading} />
          </label>
        </div>

        {uploadMessage && (
          <div className={`p-3 rounded-xl text-xs flex items-center justify-center space-x-2 max-w-md mx-auto ${uploadMessage.type === "success" ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30" : "bg-rose-500/10 text-rose-300 border border-rose-500/30"}`}>
            {uploadMessage.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{uploadMessage.text}</span>
          </div>
        )}
      </div>

      {/* Document Listing */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
        <h4 className="text-base font-bold text-white flex items-center justify-between">
          <span>Active Knowledge Base Documents</span>
          <span className="text-xs font-mono text-slate-400">{documents.length} Files</span>
        </h4>

        {documents.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-4">No documents indexed yet.</p>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {documents.map((doc) => (
              <div key={doc.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-indigo-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-sm text-slate-200">{doc.name}</span>
                    <div className="flex items-center space-x-3 text-[11px] font-mono text-slate-500 mt-0.5">
                      <span>Type: {doc.file_type}</span>
                      <span>•</span>
                      <span>Chunks: {doc.chunk_count}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(doc.id)}
                  className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Delete Document"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Test Search Console */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
        <h4 className="text-base font-bold text-white flex items-center gap-2">
          <Search className="w-4 h-4 text-indigo-400" />
          <span>Vector Similarity Test Playground</span>
        </h4>

        <div className="flex gap-2">
          <input
            type="text"
            value={testQuery}
            onChange={(e) => setTestQuery(e.target.value)}
            placeholder="Enter test query (e.g., 'What are the judging rubrics and deadlines?')"
            className="flex-1 px-4 py-2 bg-slate-900 text-slate-100 placeholder-slate-500 rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={handleTestSearch}
            disabled={isSearching}
            className="px-5 py-2 rounded-xl gradient-button text-white text-sm font-semibold flex items-center space-x-1.5"
          >
            {isSearching ? <Sparkles className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>Retrieve</span>
          </button>
        </div>

        {searchResults && (
          <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex justify-between items-center text-xs font-mono text-indigo-400 font-semibold">
              <span>Results found: {searchResults.retrieved_count} chunks</span>
              <span>Top Score: {searchResults.results[0]?.score || "N/A"}</span>
            </div>

            <div className="space-y-2">
              {searchResults.results.map((res: any, idx: number) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-1">
                  <div className="flex justify-between font-mono text-[11px] text-slate-300">
                    <span>📄 {res.document_name} (Page {res.page_number})</span>
                    <span className="text-indigo-400">Score: {res.score}</span>
                  </div>
                  <p className="text-slate-400">{res.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
