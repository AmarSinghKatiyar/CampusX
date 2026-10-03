import { COLORS } from "../../constants/colors";
import authService from "../../services/authService";
import { Sparkles } from "lucide-react";

export function WelcomeBanner({ data }) {
  const admin = authService.getAdmin();
  const firstName = admin?.name?.split(" ")[0] || "Admin";

  const today = new Date();
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  const formattedDate = today.toLocaleDateString("en-US", options);

  const activeDrives = data?.activePlacementDrives ?? 4;
  const placementRate = data?.placementRate ?? "62.5";
  const totalStudents = data?.totalStudents ?? 8;

  return (
    <div
      className="rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-lg"
      style={{ background: `linear-gradient(135deg, #1E1B4B 0%, #312E81 40%, #4F46E5 75%, #7C3AED 100%)` }}
    >
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 bg-white -translate-y-24 translate-x-24 blur-2xl" />
      <div className="absolute bottom-0 right-36 w-32 h-32 rounded-full opacity-10 bg-emerald-400 translate-y-12 blur-xl" />
      
      <div className="relative z-10 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold backdrop-blur-md mb-3 border border-white/10">
          <Sparkles size={12} className="text-amber-300" />
          <span>{formattedDate}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight">
          Welcome back, {firstName} 👋
        </h1>
        <p className="text-indigo-100 text-sm leading-relaxed">
          {activeDrives} active placement drives running · {placementRate}% cohort placement rate across {totalStudents} enrolled candidates.
        </p>
      </div>
    </div>
  );
}