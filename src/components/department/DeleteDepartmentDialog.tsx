"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { SoftDeleteDepartment } from "@/components/department/department.controller";
import { Trash2, Loader2 } from "lucide-react";

interface DeleteDepartmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  departmentId: string | null;
  departmentName?: string;
  onDeleted: () => void;
}

export function DeleteDepartmentDialog({
  open,
  onOpenChange,
  departmentId,
  departmentName,
  onDeleted,
}: DeleteDepartmentDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!departmentId) return;

    setIsDeleting(true);
    try {
      const res = await SoftDeleteDepartment(departmentId);
      toast.success(res?.message || "Department deleted successfully");
      onOpenChange(false);
      onDeleted();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete department."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-[calc(100%-2rem)] max-w-[360px] overflow-hidden rounded-2xl border-0 bg-white p-0 shadow-xl">
        
        {/* Header */}
        <div className="flex flex-col items-center px-6 pt-8 pb-4 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50">
            <Trash2 className="h-5 w-5 text-rose-500" strokeWidth={2.2} />
          </div>

          <AlertDialogTitle className="text-lg font-bold tracking-tight text-slate-900">
            Delete Department
          </AlertDialogTitle>

          <p className="mt-1.5 text-sm text-slate-500">
            Move this department to the recycle bin
          </p>
        </div>

        {/* Description */}
        <div className="px-6 pb-6">
          <AlertDialogDescription className="text-center text-[14.5px] leading-relaxed text-slate-600">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-slate-800">
              {departmentName ?? "this department"}
            </span>
            ? You can restore it later from the Restore Departments page.
          </AlertDialogDescription>
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center gap-3 border-t border-slate-100 bg-slate-50/40 px-5 py-4">
          <AlertDialogCancel
            disabled={isDeleting}
            className="mt-0 h-10 flex-1 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            Cancel
          </AlertDialogCancel>

          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            className="h-10 flex-1 gap-2 rounded-xl bg-rose-600 text-sm font-semibold text-white shadow-sm transition-all hover:bg-rose-700 active:scale-[0.98]"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" strokeWidth={2.2} />
                Yes, Delete
              </>
            )}
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}