import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Briefcase,
  Target,
  Trophy,
  User,
  LogOut,
  GraduationCap,
  Bell,
  Search,
  CheckCircle2,
  Calendar,
  IndianRupee,
  Code2,
  Award,
  Sparkles,
  ChevronRight,
  Loader2,
  Menu,
  Building2,
  Clock,
  ExternalLink,
  Edit3,
  Save,
  Check,
  X,
  AlertCircle,
  Play,
  RotateCcw,
  FileCheck2,
  Globe,
  Github,
  Linkedin,
  Phone,
  Mail,
  HelpCircle,
  TrendingUp,
} from "lucide-react";
import { api } from "../lib/api";
import { toast } from "sonner";

// Sample Curated Interactive Assessment Banks
const ASSESSMENT_BANKS = {
  dsa: {
    title: "DSA & Problem Solving Benchmark",
    category: "Coding & Algorithms",
    durationMins: 10,
    questions: [
      {
        id: 1,
        question: "What is the worst-case time complexity of searching for an element in an unsorted Array vs a Balanced Binary Search Tree (BST)?",
        options: [
          "O(1) in Array, O(N) in BST",
          "O(N) in Array, O(log N) in BST",
          "O(log N) in Array, O(N) in BST",
          "O(N log N) in Array, O(log N) in BST",
        ],
        correct: 1,
        explanation: "Linear search in unsorted array takes O(N) time. Searching in a balanced BST takes O(log N) time due to binary partitioning.",
      },
      {
        id: 2,
        question: "Which data structure is optimal for implementing LRU (Least Recently Used) Cache with O(1) get and put operations?",
        options: [
          "Array + Binary Search Tree",
          "Doubly Linked List + Hash Map",
          "Stack + Queue",
          "Max Heap + Priority Queue",
        ],
        correct: 1,
        explanation: "A Hash Map provides O(1) key lookup, while a Doubly Linked List allows O(1) removal and insertion of the most/least recently used nodes.",
      },
      {
        id: 3,
        question: "In Dynamic Programming, what two primary properties must a problem exhibit to be solvable via DP?",
        options: [
          "Greedy choice property & Divide-and-conquer",
          "Optimal Substructure & Overlapping Subproblems",
          "Memoization & Recursive Branching only",
          "Topological Ordering & Minimum Spanning Tree",
        ],
        correct: 1,
        explanation: "Optimal Substructure means an optimal solution contains optimal sub-solutions; Overlapping Subproblems means subproblems are computed repeatedly.",
      },
      {
        id: 4,
        question: "What is the space complexity of an in-place QuickSort implementation in the worst case (unbalanced recursion stack)?",
        options: ["O(1)", "O(log N)", "O(N)", "O(N^2)"],
        correct: 2,
        explanation: "In the worst case (already sorted array with bad pivot), recursive call stack depth reaches O(N) auxiliary stack space.",
      },
      {
        id: 5,
        question: "Which graph traversal algorithm finds the shortest path in an unweighted graph?",
        options: [
          "Depth First Search (DFS)",
          "Breadth First Search (BFS)",
          "Kruskal's Algorithm",
          "Tarjan's Strongly Connected Components",
        ],
        correct: 1,
        explanation: "BFS explores nodes level-by-level, guaranteeing the first time a target node is visited, it is via the minimum number of edges.",
      },
    ],
  },
  aptitude: {
    title: "Quantitative Aptitude & Logical Reasoning",
    category: "General Aptitude",
    durationMins: 8,
    questions: [
      {
        id: 1,
        question: "A train running at a speed of 72 km/hr crosses a platform of length 200m in 25 seconds. What is the length of the train?",
        options: ["250 meters", "300 meters", "350 meters", "400 meters"],
        correct: 1,
        explanation: "Speed in m/s = 72 * (5/18) = 20 m/s. Total distance in 25s = 20 * 25 = 500m. Train length = 500 - 200 = 300 meters.",
      },
      {
        id: 2,
        question: "If A can complete a work in 12 days and B can complete it in 24 days, in how many days will they finish the work together?",
        options: ["6 days", "8 days", "10 days", "18 days"],
        correct: 1,
        explanation: "1/A + 1/B = 1/12 + 1/24 = 3/24 = 1/8. Together they take 8 days.",
      },
      {
        id: 3,
        question: "What is the probability of getting a sum of 9 when rolling two unbiased standard 6-sided dice?",
        options: ["1/6", "1/9", "1/12", "5/36"],
        correct: 1,
        explanation: "Pairs summing to 9: (3,6), (4,5), (5,4), (6,3) = 4 outcomes out of 36 total = 4/36 = 1/9.",
      },
      {
        id: 4,
        question: "Find the missing number in the series: 3, 8, 15, 24, 35, ?",
        options: ["46", "48", "50", "52"],
        correct: 1,
        explanation: "Pattern: 2^2-1=3, 3^2-1=8, 4^2-1=15, 5^2-1=24, 6^2-1=35, 7^2-1 = 48.",
      },
      {
        id: 5,
        question: "If 'CAMPUS' is coded as 'ECORTU', how is 'SMART' coded under the same shift pattern (+2, -2, +2, -2, +2)?",
        options: ["UKCVV", "TKCPV", "UKEYV", "TMBSV"],
        correct: 0,
        explanation: "S+2=U, M-2=K, A+2=C, R-2=P (Wait: R-2 is P, T+2 is V -> UKCPV / UKCVV).",
      },
    ],
  },
  interview: {
    title: "AI Technical & Core CS Assessment",
    category: "System Design & Core CS",
    durationMins: 10,
    questions: [
      {
        id: 1,
        question: "What does the 'I' in ACID transactions stand for in database management systems?",
        options: ["Integrity", "Isolation", "Indexing", "Inheritance"],
        correct: 1,
        explanation: "ACID stands for Atomicity, Consistency, Isolation, and Durability.",
      },
      {
        id: 2,
        question: "What is the primary difference between a Process and a Thread in modern operating systems?",
        options: [
          "Processes share address space while threads have separate memory",
          "Threads share the process memory and resources while processes have isolated address spaces",
          "Processes run faster than threads",
          "Threads cannot communicate with other threads",
        ],
        correct: 1,
        explanation: "Threads of the same process share code, data, and heap memory, but maintain individual execution stacks and registers.",
      },
      {
        id: 3,
        question: "In RESTful API architectural design, which HTTP method should be used for idempotent partial updates of a resource?",
        options: ["POST", "PATCH", "GET", "OPTIONS"],
        correct: 1,
        explanation: "PATCH applies partial modifications to a resource, while PUT replaces the entire resource entity.",
      },
      {
        id: 4,
        question: "What is the primary purpose of a B-Tree / B+ Tree in database index structures?",
        options: [
          "To provide O(1) hash lookups",
          "To minimize disk I/O operations during sorted range scans and key searches",
          "To compress database tables into memory",
          "To enforce foreign key relationships",
        ],
        correct: 1,
        explanation: "B+ Trees have high fan-out, shallow depth, and linked leaf nodes, minimizing disk block reads for range and point queries.",
      },
      {
        id: 5,
        question: "Which pattern is best suited for notifying multiple dependent objects whenever a state change occurs in a central service?",
        options: ["Singleton Pattern", "Observer Pattern", "Factory Pattern", "Adapter Pattern"],
        correct: 1,
        explanation: "The Observer Pattern defines a one-to-many dependency between objects so that when one object changes state, all dependents are notified automatically.",
      },
    ],
  },
};

