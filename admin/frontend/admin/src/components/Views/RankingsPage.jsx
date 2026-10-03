import { useEffect, useMemo, useState } from "react";
import {
  Trophy,
  Search,
  ChevronDown,
  ArrowUpDown,
  Medal,
  Info,
  Loader2,
  Award,
  Sparkles,
} from "lucide-react";
import { api } from "../lib/api";

const SORT_OPTIONS = [
  { key: "score", label: "Composite AI Score" },
  { key: "cgpa", label: "CGPA" },
  { key: "aptitude", label: "Aptitude" },
  { key: "communication", label: "Communication" },
  { key: "projects", label: "Projects" },
];

function initials(name = "") {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

function RankBadge({ rank }) {
  if (rank === 1) {
    return (
      <div className="flex items-center justify-center size-8 rounded-xl bg-amber-100 text-amber-700 font-extrabold text-xs shadow-sm">
        🥇 1
      </div>
    );
  }
  if (rank === 2) {
    return (
      <div className="flex items-center justify-center size-8 rounded-xl bg-slate-100 text-slate-700 font-extrabold text-xs shadow-sm">
        🥈 2
      </div>
    );
  }
  if (rank === 3) {
    return (
      <div className="flex items-center justify-center size-8 rounded-xl bg-amber-50 text-amber-800 font-extrabold text-xs shadow-sm">
        🥉 3
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center size-8 rounded-xl bg-gray-50 text-gray-500 font-bold text-xs">
      #{rank}
    </div>
  );
}

function ScoreBar({ value = 0, max = 100, color = "#4F46E5" }) {
  return (
    <div className="flex items-center gap-2 w-24">
      <div className="h-1.5 flex-1 rounded-full bg-gray-100 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${(value / max) * 100}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-semibold tabular-nums text-gray-600 w-6">{value}</span>
    </div>
  );
}

export function RankingsPage() {
  const [allStudents, setAllStudents] = useState([]);
  const [weights, setWeights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [query, setQuery] = useState("");
  const [branchFilter, setBranchFilter] = useState("All");
  const [sortKey, setSortKey] = useState("score");
  const [sortOpen, setSortOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await api.get("/rankings", { sort: sortKey });
      setAllStudents(data.students);
      setWeights(data.weights);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [sortKey]);

  const branches = useMemo(
    () => ["All", ...Array.from(new Set(allStudents.map((s) => s.branch)))],
    [allStudents]
  );

  const ranked = useMemo(() => {
    return allStudents
      .filter((s) => branchFilter === "All" || s.branch === branchFilter)
      .filter(
        (s) =>
          s.name?.toLowerCase().includes(query.toLowerCase()) ||
          s.id?.toLowerCase().includes(query.toLowerCase())
      );
  }, [allStudents, query, branchFilter]);

  const top3 = ranked.slice(0, 3);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Trophy size={24} className="text-amber-500" />
            AI Student Leaderboard
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Multi-dimensional placement readiness index evaluated across academics, aptitude, and project mastery
          </p>
        </div>
        <div className="relative">
          <button
            onClick={() => setInfoOpen((v) => !v)}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-sm transition-all"
          >
            <Sparkles size={14} className="text-indigo-600" />
            Scoring Model
          </button>
          {infoOpen && weights && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-gray-100 bg-white shadow-2xl p-4 z-20 text-xs animate-in fade-in slide-in-from-top-2 duration-200">
              <p className="font-bold text-gray-900 mb-2.5">Composite Score Weights</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                  <span className="font-semibold text-gray-600">Academic CGPA</span>
                  <span className="font-bold text-indigo-600">{Math.round(weights.cgpa * 100)}%</span>
                </div>
                <div className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                  <span className="font-semibold text-gray-600">Aptitude & Reasoning</span>
                  <span className="font-bold text-indigo-600">{Math.round(weights.aptitude * 100)}%</span>
                </div>
                <div className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                  <span className="font-semibold text-gray-600">Communication & Soft Skills</span>
                  <span className="font-bold text-indigo-600">{Math.round(weights.communication * 100)}%</span>
                </div>
                <div className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                  <span className="font-semibold text-gray-600">Project Portfolio</span>
                  <span className="font-bold text-indigo-600">{Math.round(weights.projects * 100)}%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {error && <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm font-medium">{error}</div>}

      {loading ? (
        <div className="flex items-center gap-2 text-gray-400 py-16 justify-center">
          <Loader2 className="size-6 animate-spin text-indigo-600" />
          <span className="text-sm font-medium">Computing AI candidate rankings…</span>
        </div>
      ) : (
        <>
          {/* Podium Top 3 */}
          {top3.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {top3.map((s, i) => (
                <div
                  key={s._id}
                  className={`rounded-2xl border bg-white p-5 flex items-center gap-4 transition-all hover:shadow-md ${
                    i === 0
                      ? "sm:order-2 border-amber-200 bg-gradient-to-br from-amber-50/50 via-white to-white ring-2 ring-amber-300/40"
                      : i === 1
                      ? "sm:order-1 border-gray-100"
                      : "sm:order-3 border-gray-100"
                  }`}
                >
                  <div
                    className={`flex items-center justify-center size-12 rounded-2xl font-bold text-sm shrink-0 shadow-sm ${
                      i === 0
                        ? "bg-amber-400 text-amber-950"
                        : i === 1
                        ? "bg-slate-200 text-slate-800"
                        : "bg-amber-100 text-amber-900"
                    }`}
                  >
                    {initials(s.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="font-bold text-gray-900 truncate">{s.name}</p>
                      {i === 0 && <Award size={14} className="text-amber-500 shrink-0" />}
                    </div>
                    <p className="text-gray-500 text-xs truncate">{s.branch}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-indigo-600 text-xl font-extrabold tabular-nums">{s.score}</p>
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wide">Rank #{i + 1}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Filter Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 bg-white p-3.5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search leaderboard by student or ID..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm bg-gray-50/70 outline-none focus:border-indigo-400 focus:bg-white transition-all"
              />
            </div>

            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-400"
            >
              {branches.map((b) => (
                <option key={b} value={b}>{b === "All" ? "All Branches" : b}</option>
              ))}
            </select>

            <div className="relative">
              <button
                onClick={() => setSortOpen((v) => !v)}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <ArrowUpDown size={14} className="text-indigo-600" />
                Sort: {SORT_OPTIONS.find((o) => o.key === sortKey)?.label}
                <ChevronDown size={14} className="text-gray-400" />
              </button>
              {sortOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-gray-100 bg-white shadow-xl py-1.5 z-20 animate-in fade-in duration-150">
                  {SORT_OPTIONS.map((o) => (
                    <button
                      key={o.key}
                      onClick={() => {
                        setSortKey(o.key);
                        setSortOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs font-semibold hover:bg-gray-50 transition-colors ${
                        o.key === sortKey ? "text-indigo-600 bg-indigo-50/50" : "text-gray-700"
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/70 text-gray-500 text-xs font-bold uppercase tracking-wider">
                    <th className="w-16 px-5 py-3.5">Rank</th>
                    <th className="px-5 py-3.5">Student</th>
                    <th className="px-5 py-3.5">CGPA</th>
                    <th className="px-5 py-3.5">Aptitude</th>
                    <th className="px-5 py-3.5">Communication</th>
                    <th className="px-5 py-3.5">Projects</th>
                    <th className="px-5 py-3.5 text-right">AI Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {ranked.map((s, i) => (
                    <tr key={s._id} className="hover:bg-indigo-50/30 transition-colors">
                      <td className="px-5 py-3.5"><RankBadge rank={i + 1} /></td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center text-xs shrink-0">
                            {initials(s.name)}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{s.name}</div>
                            <div className="text-gray-400 text-xs">{s.branch} · {s.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-bold text-gray-900 tabular-nums">{s.cgpa?.toFixed(1)}</td>
                      <td className="px-5 py-3.5"><ScoreBar value={s.aptitude} color="#4F46E5" /></td>
                      <td className="px-5 py-3.5"><ScoreBar value={s.communication} color="#10B981" /></td>
                      <td className="px-5 py-3.5"><ScoreBar value={s.projects} color="#F59E0B" /></td>
                      <td className="px-5 py-3.5 text-right">
                        <span className="inline-flex items-center rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1 text-xs font-extrabold tabular-nums">
                          {s.score}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {ranked.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                        No students match these filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}