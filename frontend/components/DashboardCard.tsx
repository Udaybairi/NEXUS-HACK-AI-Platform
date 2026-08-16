import { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

interface DashboardCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: ReactNode;
  badge?: string;
  badgeColor?: string;
}

export default function DashboardCard({ title, value, subtitle, icon, badge, badgeColor }: DashboardCardProps) {
  return (
    <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4 hover:border-indigo-500/30 transition-all">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">{title}</span>
        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-indigo-400">
          {icon}
        </div>
      </div>

      <div>
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-white">{value}</span>
          {badge && (
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${badgeColor || "bg-indigo-500/20 text-indigo-300"}`}>
              {badge}
            </span>
          )}
        </div>
        {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}
