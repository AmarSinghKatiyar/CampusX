import { useState, useEffect } from "react";
import {
  GraduationCap,
  ShieldCheck,
  Briefcase,
  Users,
  Trophy,
  ArrowRight,
  Database,
  Sparkles,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { API_BASE_URL } from "../lib/api";

export function RoleSelector({ onSelectRole }) {
  const [dbHealthy, setDbHealthy] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL.replace('/api', '')}/health/database`)
      .then((res) => res.json())
      .then((data) => setDbHealthy(data?.success === true))
      .catch(() => setDbHealthy(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col relative overflow-hidden selection:bg-indigo-500 selection:text-white font-sans">
      {/* Dynamic Animated Ambient Background Orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Top Navbar */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <GraduationCap className="size-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              CampusIQ
            </span>
            <span className="hidden sm:inline-block text-[10px] font-bold tracking-widest text-indigo-400 ml-2 px-2 py-0.5 rounded-full bg-indigo-950/80 border border-indigo-800/60 uppercase">
              Unified Portal
            </span>
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="relative z-10 flex-1 max-w-5xl mx-auto px-6 py-8 sm:py-12 flex flex-col items-center justify-center text-center">
        {/* Top Tagline */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs font-semibold text-slate-300 backdrop-blur-md mb-6 shadow-sm">
          <Sparkles size={14} className="text-amber-400" />
          <span>Institutional Placement & Career Intelligence Platform</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-3xl leading-tight mb-4 bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
          Select your portal to continue
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-xl mb-12">
          Tailored interfaces built specifically for student career acceleration and institutional placement governance.
        </p>

        {/* Role Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl text-left">
          {/* Student Role Card */}
          <div
            onClick={() => onSelectRole("student")}
            className="group relative rounded-3xl bg-slate-900/80 border border-slate-800 p-8 hover:border-indigo-500/60 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 cursor-pointer flex flex-col justify-between backdrop-blur-xl overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all" />
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-md">
                  <GraduationCap className="size-7" />
                </div>
                <span className="text-xs font-bold text-indigo-400 bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-800/60 uppercase tracking-wider">
                  Student Portal
                </span>
              </div>

              <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                I am a Student
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
                Access your personalized placement dashboard, test readiness score, apply to campus recruitment drives, and practice mock assessments.
              </p>

              <div className="space-y-2.5 pt-4 border-t border-slate-800/80 text-xs font-medium text-slate-300 mb-8">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>AI Placement Readiness Score & Analytics</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>Active Job Drives & 1-Click Application</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>Resume Builder & Mock Interview Practice</span>
                </div>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectRole("student");
              }}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/25 transition-all group-hover:gap-3"
            >
              <span>Enter Student Portal</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Teacher / Administrator Role Card */}
          <div
            onClick={() => onSelectRole("admin")}
            className="group relative rounded-3xl bg-slate-900/80 border border-slate-800 p-8 hover:border-emerald-500/60 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 cursor-pointer flex flex-col justify-between backdrop-blur-xl overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all" />

            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-md">
                  <ShieldCheck className="size-7" />
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800/60 uppercase tracking-wider">
                  Faculty & Admin
                </span>
              </div>

              <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                I am Faculty / Admin
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
                Manage recruitment drives, student registries, track hiring velocity, and generate real-time institutional placement audits.
              </p>

              <div className="space-y-2.5 pt-4 border-t border-slate-800/80 text-xs font-medium text-slate-300 mb-8">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>Recruitment Drives & Candidate Shortlisting</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>AI Student Leaderboard & Composite Scoring</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>Institutional Reports & CSV Data Export</span>
                </div>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectRole("admin");
              }}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-emerald-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 transition-all group-hover:gap-3"
            >
              <span>Enter Faculty / Admin Portal</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 text-center text-xs text-slate-500 border-t border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>© {new Date().getFullYear()} CampusIQ Placement Management System. All rights reserved.</p>
        <div className="flex items-center gap-4 text-slate-400 font-medium">
          <span className="flex items-center gap-1.5"><Lock size={12} className="text-indigo-400" /> 256-Bit Encrypted</span>
        </div>
      </footer>
    </div>
  );
}
