// "use client";

// import { useState } from "react";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import { toast } from "sonner";
// import { SoftDeleteAcademicYear } from "@/components/academic-year/academic-years.controller";

// interface DeleteAcademicYearDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   academicYearId: string | null;
//   academicYearName?: string;
//   onDeleted: () => void;
// }

// export function DeleteAcademicYearDialog({
//   open,
//   onOpenChange,
//   academicYearId,
//   academicYearName,
//   onDeleted,
// }: DeleteAcademicYearDialogProps) {
//   const [isDeleting, setIsDeleting] = useState(false);

//   const handleDelete = async () => {
//     if (!academicYearId) return;

//     setIsDeleting(true);
//     try {
//       await SoftDeleteAcademicYear(academicYearId);
//       toast.success("Academic year deleted successfully.");
//       onOpenChange(false);
//       onDeleted();
//     } catch (error) {
//       toast.error(
//         error instanceof Error
//           ? error.message
//           : "Failed to delete academic year."
//       );
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   return (
//     <AlertDialog open={open} onOpenChange={onOpenChange}>
//       <AlertDialogContent>
//         <AlertDialogHeader>
//           <AlertDialogTitle>Delete Academic Year</AlertDialogTitle>
//           <AlertDialogDescription>
//             Are you sure you want to delete{" "}
//             <span className="font-medium text-slate-900">
//               {academicYearName ?? "this academic year"}
//             </span>
//             ? This action can be reversed later from Restore Academic Years.
//           </AlertDialogDescription>
//         </AlertDialogHeader>
//         <AlertDialogFooter>
//           <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
//           <AlertDialogAction
//             onClick={handleDelete}
//             disabled={isDeleting}
//             className="bg-rose-600 hover:bg-rose-700"
//           >
//             {isDeleting ? "Deleting..." : "Delete"}
//           </AlertDialogAction>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
//   );
// }

"use client";

import { useState } from "react";
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
import { toast } from "sonner";
import { SoftDeleteAcademicYear } from "@/components/academic-year/academic-years.controller";

interface DeleteAcademicYearDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  academicYearId: string | null;
  academicYearName?: string;
  onDeleted: () => void;
}

interface IDeleteResponse {
  success: boolean;
  message: string;
}

export function DeleteAcademicYearDialog({
  open,
  onOpenChange,
  academicYearId,
  academicYearName,
  onDeleted,
}: DeleteAcademicYearDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!academicYearId) return;

    setIsDeleting(true);
    try {
      const res = (await SoftDeleteAcademicYear(
        academicYearId
      )) as IDeleteResponse;

      if (res?.success) {
        toast.success(res.message || "Academic year deleted successfully.");
        onOpenChange(false);
        onDeleted();
      } else {
        toast.error(res?.message || "Failed to delete academic year.");
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete academic year."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Academic Year</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-medium text-slate-900">
              {academicYearName ?? "this academic year"}
            </span>
            ? This action can be reversed later from Restore Academic Years.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-rose-600 hover:bg-rose-700"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}