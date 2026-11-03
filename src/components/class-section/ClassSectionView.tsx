import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { IClassSection } from "@/components/class-section/class-section.controller";

interface ClassSectionViewProps {
  classSection: IClassSection;
}

function formatDateTime(dateString: string) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-slate-900">{value}</p>
    </div>
  );
}

export function ClassSectionView({ classSection }: ClassSectionViewProps) {
  return (
    <div className="space-y-6">
      <Card className="rounded-2xl border border-slate-200/80 shadow-sm">
        <CardContent className="p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Basic Information</h2>
            <Badge
              variant="outline"
              className={
                classSection.status === "ACTIVE"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-slate-200 bg-slate-100 text-slate-600"
              }
            >
              {classSection.status === "ACTIVE" ? "Active" : "Inactive"}
            </Badge>
          </div>
          <Separator className="mb-6" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <Field label="Class / Section Name" value={classSection.name} />
            <Field label="Created Date" value={formatDateTime(classSection.createdAt)} />
            <Field label="Updated Date" value={formatDateTime(classSection.updatedAt)} />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-slate-200/80 shadow-sm">
        <CardContent className="p-8">
          <h2 className="mb-6 text-lg font-semibold text-slate-900">Academic Information</h2>
          <Separator className="mb-6" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Field label="Department" value={classSection.department?.name ?? "-"} />
            <Field label="Course" value={classSection.course?.name ?? "-"} />
            <Field label="Semester" value={classSection.semester?.name ?? "-"} />
            <Field label="Academic Year" value={classSection.academicYear?.name ?? "-"} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}