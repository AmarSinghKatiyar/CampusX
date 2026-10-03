import { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, GraduationCap, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "../lib/api";

const BRANCHES = [
  "Computer Science",
  "Computer Science (AI)",
  "Information Technology",
  "Electronics",
  "Mechanical",
  "Civil",
  "Electrical",
];

export function StudentRegisterForm({ onNavigate, onRegisterSuccess }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    rollNumber: "",
    branch: "Computer Science",
    password: "",
    cgpa: "8.5",
  });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.rollNumber || !form.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/students/register", {
        ...form,
        cgpa: parseFloat(form.cgpa) || 8.0,
      });

      if (response?.token) {
        localStorage.setItem("student_token", response.token);
        localStorage.setItem("campusiq_student", JSON.stringify(response.student));
        toast.success(`Account created! Welcome, ${response.student?.name}!`);
        if (onRegisterSuccess) {
          onRegisterSuccess(response.student);
        }
      }
    } catch (err) {
      setError(err.message || "Registration failed");
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden font-sans">
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md rounded-3xl bg-slate-900/90 border border-slate-800 p-8 shadow-2xl backdrop-blur-xl relative z-10">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-indigo-600/30">
            <GraduationCap className="size-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Create Student Account</h1>
          <p className="text-xs text-slate-400 mt-1">Join your university placement network</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800/80 text-red-400 text-xs font-medium mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">Full Name *</label>
            <input
              required
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="e.g. Priya Sharma"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-sm text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">Roll Number *</label>
              <input
                required
                value={form.rollNumber}
                onChange={(e) => update("rollNumber", e.target.value)}
                placeholder="CS010"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-sm text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 uppercase transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">Current CGPA</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={form.cgpa}
                onChange={(e) => update("cgpa", e.target.value)}
                placeholder="8.5"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-sm text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">Branch / Discipline *</label>
            <select
              value={form.branch}
              onChange={(e) => update("branch", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-sm text-white outline-none focus:border-indigo-500 cursor-pointer"
            >
              {BRANCHES.map((b) => (
                <option key={b} value={b} className="bg-slate-900 text-white">
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">University Email *</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="student@university.edu"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-sm text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">Password *</label>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                required
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-sm text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 transition-all"
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
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50 mt-3"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
            <span>Create Account & Enter Dashboard</span>
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          Already registered?{" "}
          <button
            onClick={() => onNavigate("student-login")}
            className="text-indigo-400 font-bold hover:underline"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
