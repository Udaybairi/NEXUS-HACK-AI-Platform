"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, LogIn, Lock, Mail, AlertCircle, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";
import { saveAuthToken } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError(null);

    try {
      const res = await api.login({ email, password });
      saveAuthToken(res.access_token, res.user);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (role: "admin" | "user") => {
    setLoading(true);
    setError(null);
    const demoEmail = role === "admin" ? "admin@hackathon.org" : "demo_lead@hackathon.org";
    const demoPassword = role === "admin" ? "admin123" : "lead123";

    try {
      try {
        const res = await api.login({ email: demoEmail, password: demoPassword });
        saveAuthToken(res.access_token, res.user);
      } catch (e) {
        // Register demo user if not existing
        const regRes = await api.register({
          name: role === "admin" ? "Hackathon Admin" : "Demo Team Lead",
          email: demoEmail,
          password: demoPassword,
          role: role === "admin" ? "ADMIN" : "TEAM_LEAD"
        });
        saveAuthToken(regRes.access_token, regRes.user);
      }
      router.push(role === "admin" ? "/admin" : "/dashboard");
    } catch (err: any) {
      setError(err.message || "Quick login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl glass-panel border border-slate-800 p-8 space-y-6 shadow-2xl relative">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center mx-auto shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
          <p className="text-xs text-slate-400">Log in to manage your team and project submission</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="developer@hackathon.org"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl gradient-button text-white text-sm font-semibold flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? "Authenticating..." : "Log In"}</span>
          </button>
        </form>

        {/* Demo Preset Buttons */}
        <div className="pt-4 border-t border-slate-800/80 space-y-2">
          <span className="block text-center text-[10px] font-mono uppercase tracking-wider text-slate-500">Quick One-Click Demo Access</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickDemoLogin("user")}
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 transition-colors"
            >
              🚀 Participant Demo
            </button>
            <button
              onClick={() => handleQuickDemoLogin("admin")}
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-indigo-400 transition-colors"
            >
              🛡️ Admin Demo
            </button>

          </div>
        </div>

        <p className="text-center text-xs text-slate-400">
          Don't have an account?{" "}
          <Link href="/register" className="text-indigo-400 hover:underline font-semibold">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
