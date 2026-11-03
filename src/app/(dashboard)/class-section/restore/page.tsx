"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ArchiveX, ArrowLeft, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import {
  GetDeletedClassSections,
  RestoreClassSection,
  type IClassSection,
} from "@/components/class-section/class-section.controller";
import { ClassSectionTableSkeleton } from "@/components/class-section/ClassSectionSkeleton";

interface ClassSectionResponse {
  success: boolean;
  message: string;
}

function formatDate(dateString: string | null) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function RestoreClassSectionPage() {
  const router = useRouter();
  const [deleted, setDeleted] = useState<IClassSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [restoreTarget, setRestoreTarget] = useState<IClassSection | null>(null);
  const [isRestoreOpen, setIsRestoreOpen] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const fetchDeleted = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await GetDeletedClassSections(0, 20);
      setDeleted(res.data.content);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load deleted class sections.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    (async () => {
      if (ignore) return;
      await fetchDeleted();
    })();
    return () => {
      ignore = true;
    };
  }, [fetchDeleted]);

  const handleRestoreClick = (cs: IClassSection) => {
    setRestoreTarget(cs);
    setIsRestoreOpen(true);
  };

  const handleConfirmRestore = async () => {
    if (!restoreTarget) return;

    setIsRestoring(true);
    try {
      const res = (await RestoreClassSection(restoreTarget.id)) as unknown as ClassSectionResponse;

      if (res.success) {
        toast.success(res.message);
        setIsRestoreOpen(false);
        fetchDeleted();
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to restore class section.");
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-9xl space-y-6 px-4 py-6 sm:px-6 lg:px-10 xl:px-12">
      

      <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-[#0D9488] ring-1 ring-inset ring-teal-100">
            <ArchiveX className="h-5 w-5" strokeWidth={2.25} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Deleted Class Sections</h1>
            <p className="text-sm text-slate-500">Class sections that have been soft-deleted.</p>
          </div>
        </div>

        <Button
          variant="outline"
          className="h-10 gap-2 rounded-full border-slate-200 px-5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          onClick={() => router.push("/class-section")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center">
          <p className="text-sm font-medium text-rose-700">{error}</p>
          <Button variant="outline" className="mt-3 rounded-full" onClick={fetchDeleted}>
            Try Again
          </Button>
        </div>
      ) : isLoading ? (
        <ClassSectionTableSkeleton rows={4} />
      ) : deleted.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-[#0D9488] ring-1 ring-inset ring-teal-100">
            <ArchiveX className="h-5 w-5" strokeWidth={2.25} />
          </div>
          <p className="text-sm font-semibold text-slate-900">No deleted class sections</p>
          <p className="text-sm text-slate-500">Deleted class sections will appear here.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-slate-200 bg-slate-50/80 hover:bg-slate-50/80">
                <TableHead className="h-11 text-xs font-semibold uppercase tracking-wider text-slate-500">Class / Section</TableHead>
                <TableHead className="h-11 text-xs font-semibold uppercase tracking-wider text-slate-500">Course</TableHead>
                <TableHead className="h-11 text-xs font-semibold uppercase tracking-wider text-slate-500">Department</TableHead>
                <TableHead className="h-11 text-xs font-semibold uppercase tracking-wider text-slate-500">Semester</TableHead>
                <TableHead className="h-11 text-xs font-semibold uppercase tracking-wider text-slate-500">Academic Year</TableHead>
                <TableHead className="h-11 text-xs font-semibold uppercase tracking-wider text-slate-500">Deleted Date</TableHead>
                <TableHead className="h-11 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deleted.map((cs) => (
                <TableRow
                  key={cs.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60"
                >
                  <TableCell className="py-3.5 font-medium text-slate-900">{cs.name}</TableCell>
                  <TableCell className="py-3.5 text-slate-500">{cs.course?.name ?? "-"}</TableCell>
                  <TableCell className="py-3.5 text-slate-500">{cs.department?.name ?? "-"}</TableCell>
                  <TableCell className="py-3.5 text-slate-500">{cs.semester?.name ?? "-"}</TableCell>
                  <TableCell className="py-3.5 text-slate-500">{cs.academicYear?.name ?? "-"}</TableCell>
                  <TableCell className="py-3.5 text-slate-500">{formatDate(cs.deletedAt)}</TableCell>
                  <TableCell className="py-3.5 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 gap-1.5 rounded-full border-[#0D9488] px-4 text-[#0D9488] hover:bg-[#0D9488] hover:text-white"
                      onClick={() => handleRestoreClick(cs)}
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Restore
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog open={isRestoreOpen} onOpenChange={setIsRestoreOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore Class Section</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to restore{" "}
              <span className="font-medium text-slate-900">
                {restoreTarget?.name ?? "this class section"}
              </span>
              ? It will reappear in the active class sections list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRestoring}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmRestore}
              disabled={isRestoring}
              className="bg-[#0D9488] hover:bg-[#0F766E]"
            >
              {isRestoring ? "Restoring..." : "Restore"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}