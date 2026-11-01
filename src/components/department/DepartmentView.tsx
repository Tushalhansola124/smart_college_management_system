// components/department/DepartmentView.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, CheckCircle2, XCircle, Building2, User, FileText } from "lucide-react";
import type { IDepartment } from "@/components/department/department.controller";

interface DepartmentViewProps {
  department: IDepartment;
}

function formatDateTime(dateString: string) {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Upgraded Field component with optional icon and cleaner layout
function Field({ 
  label, 
  value, 
  icon: Icon 
}: { 
  label: string; 
  value: React.ReactNode; 
  icon?: React.ElementType 
}) {
  return (
    <div className="flex flex-col space-y-1.5 rounded-lg border border-slate-100 bg-slate-50 p-4 transition-colors hover:bg-slate-100/50">
      <div className="flex items-center gap-2 text-muted-foreground">
        {Icon && <Icon className="h-4 w-4" />}
        <p className="text-xs font-semibold uppercase tracking-wider">
          {label}
        </p>
      </div>
      <p className="text-sm font-medium leading-relaxed text-slate-900">{value}</p>
    </div>
  );
}

export function DepartmentView({ department }: DepartmentViewProps) {
  const isActive = department.status === "ACTIVE";

  return (
    <Card className="mx-auto w-full max-w-9xl overflow-hidden rounded-2xl border-slate-200 shadow-md">
      {/* Header section with distinct styling */}
      <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              {department.name}
            </h2>
            <p className="flex items-center gap-2 text-sm text-slate-500">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-400">Code:</span>
              <Badge variant="secondary" className="rounded-md font-mono">
                {department.code}
              </Badge>
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className={`flex items-center gap-1.5 px-3 py-1 text-sm font-medium ${
                isActive
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-rose-200 bg-rose-50 text-rose-700"
              }`}
            >
              {isActive ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              {isActive ? "Active Department" : "Inactive Department"}
            </Badge>
          </div>
        </div>
      </div>

      <CardContent className="p-6 sm:p-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Main Info Section */}
          <div className="sm:col-span-2 lg:col-span-3">
            <h3 className="mb-4 text-sm font-semibold text-slate-900">Core Information</h3>
          </div>
          <Field 
            label="Department Name" 
            value={department.name} 
            icon={Building2} 
          />
          <Field 
            label="Department Code" 
            value={department.code} 
            icon={Building2} 
          />
          <Field
            label="Head of Department (HOD)"
            value={department.hodName ?? "Not Assigned"}
            icon={User}
          />

          <div className="col-span-1 mt-4 sm:col-span-2 lg:col-span-3">
            <Separator className="mb-6" />
            <h3 className="mb-4 text-sm font-semibold text-slate-900">Additional Details</h3>
          </div>

          <div className="col-span-1 space-y-1.5 rounded-lg border border-slate-100 bg-slate-50 p-4 sm:col-span-2 lg:col-span-3">
             <div className="flex items-center gap-2 text-muted-foreground">
                <FileText className="h-4 w-4" />
                <p className="text-xs font-semibold uppercase tracking-wider">Description</p>
             </div>
            <p className="text-sm leading-relaxed text-slate-700">
              {department.description || "No description provided for this department."}
            </p>
          </div>

          <Field
            label="Created At"
            value={formatDateTime(department.createdAt)}
            icon={Clock}
          />
          <Field
            label="Last Updated"
            value={formatDateTime(department.updatedAt)}
            icon={Clock}
          />
        </div>
      </CardContent>
    </Card>
  );
}