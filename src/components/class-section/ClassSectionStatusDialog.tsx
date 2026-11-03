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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { UpdateClassSectionStatus } from "@/components/class-section/class-section.controller";
import { RefreshCw, Loader2 } from "lucide-react";

interface ClassSectionResponse {
  success: boolean;
  message: string;
}

interface ClassSectionStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classSectionId: string | null;
  classSectionName?: string;
  currentStatus?: string;
  onUpdated: () => void;
}

export function ClassSectionStatusDialog({
  open,
  onOpenChange,
  classSectionId,
  classSectionName,
  currentStatus,
  onUpdated,
}: ClassSectionStatusDialogProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const nextStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";

  const handleConfirm = async () => {
    if (!classSectionId) return;

    setIsUpdating(true);
    try {
      const res = (await UpdateClassSectionStatus(classSectionId, {
        status: nextStatus,
      })) as unknown as ClassSectionResponse;

      if (res.success) {
        toast.success(res.message);
        onOpenChange(false);
        onUpdated();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update status."
      );
    } finally {
      setIsUpdating(false);
    }
  };

 return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-[calc(100%-2rem)] max-w-96 overflow-hidden rounded-2xl border-0 bg-white p-0 shadow-xl">
        <div className="flex flex-col items-center px-6 pt-8 pb-4 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50">
            <RefreshCw className="h-5 w-5 text-[#0D9488]" strokeWidth={2.2} />
          </div>

          <AlertDialogTitle className="text-lg font-bold tracking-tight text-slate-900">
            Change Status
          </AlertDialogTitle>

          <p className="mt-1.5 text-sm text-slate-500">
            Switch this class section&apos;s employment status
          </p>
        </div>

        <div className="px-6 pb-6">
          {/* અહીંથી asChild કાઢી નાખ્યું છે અને માળખું સુધાર્યું છે */}
          <div className="space-y-4 text-center text-[14.5px] leading-relaxed text-slate-600">
            <AlertDialogDescription className="text-[14.5px] text-slate-600 m-0">
              Change status of{" "}
              <span className="font-semibold text-slate-800">
                {classSectionName ?? "this class section"}
              </span>
              ?
            </AlertDialogDescription>
            
            <div className="flex items-center justify-center gap-3">
              <Badge
                variant="outline"
                className={
                  currentStatus === "ACTIVE"
                    ? "rounded-full border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "rounded-full border-slate-200 bg-slate-100 text-slate-500"
                }
              >
                {currentStatus === "ACTIVE" ? "Active" : "Inactive"}
              </Badge>
              <span className="text-slate-400">&rarr;</span>
              <Badge
                variant="outline"
                className={
                  nextStatus === "ACTIVE"
                    ? "rounded-full border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "rounded-full border-slate-200 bg-slate-100 text-slate-500"
                }
              >
                {nextStatus === "ACTIVE" ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 border-t border-slate-100 bg-slate-50/40 px-5 py-4">
          <AlertDialogCancel
            disabled={isUpdating}
            className="mt-0 h-10 flex-1 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            Cancel
          </AlertDialogCancel>

          <Button
            onClick={handleConfirm}
            disabled={isUpdating}
            className="h-10 flex-1 gap-2 rounded-xl bg-[#0D9488] text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#0F766E] active:scale-[0.98]"
          >
            {isUpdating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" strokeWidth={2.2} />
                Confirm
              </>
            )}
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}