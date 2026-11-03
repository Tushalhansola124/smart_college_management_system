import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { IFaculty } from "@/components/faculty/faculty.controller";

interface FacultyViewProps {
  faculty: IFaculty;
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
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-slate-900">{value}</p>
    </div>
  );
}

export function FacultyView({ faculty }: FacultyViewProps) {
  return (
    <Card className="rounded-2xl border border-slate-200/80 shadow-sm">
      <CardContent className="p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">{faculty.fullName}</h2>
            <p className="text-sm text-muted-foreground">{faculty.employeeCode}</p>
          </div>
          <Badge
            variant="outline"
            className={
              faculty.employmentStatus === "ACTIVE"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-slate-200 bg-slate-100 text-slate-600"
            }
          >
            {faculty.employmentStatus === "ACTIVE" ? "Active" : "Inactive"}
          </Badge>
        </div>

        <Separator className="mb-6" />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Field label="Full Name" value={faculty.fullName} />
          <Field label="Email" value={faculty.email} />
          <Field label="Employee Code" value={faculty.employeeCode} />
          <Field label="Department" value={faculty.departmentName} />
          <Field label="Designation" value={faculty.designation} />
          <Field label="Phone" value={faculty.phone} />
          <Field label="Qualification" value={faculty.qualification} />
          <Field label="Joining Date" value={formatDate(faculty.joiningDate)} />
          <Field
            label="Employment Status"
            value={faculty.employmentStatus === "ACTIVE" ? "Active" : "Inactive"}
          />
          <Field label="Created At" value={formatDateTime(faculty.createdAt)} />
          <Field label="Updated At" value={formatDateTime(faculty.updatedAt)} />
        </div>
      </CardContent>
    </Card>
  );
}