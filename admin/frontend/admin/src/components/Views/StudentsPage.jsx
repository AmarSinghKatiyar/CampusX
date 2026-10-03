import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Download,
  Plus,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
  Trash2,
  Eye,
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  Code2,
  Award,
  CheckCircle,
} from "lucide-react";
import { api } from "../lib/api";

const STATUS_STYLES = {
  Placed: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Eligible: "bg-indigo-50 text-indigo-700 border border-indigo-200",
  "Not Eligible": "bg-red-50 text-red-700 border border-red-200",
  "In-Progress": "bg-amber-50 text-amber-700 border border-amber-200",
  Unplaced: "bg-gray-100 text-gray-700 border border-gray-200",
};

const STATUS_LABELS = {
  Placed: "Placed",
  Eligible: "Eligible",
  "In-Progress": "In-Progress",
  "Not Eligible": "Not Eligible",
  Unplaced: "Unplaced",
};

const STATUS_OPTIONS = [
  { value: "All", label: "All" },
  { value: "Placed", label: "Placed" },
  { value: "Eligible", label: "Eligible" },
  { value: "In-Progress", label: "In-Progress" },
  { value: "Not Eligible", label: "Not Eligible" },
];

const BRANCHES = [
  "Computer Science",
  "Computer Science (AI)",
  "Information Technology",
  "Electronics",
  "Mechanical",
  "Civil",
  "Electrical",
];

