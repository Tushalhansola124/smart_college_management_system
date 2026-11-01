// app/dashboard/department/restore/page.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Alert Dialog Components
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { ArrowLeft, ArchiveX, RotateCcw, Loader2 } from "lucide-react";

import {
  GetDeletedDepartments,
  RestoreDepartment,
  type IDepartment,
} from "@/components/department/department.controller";

import { DepartmentTableSkeleton } from "@/components/department/DepartmentSkeleton";

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

export default function RestoreDepartmentsPage() {
  const router = useRouter();

  const [deleted, setDeleted] = useState<IDepartment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // --- DIALOG STATE ---
  // આ state માં જે ડિપાર્ટમેન્ટ સિલેક્ટ થશે એનો ડેટા આવશે, અને ડાયલોગ ઓપન થશે.
  const [selectedDept, setSelectedDept] = useState<IDepartment | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);

  const fetchDeleted = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await GetDeletedDepartments(0, 20);
      setDeleted(res.data.content);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load deleted departments."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeleted();
  }, [fetchDeleted]);

  // --- ACTUAL RESTORE FUNCTION (Calls API) ---
  const executeRestore = async () => {
    if (!selectedDept) return;
    
    setIsRestoring(true);
    try {
      const res = await RestoreDepartment(selectedDept.id);
      if (res.success) {
        toast.success(res.message || "Department restored successfully.");
        fetchDeleted(); // લિસ્ટ રિફ્રેશ કરવા
      } else {
        toast.error(res.message || "Failed to restore department.");
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to restore department."
      );
    } finally {
      setIsRestoring(false);
      setSelectedDept(null); // કામ પૂરું થયા પછી ડાયલોગ બંધ કરવા
    }
  };

  return (
    <div className="w-full space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Breadcrumbs */}
    

      {/* Header Block */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
             <RotateCcw className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Restore Departments
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Review and recover departments that have been soft-deleted.
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          className="gap-2 bg-white"
          onClick={() => router.push("/department")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Departments
        </Button>
      </div>

      {/* Content Area */}
      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center shadow-sm">
          <p className="text-sm font-medium text-rose-700">{error}</p>
          <Button variant="outline" className="mt-4 bg-white" onClick={fetchDeleted}>
            Try Again
          </Button>
        </div>
      ) : isLoading ? (
        <DepartmentTableSkeleton rows={4} />
      ) : deleted.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-20 text-center">
          <div className="rounded-full bg-slate-100 p-4 text-slate-400">
            <ArchiveX className="h-8 w-8" />
          </div>
          <div>
            <p className="text-base font-semibold text-slate-900">No deleted departments</p>
            <p className="mt-1 text-sm text-slate-500">When departments are deleted, they will appear here for recovery.</p>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-16 text-center font-semibold">#</TableHead>
                <TableHead className="font-semibold text-slate-700">Department</TableHead>
                <TableHead className="font-semibold text-slate-700">Code</TableHead>
                <TableHead className="font-semibold text-slate-700">HOD</TableHead>
                <TableHead className="font-semibold text-slate-700">Deleted On</TableHead>
                <TableHead className="text-right font-semibold text-slate-700">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {deleted.map((dept, index) => (
                <TableRow key={dept.id} className="transition-colors hover:bg-slate-50/50">
                  <TableCell className="text-center font-medium text-slate-500">
                    {index + 1}
                  </TableCell>
                  
                  <TableCell className="font-medium text-slate-900">
                    {dept.name}
                  </TableCell>

                  <TableCell>
                    <Badge variant="secondary" className="font-mono text-xs text-slate-600">
                      {dept.code}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-slate-600">
                    {dept.hodName ?? (
                      <span className="text-slate-400 italic">Not Assigned</span>
                    )}
                  </TableCell>

                  <TableCell className="text-slate-600">
                    {formatDate(dept.updatedAt)}
                  </TableCell>

                  <TableCell className="text-right">
                    
                    {/* આ બટન માત્ર State સેટ કરશે, ડાયરેક્ટ API કોલ નહીં કરે! */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedDept(dept)} 
                      className="gap-2 border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 transition-colors"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Restore
                    </Button>

                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* --- RESTORE CONFIRMATION DIALOG --- */}
      {/* 
        અહીં open state ને selectedDept વડે કંટ્રોલ કર્યું છે. 
        એટલે જ્યાર પણ selectedDept માં ડેટા આવશે ત્યારે જ ડાયલોગ ઓપન થશે.
      */}
     {/* --- RESTORE CONFIRMATION DIALOG --- */}
   {/* --- RESTORE CONFIRMATION DIALOG --- */}
<AlertDialog
  open={selectedDept !== null}
  onOpenChange={(isOpen) => {
    if (!isOpen && !isRestoring) setSelectedDept(null);
  }}
>
  <AlertDialogContent className="w-[calc(100%-2rem)] max-w-[360px] overflow-hidden rounded-2xl border-0 bg-white p-0 shadow-xl">
    
    {/* Header */}
    <div className="flex flex-col items-center px-6 pt-8 pb-4 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
        <RotateCcw className="h-5 w-5 text-emerald-500" strokeWidth={2.2} />
      </div>

      <AlertDialogTitle className="text-lg font-bold tracking-tight text-slate-900">
        Restore Department
      </AlertDialogTitle>

      <p className="mt-1.5 text-sm text-slate-500">
        Bring this department back to your system
      </p>
    </div>

    {/* Description */}
    <div className="px-6 pb-6">
      <AlertDialogDescription className="text-center text-[14.5px] leading-relaxed text-slate-600">
        Are you sure you want to restore{" "}
        <span className="font-semibold text-slate-800">
          {selectedDept?.name}
        </span>
        ? This department will become active and visible across the system again.
      </AlertDialogDescription>
    </div>

    {/* Perfect Footer Buttons */}
    <div className="flex items-center gap-3 border-t border-slate-100 bg-slate-50/40 px-5 py-4">
      <AlertDialogCancel
        disabled={isRestoring}
        className="mt-0 h-10 flex-1 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900"
      >
        Cancel
      </AlertDialogCancel>

      <Button
        onClick={executeRestore}
        disabled={isRestoring}
        className="h-10 flex-1 gap-2 rounded-xl bg-emerald-600 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 active:scale-[0.98]"
      >
        {isRestoring ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Restoring...
          </>
        ) : (
          <>
            <RotateCcw className="h-4 w-4" strokeWidth={2.2} />
            Yes, Restore
          </>
        )}
      </Button>
    </div>
  </AlertDialogContent>
</AlertDialog>
      
    </div>
  );
}