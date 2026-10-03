import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, GraduationCap, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { api } from "../lib/api";

export function StudentLoginForm({ onNavigate, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in both email and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/students/login", { email, password });
      if (response?.token) {
        localStorage.setItem("student_token", response.token);
        localStorage.setItem("campusiq_student", JSON.stringify(response.student));
        toast.success(`Welcome back, ${response.student?.name}!`);
        if (onLoginSuccess) {
          onLoginSuccess(response.student);
        }
      }
    } catch (err) {
      setError(err.message || "Invalid student credentials");
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col justify-center items-center px-4 relative overflow-hidden font-sans">
      {/* Dynamic Background Glows */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Login Card */}
      <div className="w-full max-w-md rounded-3xl bg-slate-900/90 border border-slate-800 p-8 shadow-2xl backdrop-blur-xl relative z-10">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-600/30">
            <GraduationCap className="size-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Student Login</h1>
          <p className="text-xs text-slate-400 mt-1">
            Access your placement portfolio & recruitment drives
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800/80 text-red-400 text-xs font-medium mb-5 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 block">University Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="priya.sharma@university.edu"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-sm text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <span className="text-[11px] text-indigo-400 cursor-pointer hover:underline">Forgot?</span>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
              <input
                type={showPwd ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your student password"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-sm text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50 mt-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
            <span>Sign In to Student Dashboard</span>
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-800 text-center text-xs text-slate-400">
          Don't have an account yet?{" "}
          <button
            onClick={() => onNavigate("student-register")}
            className="text-indigo-400 font-bold hover:underline"
          >
            Create student profile
          </button>
        </div>
      </div>
    </div>
  );
}