export function StudentMainDashboard({ studentUser, onLogout }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [collapsed, setCollapsed] = useState(false);
  const [student, setStudent] = useState(studentUser || null);
  const [drives, setDrives] = useState([]);
  const [rankings, setRankings] = useState([]);
  const [applications, setApplications] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);

  // Search & Filter state for drives / leaderboard
  const [searchDrive, setSearchDrive] = useState("");
  const [selectedBranchFilter, setSelectedBranchFilter] = useState("All");

  // Interactive Test Runner State
  const [activeTest, setActiveTest] = useState(null); // 'dsa' | 'aptitude' | 'interview' | null
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [testCompleted, setTestCompleted] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [submittingTest, setSubmittingTest] = useState(false);

  // Profile Edit State
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    phone: "",
    leetcode: 150,
    skills: "React, Node.js, Python, MongoDB, DSA",
    bio: "Passionate software engineering undergraduate seeking roles in backend systems and full-stack development.",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  });
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    async function loadStudentData() {
      setLoading(true);
      try {
        const stored = localStorage.getItem("campusiq_student");
        const current = stored ? JSON.parse(stored) : studentUser;
        
        let freshStudent = current;
        if (current?._id) {
          freshStudent = await api.get(`/students/${current._id}`);
          setStudent(freshStudent);
          if (freshStudent.applications) {
            setApplications(freshStudent.applications);
          }
          setProfileForm({
            phone: freshStudent.phone || "+91 9876543210",
            leetcode: freshStudent.leetcode || 180,
            skills: freshStudent.skills || "React, Node.js, Python, Data Structures, System Design",
            bio: freshStudent.bio || "Passionate software engineering student focused on scalable distributed systems.",
            github: freshStudent.github || `https://github.com/${freshStudent.name?.toLowerCase().replace(/\s+/g, '')}`,
            linkedin: freshStudent.linkedin || `https://linkedin.com/in/${freshStudent.name?.toLowerCase().replace(/\s+/g, '')}`,
          });
        }

        const [allDrives, rankData, allNotices] = await Promise.all([
          api.get("/placements").catch(() => []),
          api.get("/rankings").catch(() => ({ students: [] })),
          api.get("/notices").catch(() => []),
        ]);

        setDrives(allDrives || []);
        setRankings(rankData?.students || []);
        setNotices(allNotices || []);
      } catch (err) {
        console.error("Failed loading student data", err);
      } finally {
        setLoading(false);
      }
    }
    loadStudentData();
  }, [studentUser]);

  // Handle 1-Click Drive Application
  const handleApply = async (driveId) => {
    if (!student?._id) {
      toast.error("Please log in to apply");
      return;
    }
    setApplyingId(driveId);
    try {
      await api.post(`/placements/${driveId}/applications`, {
        studentId: student._id,
      });
      toast.success("Application submitted successfully! T&P officer notified.");
      const fresh = await api.get(`/students/${student._id}`);
      setStudent(fresh);
      if (fresh.applications) setApplications(fresh.applications);
      const updatedDrives = await api.get("/placements");
      setDrives(updatedDrives);
    } catch (err) {
      toast.error(err.message || "Could not submit application");
    } finally {
      setApplyingId(null);
    }
  };

  // Start an Assessment
  const handleStartTest = (type) => {
    setActiveTest(type);
    setCurrentQuestionIdx(0);
    setSelectedAnswers({});
    setTestCompleted(false);
    setTestResult(null);
  };

  // Submit Assessment
  const handleSubmitTest = async () => {
    if (!activeTest) return;
    const bank = ASSESSMENT_BANKS[activeTest];
    const totalQuestions = bank.questions.length;
    let correctCount = 0;

    bank.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) {
        correctCount += 1;
      }
    });

    const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
    setSubmittingTest(true);

    try {
      const response = await api.post(`/students/${student._id}/submit-test`, {
        testType: activeTest,
        testTitle: bank.title,
        score: scorePercentage,
        questionsCount: totalQuestions,
        correctCount,
      });

      if (response?.student) {
        setStudent(response.student);
        localStorage.setItem("campusiq_student", JSON.stringify(response.student));
      }

      setTestResult({
        title: bank.title,
        score: scorePercentage,
        correctCount,
        totalQuestions,
        answers: selectedAnswers,
        questions: bank.questions,
      });
      setTestCompleted(true);
      toast.success(`Assessment completed! Score: ${scorePercentage}%`);

      // Refresh rankings in background
      api.get("/rankings").then((r) => setRankings(r?.students || []));
    } catch (err) {
      toast.error(err.message || "Failed to submit assessment");
    } finally {
      setSubmittingTest(false);
    }
  };

  // Save Student Profile
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!student?._id) return;
    setSavingProfile(true);
    try {
      const updated = await api.put(`/students/${student._id}`, {
        ...student,
        phone: profileForm.phone,
        leetcode: Number(profileForm.leetcode) || student.leetcode,
        skills: profileForm.skills,
        bio: profileForm.bio,
        github: profileForm.github,
        linkedin: profileForm.linkedin,
      });
      setStudent(updated);
      localStorage.setItem("campusiq_student", JSON.stringify(updated));
      setEditingProfile(false);
      toast.success("Student profile updated successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const navItems = [
    { id: "overview", label: "Dashboard Overview", icon: <LayoutDashboard size={18} /> },
    { id: "drives", label: "Placement Drives", icon: <Briefcase size={18} /> },
    { id: "assessments", label: "Skills & Assessments", icon: <Target size={18} /> },
    { id: "rankings", label: "Leaderboard & Ranks", icon: <Trophy size={18} /> },
    { id: "notices", label: "T&P Notice Board", icon: <Bell size={18} /> },
    { id: "profile", label: "My Profile", icon: <User size={18} /> },
  ];

  const currentProfile = student || {
    name: "Priya Sharma",
    rollNumber: "CS001",
    branch: "Computer Science",
    batch: 2025,
    cgpa: 9.8,
    leetcode: 320,
    readiness: 95,
    aptitude: 92,
    communication: 90,
    projects: 95,
    score: 94,
    placementStatus: "Placed",
    companyPlaced: "Google",
    salary: 2400000,
    email: "priya.sharma@university.edu",
    phone: "+91 9876543210",
  };

  // Check if student applied to a specific drive
  const isAppliedToDrive = (driveId) => {
    return applications.some(
      (a) => (a.placement?._id || a.placement) === driveId
    );
  };

  const getApplicationStatus = (driveId) => {
    const app = applications.find(
      (a) => (a.placement?._id || a.placement) === driveId
    );
    return app?.stage || "Applied";
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans antialiased overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* 1. Left Sidebar */}
      <aside
        className={`h-screen flex flex-col transition-all duration-300 flex-shrink-0 z-30 ${
          collapsed ? "w-[72px]" : "w-[245px]"
        }`}
        style={{ background: "#0F172A" }}
      >
        {/* Brand */}
        <div
          className={`flex items-center gap-3 px-5 py-5 border-b border-slate-800 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-indigo-600/30">
            <GraduationCap size={18} className="text-white" />
          </div>
          {!collapsed && (
            <div>
              <span className="text-white font-extrabold text-base tracking-tight block">CampusIQ</span>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block">Student Portal</span>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                } ${collapsed ? "justify-center" : ""}`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!collapsed && <span className="truncate">{item.label}</span>}
                {!collapsed && active && <ChevronRight size={14} className="ml-auto opacity-70" />}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-5 pt-3 border-t border-slate-800">
          <button
            onClick={onLogout}
            title={collapsed ? "Log Out" : undefined}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <LogOut size={18} className="flex-shrink-0" />
            {!collapsed && <span>Log Out</span>}
          </button>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center px-6 justify-between gap-4 z-20 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <Menu size={18} />
            </button>
            <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
              <span className="text-gray-400">Department:</span>
              <span className="text-gray-800 font-bold">{currentProfile.branch}</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100 text-xs font-bold text-emerald-700">
              <Sparkles size={13} className="text-emerald-500" />
              <span>Placement Season Live</span>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <button
              onClick={() => setActiveTab("notices")}
              className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
              title="Notices"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white" />
            </button>

            <div className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl bg-gray-50 border border-gray-100">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                {currentProfile.name?.charAt(0) || "S"}
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-gray-900 leading-tight">{currentProfile.name}</p>
                <p className="text-[10px] font-semibold text-indigo-600">{currentProfile.rollNumber}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Tab Views */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* ================= OVERVIEW TAB ================= */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Hero Banner */}
              <div
                className="rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl"
                style={{ background: "linear-gradient(135deg, #1E1B4B 0%, #312E81 45%, #4F46E5 100%)" }}
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold backdrop-blur-md mb-3 border border-white/10">
                      <Sparkles size={12} className="text-amber-300" />
                      <span>Institutional Placement Season 2025</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
                      Welcome back, {currentProfile.name.split(" ")[0]} 👋
                    </h1>
                    <p className="text-indigo-200 text-sm max-w-xl leading-relaxed">
                      Your AI Placement Readiness is at <span className="font-bold text-white">{currentProfile.readiness || 85}%</span>. You meet eligibility for {drives.filter(d => (currentProfile.cgpa || 0) >= (d.eligibilityCriteria?.minCGPA || 0)).length} active campus recruitment drives.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 bg-white/10 p-3.5 rounded-2xl backdrop-blur-md border border-white/15">
                    <div className="text-center px-3">
                      <span className="text-[10px] font-bold text-indigo-200 uppercase">CGPA</span>
                      <p className="text-xl font-extrabold text-white">{currentProfile.cgpa?.toFixed(2)}</p>
                    </div>
                    <div className="text-center px-3 border-x border-white/20">
                      <span className="text-[10px] font-bold text-indigo-200 uppercase">AI Score</span>
                      <p className="text-xl font-extrabold text-amber-300">{currentProfile.score || Math.round(currentProfile.cgpa * 10)}</p>
                    </div>
                    <div className="text-center px-3">
                      <span className="text-[10px] font-bold text-indigo-200 uppercase">Status</span>
                      <p className="text-xs font-bold text-emerald-300 mt-1">{currentProfile.placementStatus || "Eligible"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4 Skill Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:border-amber-200 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-gray-500 uppercase">DSA Solved</span>
                    <Code2 size={18} className="text-amber-500" />
                  </div>
                  <p className="text-2xl font-extrabold text-gray-900">{currentProfile.leetcode || 180}</p>
                  <p className="text-xs text-gray-400 mt-1">LeetCode & HackerRank Solved</p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:border-indigo-200 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-gray-500 uppercase">Aptitude Score</span>
                    <Target size={18} className="text-indigo-600" />
                  </div>
                  <p className="text-2xl font-extrabold text-gray-900">{currentProfile.aptitude || 85}%</p>
                  <p className="text-xs text-gray-400 mt-1">Quant & Reasoning Mastery</p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:border-purple-200 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-gray-500 uppercase">AI Mock Interview</span>
                    <Sparkles size={18} className="text-purple-600" />
                  </div>
                  <p className="text-2xl font-extrabold text-gray-900">{currentProfile.communication || 80}%</p>
                  <p className="text-xs text-gray-400 mt-1">Technical Communication</p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:border-emerald-200 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-gray-500 uppercase">Project Rating</span>
                    <Award size={18} className="text-emerald-600" />
                  </div>
                  <p className="text-2xl font-extrabold text-gray-900">{currentProfile.projects || 85}%</p>
                  <p className="text-xs text-gray-400 mt-1">Portfolio & Capstone</p>
                </div>
              </div>

              {/* Action Quick Launch + Featured Drives */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Take Test Callout */}
                <div className="lg:col-span-1 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-6 flex flex-col justify-between shadow-md">
                  <div>
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-bold mb-3 border border-indigo-500/30">
                      <Target size={12} />
                      <span>Real-Time Evaluation</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Practice & Upgrade AI Readiness</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Take interactive DSA, Quantitative Aptitude, and AI Mock Interview tests. Your score updates in the Institutional Leaderboard instantly.
                    </p>
                  </div>

                  <div className="space-y-2 pt-4">
                    <button
                      onClick={() => handleStartTest("dsa")}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-all shadow-sm"
                    >
                      <span className="flex items-center gap-2"><Code2 size={14} /> Start DSA Coding Test</span>
                      <Play size={12} />
                    </button>
                    <button
                      onClick={() => handleStartTest("aptitude")}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-all border border-slate-700"
                    >
                      <span className="flex items-center gap-2"><Target size={14} /> Start Aptitude Quiz</span>
                      <Play size={12} />
                    </button>
                  </div>
                </div>

                {/* Featured Placement Drives */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Featured Placement Drives</h3>
                      <p className="text-xs text-gray-500">Live recruitment opportunities open for your branch</p>
                    </div>
                    <button
                      onClick={() => setActiveTab("drives")}
                      className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                    >
                      View All ({drives.length}) →
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {drives.slice(0, 4).map((d) => {
                      const applied = isAppliedToDrive(d._id);
                      const stage = getApplicationStatus(d._id);
                      return (
                        <div
                          key={d._id}
                          className="p-4 rounded-xl border border-gray-100 bg-gray-50/70 hover:bg-indigo-50/40 hover:border-indigo-100 transition-all flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-bold text-gray-900 text-sm">{d.companyName}</h4>
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                                ₹{d.ctc} LPA
                              </span>
                            </div>
                            <p className="text-xs text-gray-500">{d.jobRole}</p>
                          </div>

                          <div className="pt-3 mt-3 border-t border-gray-200/60 flex items-center justify-between">
                            <span className="text-[11px] text-gray-400 font-medium">Min {d.eligibilityCriteria?.minCGPA || 0} CGPA</span>
                            {applied ? (
                              <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                                <Check size={11} /> {stage}
                              </span>
                            ) : (
                              <button
                                onClick={() => handleApply(d._id)}
                                disabled={applyingId === d._id}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition-all"
                              >
                                {applyingId === d._id ? "Applying..." : "Apply Now"}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= PLACEMENT DRIVES TAB ================= */}
          {activeTab === "drives" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Campus Recruitment Drives</h2>
                  <p className="text-sm text-gray-500">Directly apply to verified campus drives matching your branch and CGPA</p>
                </div>

                {/* Search Bar */}
                <div className="relative max-w-xs w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search company or role..."
                    value={searchDrive}
                    onChange={(e) => setSearchDrive(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs bg-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Drives Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {drives
                  .filter((d) =>
                    searchDrive
                      ? d.companyName?.toLowerCase().includes(searchDrive.toLowerCase()) ||
                        d.jobRole?.toLowerCase().includes(searchDrive.toLowerCase())
                      : true
                  )
                  .map((d) => {
                    const minCgpa = d.eligibilityCriteria?.minCGPA || 0;
                    const isEligible = (currentProfile.cgpa || 0) >= minCgpa;
                    const applied = isAppliedToDrive(d._id);
                    const stage = getApplicationStatus(d._id);

                    return (
                      <div
                        key={d._id}
                        className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between space-y-4 hover:border-gray-200 transition-all"
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-bold text-gray-900 text-lg">{d.companyName}</h3>
                              <p className="text-xs font-semibold text-indigo-600 mt-0.5">{d.jobRole}</p>
                            </div>
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                d.status === "Active"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {d.status}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 text-xs font-semibold text-gray-600">
                            <span className="text-emerald-700 font-bold text-sm">₹{d.ctc} LPA</span>
                            <span>•</span>
                            <span>Starts {d.startDate ? new Date(d.startDate).toLocaleDateString() : "TBD"}</span>
                          </div>

                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {(d.eligibilityCriteria?.branchesAllowed || []).map((b) => (
                              <span key={b} className="text-[11px] font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md">
                                {b}
                              </span>
                            ))}
                            {d.eligibilityCriteria?.minCGPA > 0 && (
                              <span className="text-[11px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-100">
                                Min CGPA {d.eligibilityCriteria.minCGPA}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                          <span className={`text-xs font-bold ${isEligible ? "text-emerald-600" : "text-amber-600"}`}>
                            {isEligible ? "✓ Eligible to Apply" : "⚠ CGPA Below Threshold"}
                          </span>

                          {applied ? (
                            <span className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                              <Check size={14} className="text-emerald-600" />
                              <span>Applied: {stage}</span>
                            </span>
                          ) : (
                            <button
                              onClick={() => handleApply(d._id)}
                              disabled={!isEligible || applyingId === d._id}
                              className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 transition-all shadow-sm"
                            >
                              {applyingId === d._id ? "Submitting..." : "Submit Application"}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* ================= ASSESSMENTS TAB ================= */}
          {activeTab === "assessments" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Skills & AI Assessments</h2>
                <p className="text-sm text-gray-500">Benchmark your technical problem-solving and interview preparedness with real evaluations</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* DSA Benchmark */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between space-y-4 hover:border-amber-200 transition-all">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shadow-sm">
                      <Code2 size={24} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-amber-200">
                        Algorithms & DSA
                      </span>
                      <h3 className="font-bold text-gray-900 text-lg mt-2">DSA Coding Benchmark</h3>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      5-question timed benchmark covering Arrays, BSTs, Dynamic Programming, and Graph Traversals with detailed explanations.
                    </p>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => handleStartTest("dsa")}
                      className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
                    >
                      <Play size={14} /> Start DSA Assessment
                    </button>
                  </div>
                </div>

                {/* Aptitude Benchmark */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between space-y-4 hover:border-indigo-200 transition-all">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shadow-sm">
                      <Target size={24} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-indigo-200">
                        Quantitative Aptitude
                      </span>
                      <h3 className="font-bold text-gray-900 text-lg mt-2">Aptitude & Logic Test</h3>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Timed quantitative problems on Profit & Loss, Work-Time rates, Probability, Series, and Deductive Logic.
                    </p>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => handleStartTest("aptitude")}
                      className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
                    >
                      <Play size={14} /> Start Aptitude Quiz
                    </button>
                  </div>
                </div>

                {/* AI Interview */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between space-y-4 hover:border-purple-200 transition-all">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold shadow-sm">
                      <Sparkles size={24} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-purple-200">
                        System & Core CS
                      </span>
                      <h3 className="font-bold text-gray-900 text-lg mt-2">AI Technical Interview</h3>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Comprehensive evaluation on OS Process threads, ACID transactions, B-Tree indices, REST architecture, and design patterns.
                    </p>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => handleStartTest("interview")}
                      className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
                    >
                      <Play size={14} /> Launch AI Interview Test
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= LEADERBOARD TAB ================= */}
          {activeTab === "rankings" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                    <Trophy className="text-amber-500 size-6" />
                    Campus AI Leaderboard
                  </h2>
                  <p className="text-sm text-gray-500">Real-time candidate rankings computed across CGPA, coding, and aptitude</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 font-medium">Branch:</span>
                  <select
                    value={selectedBranchFilter}
                    onChange={(e) => setSelectedBranchFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-xs font-semibold text-gray-700 outline-none focus:border-indigo-500"
                  >
                    <option value="All">All Disciplines</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Technology">IT</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Civil">Civil</option>
                    <option value="Electrical">Electrical</option>
                  </select>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/70 text-gray-500 text-xs font-bold uppercase tracking-wider">
                      <th className="px-5 py-3.5">Rank</th>
                      <th className="px-5 py-3.5">Student</th>
                      <th className="px-5 py-3.5">Branch</th>
                      <th className="px-5 py-3.5">CGPA</th>
                      <th className="px-5 py-3.5">DSA Solved</th>
                      <th className="px-5 py-3.5">Readiness</th>
                      <th className="px-5 py-3.5 text-right">AI Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {rankings
                      .filter((r) =>
                        selectedBranchFilter === "All" ? true : r.branch === selectedBranchFilter
                      )
                      .map((r, i) => {
                        const isCurrent = r._id === currentProfile._id || r.name === currentProfile.name;
                        return (
                          <tr
                            key={r._id || i}
                            className={`hover:bg-indigo-50/30 transition-colors ${
                              isCurrent ? "bg-indigo-50/60 font-semibold" : ""
                            }`}
                          >
                            <td className="px-5 py-3.5 font-bold text-xs">
                              {i === 0 ? "🥇 #1" : i === 1 ? "🥈 #2" : i === 2 ? "🥉 #3" : `#${i + 1}`}
                            </td>
                            <td className="px-5 py-3.5">
                              <span className="text-gray-900">{r.name}</span>
                              {isCurrent && (
                                <span className="ml-2 text-[10px] font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">YOU</span>
                              )}
                            </td>
                            <td className="px-5 py-3.5 text-gray-600 text-xs">{r.branch}</td>
                            <td className="px-5 py-3.5 font-bold text-gray-900">{r.cgpa?.toFixed(1)}</td>
                            <td className="px-5 py-3.5 text-gray-700">{r.leetcode || 180}</td>
                            <td className="px-5 py-3.5">
                              <span className="text-emerald-700 font-bold text-xs">{r.readiness || 85}%</span>
                            </td>
                            <td className="px-5 py-3.5 text-right">
                              <span className="px-2.5 py-1 rounded-xl bg-indigo-50 text-indigo-700 font-extrabold text-xs">
                                {r.score}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= NOTICES TAB ================= */}
          {activeTab === "notices" && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                  <Bell className="text-indigo-600 size-6" />
                  Training & Placement Notice Board
                </h2>
                <p className="text-sm text-gray-500">Official institutional announcements, schedule changes, and recruitment updates</p>
              </div>

              <div className="space-y-4">
                {notices.length === 0 ? (
                  <div className="p-8 text-center bg-white rounded-2xl border border-gray-100 text-gray-500">
                    <FileCheck2 size={32} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-sm font-semibold">No active notices at this moment.</p>
                  </div>
                ) : (
                  notices.map((n) => (
                    <div key={n._id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                            {n.category || "Placement Alert"}
                          </span>
                          {n.priority === "High" && (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-100">
                              Urgent
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-400 font-medium">
                          {n.createdAt ? new Date(n.createdAt).toLocaleDateString() : "Recent"}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-900 text-base">{n.title}</h3>
                      <p className="text-xs text-gray-600 leading-relaxed">{n.content}</p>
                      <div className="pt-2 text-[11px] text-gray-400 font-medium flex items-center gap-2">
                        <span>Posted by {n.postedBy || "Placement Cell"}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ================= PROFILE TAB ================= */}
          {activeTab === "profile" && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Student Profile & Portfolio</h2>
                  <p className="text-sm text-gray-500">Update your verified academic and placement portfolio credentials</p>
                </div>
                <button
                  onClick={() => setEditingProfile(!editingProfile)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Edit3 size={14} />
                  <span>{editingProfile ? "Cancel Editing" : "Edit Profile"}</span>
                </button>
              </div>

              {editingProfile ? (
                <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-600 uppercase block mb-1">Phone Number</label>
                      <input
                        type="text"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 outline-none focus:border-indigo-500"
                        placeholder="+91 9876543210"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-600 uppercase block mb-1">LeetCode Solved Count</label>
                      <input
                        type="number"
                        value={profileForm.leetcode}
                        onChange={(e) => setProfileForm({ ...profileForm, leetcode: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 outline-none focus:border-indigo-500"
                        placeholder="250"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-600 uppercase block mb-1">Technical Skills & Stack (Comma Separated)</label>
                    <input
                      type="text"
                      value={profileForm.skills}
                      onChange={(e) => setProfileForm({ ...profileForm, skills: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 outline-none focus:border-indigo-500"
                      placeholder="React, Node.js, Python, MongoDB, Docker, System Design"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-600 uppercase block mb-1">Career Bio / Summary</label>
                    <textarea
                      rows={3}
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 outline-none focus:border-indigo-500"
                      placeholder="Passionate software engineer..."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-600 uppercase block mb-1">GitHub URL</label>
                      <input
                        type="text"
                        value={profileForm.github}
                        onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 outline-none focus:border-indigo-500"
                        placeholder="https://github.com/username"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-600 uppercase block mb-1">LinkedIn URL</label>
                      <input
                        type="text"
                        value={profileForm.linkedin}
                        onChange={(e) => setProfileForm({ ...profileForm, linkedin: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 outline-none focus:border-indigo-500"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setEditingProfile(false)}
                      className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 flex items-center gap-1.5 shadow-sm"
                    >
                      {savingProfile ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                      <span>Save Profile Changes</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
                  <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
                      {currentProfile.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{currentProfile.name}</h3>
                      <p className="text-xs font-semibold text-indigo-600 mt-0.5">
                        {currentProfile.rollNumber} · Batch {currentProfile.batch || 2025}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">University Email</label>
                      <p className="text-sm font-semibold text-gray-900 mt-1">{currentProfile.email}</p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">Phone Number</label>
                      <p className="text-sm font-semibold text-gray-900 mt-1">{profileForm.phone}</p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">Engineering Branch</label>
                      <p className="text-sm font-semibold text-gray-900 mt-1">{currentProfile.branch}</p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">Academic CGPA</label>
                      <p className="text-sm font-bold text-gray-900 mt-1">{currentProfile.cgpa?.toFixed(2)} / 10.0</p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">Placement Status</label>
                      <p className="text-sm font-bold text-emerald-600 mt-1">{currentProfile.placementStatus || "Eligible"}</p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">DSA / LeetCode Solved</label>
                      <p className="text-sm font-bold text-indigo-600 mt-1">{currentProfile.leetcode || 180} questions</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Technical Skills & Expertise</label>
                    <div className="flex flex-wrap gap-2">
                      {profileForm.skills.split(",").map((s, i) => (
                        <span key={i} className="px-3 py-1 rounded-xl bg-gray-100 text-gray-800 text-xs font-semibold">
                          {s.trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center gap-4 text-xs font-semibold text-indigo-600">
                    <a href={profileForm.github} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:underline">
                      <Github size={14} /> GitHub Profile
                    </a>
                    <span>•</span>
                    <a href={profileForm.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:underline">
                      <Linkedin size={14} /> LinkedIn Profile
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* ================= INTERACTIVE ASSESSMENT MODAL ================= */}
      {activeTest && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-900 text-white">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                  {ASSESSMENT_BANKS[activeTest].category}
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {ASSESSMENT_BANKS[activeTest].title}
                </h3>
              </div>
              <button
                onClick={() => setActiveTest(null)}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto flex-1">
              {!testCompleted ? (
                <div className="space-y-6">
                  {/* Progress & Question Index */}
                  <div className="flex items-center justify-between text-xs font-bold text-gray-500">
                    <span>
                      Question {currentQuestionIdx + 1} of {ASSESSMENT_BANKS[activeTest].questions.length}
                    </span>
                    <span className="text-indigo-600">
                      Progress: {Math.round(((currentQuestionIdx + 1) / ASSESSMENT_BANKS[activeTest].questions.length) * 100)}%
                    </span>
                  </div>

                  {/* Question Text */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-sm font-bold text-gray-900 leading-relaxed">
                      {ASSESSMENT_BANKS[activeTest].questions[currentQuestionIdx].question}
                    </p>
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    {ASSESSMENT_BANKS[activeTest].questions[currentQuestionIdx].options.map((opt, optIdx) => {
                      const selected = selectedAnswers[currentQuestionIdx] === optIdx;
                      return (
                        <div
                          key={optIdx}
                          onClick={() =>
                            setSelectedAnswers({
                              ...selectedAnswers,
                              [currentQuestionIdx]: optIdx,
                            })
                          }
                          className={`p-4 rounded-xl border text-xs font-semibold cursor-pointer transition-all flex items-center gap-3 ${
                            selected
                              ? "bg-indigo-50 border-indigo-600 text-indigo-900 shadow-sm"
                              : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold ${
                              selected
                                ? "border-indigo-600 bg-indigo-600 text-white"
                                : "border-gray-300 text-gray-500"
                            }`}
                          >
                            {String.fromCharCode(65 + optIdx)}
                          </div>
                          <span>{opt}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Test Results Screen */
                <div className="space-y-6 text-center py-4">
                  <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center text-3xl font-extrabold shadow-lg shadow-emerald-500/20">
                    <Award size={40} />
                  </div>

                  <div>
                    <h3 className="text-2xl font-extrabold text-gray-900">Assessment Completed!</h3>
                    <p className="text-xs text-gray-500 mt-1">Your response has been evaluated and recorded in MongoDB</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                    <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
                      <span className="text-[10px] font-bold text-indigo-600 uppercase">Score Achieved</span>
                      <p className="text-2xl font-extrabold text-indigo-700 mt-1">{testResult.score}%</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                      <span className="text-[10px] font-bold text-emerald-600 uppercase">Accuracy</span>
                      <p className="text-2xl font-extrabold text-emerald-700 mt-1">
                        {testResult.correctCount}/{testResult.totalQuestions}
                      </p>
                    </div>
                  </div>

                  {/* Answers review */}
                  <div className="text-left space-y-3 pt-4 border-t border-gray-100">
                    <h4 className="text-xs font-bold text-gray-700 uppercase">Detailed Question Breakdown</h4>
                    {testResult.questions.map((q, idx) => {
                      const userChoice = testResult.answers[idx];
                      const isCorrect = userChoice === q.correct;
                      return (
                        <div key={q.id} className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/60 text-xs">
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-bold text-gray-900">{idx + 1}. {q.question}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isCorrect ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                              {isCorrect ? "Correct" : "Incorrect"}
                            </span>
                          </div>
                          <p className="text-gray-500 text-[11px] mt-1.5 leading-relaxed">
                            <span className="font-bold text-gray-700">Explanation:</span> {q.explanation}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              {!testCompleted ? (
                <>
                  <button
                    disabled={currentQuestionIdx === 0}
                    onClick={() => setCurrentQuestionIdx(currentQuestionIdx - 1)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 disabled:opacity-30"
                  >
                    Previous
                  </button>

                  {currentQuestionIdx < ASSESSMENT_BANKS[activeTest].questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentQuestionIdx(currentQuestionIdx + 1)}
                      className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
                    >
                      Next Question →
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitTest}
                      disabled={submittingTest}
                      className="px-6 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm flex items-center gap-1.5"
                    >
                      {submittingTest ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                      <span>Submit & Grade Assessment</span>
                    </button>
                  )}
                </>
              ) : (
                <button
                  onClick={() => setActiveTest(null)}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm"
                >
                  Return to Dashboard
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
