// app/dashboard/department/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Pencil, Trash2, Building2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  GetDepartmentById,
  SoftDeleteDepartment,
  type IDepartment,
} from "@/components/department/department.controller";
import { DepartmentView } from "@/components/department/DepartmentView";
import { DepartmentViewSkeleton } from "@/components/department/DepartmentSkeleton";

export default function DepartmentDetailsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [department, setDepartment] = useState<IDepartment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepartment = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await GetDepartmentById(id);
        setDepartment(res.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load department."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchDepartment();
  }, [id]);

  const handleDelete = async () => {
    // Add your confirmation dialog logic here before actually deleting
    if (!window.confirm("Are you sure you want to delete this department?")) return;

    setIsDeleting(true);
    try {
      const res = await SoftDeleteDepartment(id);
      if (res.success) {
        toast.success("Department deleted successfully.");
        router.push("/dashboard/department");
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error("Failed to delete department.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    /* Expanded the wrapper to max-w-6xl so it takes up much more of the screen width */
    <div className="mx-auto w-full max-w-9xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* 
        Header Row: Title block on the left, Action buttons on the right.
        Uses flex-between to spread them across the full width.
      */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-6">
        
        {/* Left Side: Icon + Title + Subtitle matches the design in your image */}
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Department Details
            </h1>
            <p className="text-sm text-slate-500">
              View complete department information.
            </p>
          </div>
        </div>

        {/* Right Side: Action Buttons matching your second image layout */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="gap-2 bg-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          
          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard/department/${id}/edit`)}
            className="gap-2 bg-white"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </Button>

          <Button
            variant="outline"
            onClick={handleDelete}
            disabled={isDeleting}
            className="gap-2 border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700"
          >
            <Trash2 className="h-4 w-4" />
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>

      {/* Content Section: Will expand to fill the wider max-w-6xl container */}
      <div className="w-full">
        {isLoading ? (
          <DepartmentViewSkeleton />
        ) : error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center text-sm font-medium text-rose-700 shadow-sm">
            {error}
          </div>
        ) : department ? (
          <DepartmentView department={department} />
        ) : (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center text-sm font-medium text-slate-500 shadow-sm">
            Department not found.
          </div>
        )}
      </div>

    </div>
  );
}