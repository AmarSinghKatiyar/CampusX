import { useEffect, useState } from "react";
import {
  TrendingUp,
  Download,
  Building2,
  Award,
  Users,
  GraduationCap,
  Loader2,
  Calendar,
} from "lucide-react";
import { api } from "../lib/api";

function StatCard({ label, value, suffix = "", icon: Icon, color = "#4F46E5" }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</span>
        {Icon && (
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}15`, color }}>
            <Icon size={16} />
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-extrabold text-gray-900 tabular-nums">{value ?? 0}</span>
        {suffix && <span className="text-sm font-bold text-gray-500">{suffix}</span>}
      </div>
    </div>
  );
}

function BranchBarChart({ data }) {
  if (!data || data.length === 0) {
    return <p className="text-sm text-gray-400 py-8 text-center">No student branch data available.</p>;
  }
  const max = Math.max(1, ...data.map((b) => b.total));
  return (
    <div className="space-y-4">
      {data.map((b) => {
        const pct = b.total ? Math.round((b.placed / b.total) * 100) : 0;
        const widthPct = Math.max(10, (b.total / max) * 100);
        return (
          <div key={b.branch} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
              <span>{b.branch}</span>
              <span className="text-indigo-600 font-bold">{b.placed} placed / {b.total} students ({pct}%)</span>
            </div>
            <div className="h-3 rounded-full bg-gray-100 overflow-hidden" style={{ width: `${widthPct}%` }}>
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TrendChart({ data }) {
  if (!data || data.length === 0) {
    return <p className="text-sm text-gray-400 py-8 text-center">No trend data available.</p>;
  }

  const max = Math.max(2, ...data.map((t) => t.value));
  const w = 560;
  const h = 160;
  const padX = 16;
  const step = (w - padX * 2) / (data.length - 1 || 1);

  const points = data.map((t, i) => {
    const x = padX + i * step;
    const y = h - (t.value / max) * (h - 32) - 10;
    return [x, y];
  });

  const linePath = points.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(" ");
  const areaPath = `${linePath} L${points[points.length - 1][0]},${h} L${points[0][0]},${h} Z`;

  return (
    <div className="space-y-2">
      <svg viewBox={`0 0 ${w} ${h + 24}`} className="w-full h-auto" preserveAspectRatio="none">
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#trendFill)" />
        <path d={linePath} fill="none" stroke="#4F46E5" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
        {points.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r="4" fill="#4F46E5" stroke="#FFFFFF" strokeWidth="2" />
        ))}
        {data.map((t, i) => (
          <text key={t.month} x={points[i][0]} y={h + 18} textAnchor="middle" fontSize="11" fill="#6B7280" fontWeight="600">
            {t.month}
          </text>
        ))}
      </svg>
    </div>
  );
}

export function ReportsPage() {
  const [stats, setStats] = useState(null);
  const [branchData, setBranchData] = useState([]);
  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const [statsRes, branchRes, trendRes] = await Promise.all([
          api.get("/reports/stats"),
          api.get("/reports/branch-placements"),
          api.get("/reports/trend"),
        ]);
        setStats(statsRes);
        setBranchData(branchRes);
        setTrend(trendRes);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleExportReport = () => {
    const lines = [
      "=== Campus IQ Placement & Performance Report ===",
      `Generated At: ${new Date().toLocaleString()}`,
      "",
      `Total Placements Completed: ${stats?.totalPlacements ?? 0}`,
      `Average CTC Package: ${stats?.avgPackageLPA ?? 0} LPA`,
      `Eligible Candidate Pool: ${stats?.eligiblePool ?? 0}`,
      `Visiting Companies: ${stats?.companiesVisited ?? 0}`,
      "",
      "--- Branch Breakdown ---",
      "Branch,Total Students,Placed Students,Placement Rate",
      ...branchData.map(b => `${b.branch},${b.total},${b.placed},${b.total ? Math.round((b.placed/b.total)*100) : 0}%`),
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CampusIQ_Placement_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Reports & Analytics</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Institutional placement intelligence, cohort statistics, and hiring trajectories
          </p>
        </div>
        <button
          onClick={handleExportReport}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm self-start sm:self-auto"
        >
          <Download size={16} />
          Export Report
        </button>
      </div>

      {error && <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm font-medium">{error}</div>}

      {loading ? (
        <div className="flex items-center gap-2 text-gray-400 py-16 justify-center">
          <Loader2 className="size-6 animate-spin text-indigo-600" />
          <span className="text-sm font-medium">Synthesizing institutional report…</span>
        </div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Placements" value={stats?.totalPlacements} icon={Award} color="#10B981" />
            <StatCard label="Avg. Package" value={stats?.avgPackageLPA} suffix=" LPA" icon={TrendingUp} color="#4F46E5" />
            <StatCard label="Eligible Pool" value={stats?.eligiblePool} icon={Users} color="#7C3AED" />
            <StatCard label="Visiting Companies" value={stats?.companiesVisited} icon={Building2} color="#F59E0B" />
          </div>

          {/* Visualizations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Placements by Branch</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Departmental placement conversion distribution</p>
                </div>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">Active Year</span>
              </div>
              <BranchBarChart data={branchData} />
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Monthly Placement Trend</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Hiring velocity across recruitment calendar</p>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">Cumulative</span>
              </div>
              <TrendChart data={trend} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}