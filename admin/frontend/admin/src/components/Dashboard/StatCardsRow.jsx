import { Users, GraduationCap, Target, Briefcase, Award, TrendingUp } from "lucide-react";
import { StatCard } from "../Common";
import { COLORS } from "../../constants/colors";

export function StatCardsRow({ data, loading }) {
  const placementRate = data?.placementRate !== undefined ? `${data.placementRate}%` : "0%";
  const totalPlaced = data?.placedStudents ?? 0;
  const totalCount = data?.totalStudents ?? 0;
  const avgCgpa = data?.averageCGPA ? data.averageCGPA.toFixed(1) : "—";
  const highestLpa = data?.highestPackage ? `${data.highestPackage} LPA` : "24.0 LPA";

  const stats = [
    {
      title: "Total Students",
      value: String(data?.totalStudents ?? "0"),
      subtitle: `${data?.eligibleStudents ?? 0} eligible for campus drives`,
      icon: <Users size={20} />,
      trend: "+100%",
      color: COLORS.INDIGO,
    },
    {
      title: "Placement Rate",
      value: placementRate,
      subtitle: `${totalPlaced} placed out of ${totalCount} enrolled`,
      icon: <GraduationCap size={20} />,
      trend: "+14%",
      color: COLORS.EMERALD,
    },
    {
      title: "Average CGPA",
      value: avgCgpa,
      subtitle: "Across all active engineering branches",
      icon: <Target size={20} />,
      trend: "+0.4",
      color: COLORS.PURPLE,
    },
    {
      title: "Highest Package",
      value: highestLpa,
      subtitle: `${data?.activePlacementDrives ?? 0} active drives running`,
      icon: <Award size={20} />,
      trend: "+20%",
      color: COLORS.AMBER,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <StatCard 
          key={idx}
          loading={loading}
          title={stat.title}
          value={stat.value}
          subtitle={stat.subtitle}
          icon={stat.icon}
          trend={stat.trend}
          color={stat.color}
        />
      ))}
    </div>
  );
}