function initials(name = "") {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

function ReadinessBar({ value = 0 }) {
  const color =
    value >= 80 ? "#10B981" : value >= 60 ? "#F59E0B" : "#EF4444";
  return (
    <div className="flex items-center gap-2 w-28">
      <div className="h-2 flex-1 rounded-full bg-gray-100 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-semibold tabular-nums text-gray-600 w-7">{value}%</span>
    </div>
  );
}

function emptyForm() {
  return {
    name: "",
    email: "",
    rollNumber: "",
    branch: BRANCHES[0],
    cgpa: "",
    batch: new Date().getFullYear(),
    phone: "",
    leetcode: "",
    readiness: "80",
    aptitude: "85",
    communication: "80",
    projects: "75",
    status: "Eligible",
    placementStatus: "Unplaced",
    companyPlaced: "",
    salary: "",
  };
}

function AddStudentModal({ onClose, onCreated }) {
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const valid = form.name.trim() && form.email.trim() && form.rollNumber.trim() && form.cgpa;

  async function submit(e) {
    e.preventDefault();
    if (!valid) return;
    setSaving(true);
    setError("");

    try {
      await api.post("/students", {
        ...form,
        cgpa: parseFloat(form.cgpa),
        batch: parseInt(form.batch) || new Date().getFullYear(),
        leetcode: parseInt(form.leetcode) || 0,
        readiness: parseInt(form.readiness) || 75,
        aptitude: parseInt(form.aptitude) || 80,
        communication: parseInt(form.communication) || 80,
        projects: parseInt(form.projects) || 75,
        salary: form.salary ? parseFloat(form.salary) * 100000 : 0,
      });
      onCreated();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Add New Student</h3>
            <p className="text-xs text-gray-500">Register a student to the placement database</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>

        {error && <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium">{error}</div>}

        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Full Name *</label>
              <input
                required
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="e.g. Priya Sharma"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Roll Number *</label>
              <input
                required
                value={form.rollNumber}
                onChange={(e) => update("rollNumber", e.target.value)}
                placeholder="e.g. CS009"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Email Address *</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="student@university.edu"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Phone Number</label>
              <input
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="+91 9876543210"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Branch *</label>
              <select
                value={form.branch}
                onChange={(e) => update("branch", e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">CGPA *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                required
                value={form.cgpa}
                onChange={(e) => update("cgpa", e.target.value)}
                placeholder="e.g. 9.2"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Batch</label>
              <input
                type="number"
                value={form.batch}
                onChange={(e) => update("batch", e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">LeetCode Solved</label>
              <input
                type="number"
                value={form.leetcode}
                onChange={(e) => update("leetcode", e.target.value)}
                placeholder="e.g. 240"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Readiness Score (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={form.readiness}
                onChange={(e) => update("readiness", e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Placement Status</label>
              <select
                value={form.status}
                onChange={(e) => update("status", e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="Eligible">Eligible</option>
                <option value="In-Progress">In-Progress</option>
                <option value="Placed">Placed</option>
                <option value="Not Eligible">Not Eligible</option>
              </select>
            </div>
          </div>

          {form.status === "Placed" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <div>
                <label className="text-xs font-semibold text-emerald-900 mb-1 block">Company Placed</label>
                <input
                  value={form.companyPlaced}
                  onChange={(e) => update("companyPlaced", e.target.value)}
                  placeholder="e.g. Google"
                  className="w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-emerald-900 mb-1 block">Package (LPA)</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.salary}
                  onChange={(e) => update("salary", e.target.value)}
                  placeholder="e.g. 24.0"
                  className="w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm outline-none"
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!valid || saving}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-sm"
            >
              {saving && <Loader2 size={16} className="animate-spin" />}
              Save Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function StudentProfileModal({ student, onClose }) {
  if (!student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl space-y-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-bold flex items-center justify-center text-base shadow-sm">
              {initials(student.name)}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg leading-tight">{student.name}</h3>
              <p className="text-xs font-semibold text-indigo-600 mt-0.5">{student.rollNumber} · Batch {student.batch}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">CGPA</span>
            <span className="text-lg font-extrabold text-gray-900 mt-0.5 block">{student.cgpa?.toFixed(2)}</span>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">AI Score</span>
            <span className="text-lg font-extrabold text-indigo-600 mt-0.5 block">{student.score || Math.round(student.cgpa * 10)}</span>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">LeetCode</span>
            <span className="text-lg font-extrabold text-gray-900 mt-0.5 block">{student.leetcode || 0}</span>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">Readiness</span>
            <span className="text-lg font-extrabold text-emerald-600 mt-0.5 block">{student.readiness || 85}%</span>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <GraduationCap size={16} className="text-gray-400 shrink-0" />
            <span className="font-semibold">{student.branch}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Mail size={16} className="text-gray-400 shrink-0" />
            <a href={`mailto:${student.email}`} className="hover:text-indigo-600 underline">{student.email}</a>
          </div>
          {student.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Phone size={16} className="text-gray-400 shrink-0" />
              <span>{student.phone}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Briefcase size={16} className="text-gray-400 shrink-0" />
            <span>Placement Status: </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[student.placementStatus || student.status]}`}>
              {student.placementStatus || student.status}
            </span>
          </div>
          {student.companyPlaced && (
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-emerald-800 font-semibold block">Placed At</span>
                <span className="text-sm font-bold text-emerald-950">{student.companyPlaced}</span>
              </div>
              {student.salary > 0 && (
                <span className="text-xs font-bold text-emerald-700 bg-white px-2.5 py-1 rounded-lg border border-emerald-200">
                  ₹{(student.salary / 100000).toFixed(1)} LPA
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-3 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-sm font-semibold bg-gray-900 text-white hover:bg-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [branches, setBranches] = useState(["All", ...BRANCHES]);
  const [query, setQuery] = useState("");
  const [branchFilter, setBranchFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  async function loadStudents() {
    setLoading(true);
    try {
      const data = await api.get("/students", {
        branch: branchFilter !== "All" ? branchFilter : undefined,
        status: statusFilter !== "All" ? statusFilter : undefined,
        search: query || undefined,
      });
      setStudents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStudents();
  }, [branchFilter, statusFilter, query]);

  const handleExport = () => {
    const headers = [
      ["Roll Number", "Name", "Email", "Branch", "Batch", "CGPA", "LeetCode", "Readiness", "Status", "Company Placed", "Salary (LPA)"],
    ];
    const rows = students.map((s) => [
      s.rollNumber,
      s.name,
      s.email,
      s.branch,
      s.batch,
      s.cgpa,
      s.leetcode || 0,
      s.readiness || 0,
      s.placementStatus || s.status,
      s.companyPlaced || "",
      s.salary ? (s.salary / 100000).toFixed(2) : 0,
    ]);

    const csvContent = [...headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\r\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CampusIQ_Students_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const removeStudent = async (id, e) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this student record?")) return;
    try {
      await api.del(`/students/${id}`);
      loadStudents();
    } catch (err) {
      alert(err.message);
    }
  };

  const totalPages = Math.ceil(students.length / rowsPerPage) || 1;
  const pageItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return students.slice(start, start + rowsPerPage);
  }, [students, page, rowsPerPage]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Students Directory</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {students.length} students enrolled · Real-time scoring and drive eligibility
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
          >
            <Download size={16} />
            Export CSV
          </button>
          <button
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-all shadow-sm"
          >
            <Plus size={16} />
            Add Student
          </button>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex flex-1 flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search by student name or roll number..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm bg-gray-50/70 outline-none focus:border-indigo-400 focus:bg-white transition-all"
            />
          </div>

          <select
            value={branchFilter}
            onChange={(e) => {
              setBranchFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-400"
          >
            {branches.map((b) => (
              <option key={b} value={b}>{b === "All" ? "All Branches" : b}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-gray-100/80 p-1 rounded-xl">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s.value}
              onClick={() => {
                setStatusFilter(s.value);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === s.value
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70 text-gray-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-5 py-3.5">Student</th>
                <th className="px-5 py-3.5">Branch</th>
                <th className="px-5 py-3.5">CGPA</th>
                <th className="px-5 py-3.5">LeetCode</th>
                <th className="px-5 py-3.5">Readiness</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                    <Loader2 className="size-6 animate-spin inline mr-2 text-indigo-600" />
                    Loading student data…
                  </td>
                </tr>
              )}

              {!loading && pageItems.map((s) => (
                <tr
                  key={s._id}
                  onClick={() => setSelectedStudent(s)}
                  className="hover:bg-indigo-50/30 transition-colors cursor-pointer group"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center text-xs shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        {initials(s.name)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{s.name}</div>
                        <div className="text-gray-400 text-xs">{s.rollNumber}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-600 text-xs font-medium">{s.branch}</td>
                  <td className="px-5 py-3.5 font-bold text-gray-900 tabular-nums">{s.cgpa?.toFixed(1)}</td>
                  <td className="px-5 py-3.5 text-gray-700 tabular-nums font-medium">{s.leetcode ?? 0}</td>
                  <td className="px-5 py-3.5"><ReadinessBar value={s.readiness} /></td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[s.placementStatus || s.status]}`}>
                      {STATUS_LABELS[s.placementStatus || s.status] || s.placementStatus || s.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedStudent(s);
                        }}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        title="View profile"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={(e) => removeStudent(s._id, e)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete student"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!loading && pageItems.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                    No students found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50/50">
          <span className="text-xs font-medium text-gray-500">
            Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, students.length)} of {students.length} students
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="inline-flex items-center justify-center size-8 rounded-lg border border-gray-200 bg-white text-gray-700 disabled:opacity-40 hover:bg-gray-100 transition-colors shadow-sm"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-bold text-gray-700 px-2">Page {page} / {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="inline-flex items-center justify-center size-8 rounded-lg border border-gray-200 bg-white text-gray-700 disabled:opacity-40 hover:bg-gray-100 transition-colors shadow-sm"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {showAdd && (
        <AddStudentModal
          onClose={() => setShowAdd(false)}
          onCreated={() => {
            setShowAdd(false);
            loadStudents();
          }}
        />
      )}

      {selectedStudent && (
        <StudentProfileModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  );
}