import { useState, useEffect } from "react";
import { Menu, Search, Bell, Database, CheckCircle2, ShieldCheck, ChevronDown } from "lucide-react";
import { COLORS } from "../../constants/colors";
import { notificationsList } from "../../data/mockData";
import authService from "../../services/authService";
import { API_BASE_URL } from "../lib/api";

export function Header({ onToggle, onSearchChange }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [dbHealthy, setDbHealthy] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const admin = authService.getAdmin();
  const displayName = admin?.name || "Admin";
  const initials = displayName
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  useEffect(() => {
    // Check live health status
    fetch(`${API_BASE_URL.replace('/api', '')}/health/database`)
      .then(res => res.json())
      .then(data => setDbHealthy(data?.success === true))
      .catch(() => setDbHealthy(false));
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    if (onSearchChange) onSearchChange(e.target.value);
  };

  return (
    <header className="h-16 bg-white/90 backdrop-blur-md border-b border-gray-100 flex items-center px-4 sm:px-6 gap-3 flex-shrink-0 relative z-20 sticky top-0">
      <button
        onClick={onToggle}
        className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500 flex-shrink-0"
        title="Toggle sidebar"
      >
        <Menu size={18} />
      </button>

      {/* Global Search */}
      <div className="relative flex-1 max-w-sm hidden sm:block">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search students, drives, branches..."
          className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm bg-gray-50/80 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all"
        />
      </div>

      <div className="ml-auto flex items-center gap-3">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(v => !v)}
            className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors text-gray-500"
            title="Notifications"
          >
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white" />
          </button>
          {notifOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setNotifOpen(false)} />
              <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-40 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3.5 border-b border-gray-100 flex items-center justify-between">
                  <h4 className="font-bold text-gray-800 text-sm">Notifications</h4>
                  <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">3 new</span>
                </div>
                {notificationsList.map((n, i) => (
                  <div
                    key={i}
                    className="px-4 py-3.5 hover:bg-gray-50 flex gap-3 items-start cursor-pointer transition-colors border-b border-gray-50 last:border-0"
                  >
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: COLORS.INDIGO }} />
                    <div>
                      <p className="text-sm text-gray-700 leading-snug">{n.text}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Admin Profile Chip */}
        <div className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl bg-gray-50/80 border border-gray-100">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm"
            style={{ backgroundColor: COLORS.INDIGO }}
          >
            {initials}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-gray-900 leading-tight">{displayName}</p>
            <p className="text-[10px] font-semibold text-indigo-600 tracking-wide">ADMINISTRATOR</p>
          </div>
        </div>
      </div>
    </header>
  );
}