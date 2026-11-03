import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { ISemester } from "@/components/semester/semester.controller";

interface SemesterViewProps {
  semester: ISemester;
  courseName: string;
  academicYearName: string;
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

function formatDate(dateString: string) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="text-sm font-medium text-slate-900">{value}</p>
    </div>
  );
}

export function SemesterView({
  semester,
  courseName,
  academicYearName,
}: SemesterViewProps) {
  return (
    <Card className="rounded-2xl border border-slate-200/80 shadow-sm">
      <CardContent className="p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              {semester.name}
            </h2>
            <p className="text-sm text-muted-foreground">
              Semester {semester.semesterNumber}
            </p>
          </div>
          <Badge
            variant="outline"
            className={
              semester.status === "ACTIVE"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-slate-200 bg-slate-100 text-slate-600"
            }
          >
            {semester.status === "ACTIVE" ? "Active" : "Inactive"}
          </Badge>
        </div>

        <Separator className="mb-6" />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Field label="Semester Name" value={semester.name} />
          <Field label="Semester Number" value={semester.semesterNumber} />
          <Field label="Course" value={courseName || "-"} />
          <Field label="Academic Year" value={academicYearName || "-"} />
          <Field label="Start Date" value={formatDate(semester.startDate)} />
          <Field label="End Date" value={formatDate(semester.endDate)} />
          <Field
            label="Status"
            value={semester.status === "ACTIVE" ? "Active" : "Inactive"}
          />
          <Field
            label="Created At"
            value={formatDateTime(semester.createdAt)}
          />
          <Field
            label="Updated At"
            value={formatDateTime(semester.updatedAt)}
          />
        </div>
      </CardContent>
    </Card>
  );
}