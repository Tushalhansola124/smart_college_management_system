import { Card, CardContent } from "@/components/ui/card";
import { Building2, CheckCircle2, XCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface DepartmentStatsProps {
  total: number;
  active: number;
  inactive: number;
}

interface StatConfig {
  label: string;
  value: number;
  icon: LucideIcon;
  iconClass: string;
}

export function DepartmentStats({
  total,
  active,
  inactive,
}: DepartmentStatsProps) {
  const stats: StatConfig[] = [
    {
      label: "Total Departments",
      value: total,
      icon: Building2,
      iconClass: "bg-teal-50 text-[#0D9488] ring-teal-100",
    },
    {
      label: "Active Departments",
      value: active,
      icon: CheckCircle2,
      iconClass: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    },
    {
      label: "Inactive Departments",
      value: inactive,
      icon: XCircle,
      iconClass: "bg-rose-50 text-rose-600 ring-rose-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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