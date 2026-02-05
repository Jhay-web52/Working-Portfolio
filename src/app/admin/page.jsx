"use client";
import { useState, useEffect } from "react";
import AdminProjects from "@/components/AdminProjects";
import { motion } from "framer-motion";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    // Best-effort session check: try hitting the admin API.
    // If cookie is present and valid, it will succeed.
    (async () => {
      try {
        const res = await fetch("/api/admin/projects", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });
        setIsAuthenticated(res.ok);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setCheckingSession(false);
      }
    })();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.error || "Login failed");
        setIsAuthenticated(false);
        return;
      }

      setIsAuthenticated(true);
      setPassword("");
    } catch {
      setError("Login failed. Please try again.");
      setIsAuthenticated(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setIsAuthenticated(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
        <div className="text-slate-300 animate-pulse">Checking admin session…</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-[#0f172a] p-8 rounded-2xl border border-white/10 shadow-2xl"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Admin Login</h1>
            <p className="text-slate-400">Enter your password to manage projects</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 bg-[#1e293b] border border-white/10 rounded-xl text-white outline-none focus:border-blue-500 transition-colors"
                autoFocus
              />
              {error && <p className="text-red-500 text-sm mt-2 ml-1">{error}</p>}
            </div>
            
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all active:scale-[0.98]"
            >
              Unlock Dashboard
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg text-sm font-medium transition-all"
        >
          Logout
        </button>
      </div>
      <AdminProjects />
    </div>
  );
}
