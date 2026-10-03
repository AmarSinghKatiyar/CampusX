import { useState, useEffect } from "react";
import {
  GraduationCap,
  Briefcase,
  Target,
  Trophy,
  CheckCircle2,
  Clock,
  Building2,
  IndianRupee,
  Code2,
  Award,
  ArrowRight,
  LogOut,
  Calendar,
  Sparkles,
  BookOpen,
  FileText,
  User,
  ShieldCheck,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { api } from "../lib/api";
import { toast } from "sonner";

export function StudentPortalView({ onSwitchRole, onLogout }) {
  const [students, setStudents] = useState([]);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [drives, setDrives] = useState([]);
  const [appliedDrives, setAppliedDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [studentList, driveList] = await Promise.all([
          api.get("/students"),
          api.get("/placements"),
        ]);
        setStudents(studentList);
        if (studentList.length > 0) {
          // Select default first student (e.g. Priya Sharma or first student)
          const primary = studentList[0];
          setCurrentStudent(primary);
          loadApplications(primary._id);
        }
        setDrives(driveList);
      } catch (err) {
        console.error("Failed to load student portal data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  async function loadApplications(studentId) {
    try {
      const studentData = await api.get(`/students/${studentId}`);
      if (studentData?.applications) {
        setAppliedDrives(studentData.applications);
      }
    } catch (e) {
      // Ignore
    }
  }

  const handleStudentChange = (studentId) => {
    const selected = students.find((s) => s._id === studentId);
    if (selected) {
      setCurrentStudent(selected);
      loadApplications(selected._id);
    }
  };

  const handleApply = async (driveId) => {
    if (!currentStudent) return;
    setApplyingId(driveId);
    try {
      await api.post(`/placements/${driveId}/applications`, {
        studentId: currentStudent._id,
      });
      toast.success("Application submitted successfully!");
      loadApplications(currentStudent._id);
    } catch (err) {
      toast.error(err.message || "Failed to apply");
    } finally {
      setApplyingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center">
        <Loader2 className="size-8 animate-spin text-indigo-500 mb-3" />
        <p className="text-sm text-slate-400 font-medium">Loading Student Dashboard…</p>
      </div>
    );
  }

  const student = currentStudent || {
    name: "Student Candidate",
    rollNumber: "CS001",
    branch: "Computer Science",
    batch: 2025,
    cgpa: 9.5,
    leetcode: 250,
    readiness: 90,
    aptitude: 88,
    communication: 85,
    projects: 90,
    placementStatus: "In-Progress",
  };

  const isEligibleForDrive = (drive) => {
    if (!drive) return false;
    const minCgpa = drive.eligibilityCriteria?.minCGPA || 0;
    const branches = drive.eligibilityCriteria?.branchesAllowed || [];
    const cgpaOk = (student.cgpa || 0) >= minCgpa;
    const branchOk = branches.length === 0 || branches.includes(student.branch);
    return cgpaOk && branchOk;
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <header className="h-16 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <GraduationCap className="size-5 text-white" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base tracking-tight text-white">CampusIQ</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-400 border border-indigo-800/60 uppercase">
              Student Dashboard
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Student Profile Selector */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-800/60 border border-slate-700/60 rounded-xl px-3 py-1.5 text-xs">
            <span className="text-slate-400">Profile:</span>
            <select
              value={student._id || ""}
              onChange={(e) => handleStudentChange(e.target.value)}
              className="bg-transparent font-semibold text-indigo-300 outline-none cursor-pointer"
            >
              {students.map((s) => (
                <option key={s._id} value={s._id} className="bg-slate-900 text-white">
                  {s.name} ({s.rollNumber})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onSwitchRole}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/70 border border-emerald-800/60 text-emerald-400 text-xs font-bold hover:bg-emerald-900/80 transition-all shadow-sm"
            title="Switch to Admin / Teacher Portal"
          >
            <ShieldCheck size={14} />
            <span className="hidden sm:inline">Switch to Admin Portal</span>
          </button>

          <button
            onClick={onLogout}
            className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
            title="Sign Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Student Welcome Card */}
        <div className="relative rounded-3xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-900/40 p-6 sm:p-8 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-xl shadow-indigo-600/30 shrink-0">
                {student.name.charAt(0)}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{student.name}</h1>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    student.placementStatus === "Placed"
                      ? "bg-emerald-950 text-emerald-400 border border-emerald-800/80"
                      : "bg-indigo-950 text-indigo-300 border border-indigo-800/80"
                  }`}>
                    {student.placementStatus || "Eligible Candidate"}
                  </span>
                </div>
                <p className="text-slate-400 text-xs sm:text-sm">
                  {student.rollNumber} · {student.branch} · Batch {student.batch || 2025}
                </p>
                {student.companyPlaced && (
                  <p className="text-emerald-400 text-xs font-semibold mt-2 flex items-center gap-1.5">
                    <CheckCircle2 size={14} /> Placed at {student.companyPlaced} ({student.salary ? `₹${(student.salary / 100000).toFixed(1)} LPA` : "Offer Accepted"})
                  </p>
                )}
              </div>
            </div>

            {/* Quick KPI Badges */}
            <div className="grid grid-cols-3 gap-3 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
              <div className="text-center px-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase">CGPA</span>
                <p className="text-lg font-extrabold text-white mt-0.5">{student.cgpa?.toFixed(2) || "0.00"}</p>
              </div>
              <div className="text-center px-3 border-x border-slate-800">
                <span className="text-[10px] font-bold text-indigo-400 uppercase">AI Score</span>
                <p className="text-lg font-extrabold text-indigo-400 mt-0.5">{student.score || Math.round(student.cgpa * 10)}</p>
              </div>
              <div className="text-center px-3">
                <span className="text-[10px] font-bold text-emerald-400 uppercase">Readiness</span>
                <p className="text-lg font-extrabold text-emerald-400 mt-0.5">{student.readiness || 85}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Skill Analytics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase">LeetCode Solved</span>
              <Code2 size={18} className="text-amber-400" />
            </div>
            <p className="text-2xl font-extrabold text-white tabular-nums">{student.leetcode || 240}</p>
            <p className="text-xs text-slate-500 mt-1">Data Structures & Algorithms</p>
          </div>

          <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Aptitude Score</span>
              <Target size={18} className="text-indigo-400" />
            </div>
            <p className="text-2xl font-extrabold text-white tabular-nums">{student.aptitude || 85}%</p>
            <p className="text-xs text-slate-500 mt-1">Quantitative & Logical</p>
          </div>

          <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Communication</span>
              <Sparkles size={18} className="text-purple-400" />
            </div>
            <p className="text-2xl font-extrabold text-white tabular-nums">{student.communication || 80}%</p>
            <p className="text-xs text-slate-500 mt-1">Mock Interview Evaluations</p>
          </div>

          <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Project Mastery</span>
              <Award size={18} className="text-emerald-400" />
            </div>
            <p className="text-2xl font-extrabold text-white tabular-nums">{student.projects || 85}%</p>
            <p className="text-xs text-slate-500 mt-1">Full-Stack & Capstone</p>
          </div>
        </div>

        {/* Placement Drives Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <Briefcase size={20} className="text-indigo-400" />
                Live Campus Recruitment Drives
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Explore active company openings and apply with your student profile</p>
            </div>
            <span className="text-xs font-bold text-indigo-400 bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-800/60">
              {drives.filter(d => d.status === "Active").length} Active Drives
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {drives.map((drive) => {
              const eligible = isEligibleForDrive(drive);
              return (
                <div
                  key={drive._id}
                  className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 flex flex-col justify-between hover:border-slate-700 transition-all group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                          {drive.companyName}
                        </h3>
                        <p className="text-xs font-medium text-slate-400 mt-0.5">{drive.jobRole}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        drive.status === "Active"
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-800/80"
                          : "bg-slate-800 text-slate-400"
                      }`}>
                        {drive.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 font-medium">
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                        <IndianRupee size={13} /> {drive.ctc} LPA
                      </span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1 text-slate-400">
                        <Calendar size={13} /> Starts {drive.startDate ? new Date(drive.startDate).toLocaleDateString() : "TBD"}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(drive.eligibilityCriteria?.branchesAllowed || []).map((b) => (
                        <span key={b} className="text-[10px] font-semibold bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md">
                          {b}
                        </span>
                      ))}
                      {drive.eligibilityCriteria?.minCGPA > 0 && (
                        <span className="text-[10px] font-semibold bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded-md border border-indigo-800/60">
                          Min CGPA {drive.eligibilityCriteria.minCGPA}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800/80">
                    <span className={`text-xs font-semibold ${eligible ? "text-emerald-400" : "text-amber-400"}`}>
                      {eligible ? "✓ You are Eligible" : "⚠ Does not match criteria"}
                    </span>
                    <button
                      disabled={!eligible || drive.status !== "Active" || applyingId === drive._id}
                      onClick={() => handleApply(drive._id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-40 transition-all shadow-md shadow-indigo-600/20"
                    >
                      {applyingId === drive._id ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
                      Apply Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
