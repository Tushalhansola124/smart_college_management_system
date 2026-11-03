import { Card, CardContent } from "@/components/ui/card";
import { Users, CheckCircle2, XCircle, Archive } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface FacultyStatsProps {
  total: number;
  active: number;
  inactive: number;
  deleted?: number;
}

interface StatConfig {
  label: string;
  value: number;
  icon: LucideIcon;
  iconClass: string;
}

export function FacultyStats({ total, active, inactive, deleted }: FacultyStatsProps) {
  const stats: StatConfig[] = [
    {
      label: "Total Faculty",
      value: total,
      icon: Users,
      iconClass: "bg-teal-50 text-[#0D9488] ring-teal-100",
    },
    {
      label: "Active Faculty",
      value: active,
      icon: CheckCircle2,
      iconClass: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    },
    {
      label: "Inactive Faculty",
      value: inactive,
      icon: XCircle,
      iconClass: "bg-rose-50 text-rose-600 ring-rose-100",
    },
  ];

  if (typeof deleted === "number") {
    stats.push({
      label: "Deleted Faculty",
      value: deleted,
      icon: Archive,
      iconClass: "bg-amber-50 text-amber-600 ring-amber-100",
    });
  }

  const gridColsClass =
    stats.length === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-3";

  return (
    <div className={`grid grid-cols-1 gap-4 ${gridColsClass}`}>
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className="group rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
        >
          <CardContent className="flex items-center justify-between p-6">
            <div className="space-y-1.5">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {stat.label}
              </p>
              <p className="text-3xl font-bold tabular-nums text-slate-900">
                {stat.value}
              </p>
            </div>
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset transition-transform duration-200 group-hover:scale-105 ${stat.iconClass}`}
            >
              <stat.icon className="h-5 w-5" strokeWidth={2.25} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}