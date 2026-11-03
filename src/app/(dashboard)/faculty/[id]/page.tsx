"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";

import { GetFacultyById, type IFaculty } from "@/components/faculty/faculty.controller";
import { FacultyView } from "@/components/faculty/FacultyView";
import { FacultyViewSkeleton } from "@/components/faculty/FacultySkeleton";
import { DeleteFacultyDialog } from "@/components/faculty/DeleteFacultyDialog";

export default function FacultyDetailsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [faculty, setFaculty] = useState<IFaculty | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    let ignore = false;

    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await GetFacultyById(id);
        if (!ignore) setFaculty(res.data);
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Failed to load faculty.");
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [id]);

  return (
    <div className="mx-auto w-full max-w-9xl space-y-6 px-4 py-6 sm:px-6 lg:px-10">
     
      <div className="flex items-center justify-between border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Faculty Details</h1>
          <p className="text-sm text-slate-500">View complete faculty information.</p>
        </div>
        <div className="flex gap-2.5">
          <Button
            variant="outline"
            className="h-10 gap-2 rounded-full border-slate-200 px-5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            onClick={() => router.push("/faculty")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          {faculty && (
            <>
              <Button
                variant="outline"
                className="h-10 gap-2 rounded-full border-slate-200 px-5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                onClick={() => router.push(`/faculty/${id}/edit`)}
              >
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="outline"
                className="h-10 gap-2 rounded-full border-rose-200 px-5 text-sm font-medium text-rose-600 shadow-sm hover:bg-rose-50 hover:text-rose-700"
                onClick={() => setIsDeleteOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </>
          )}
        </div>
      </div>

      {isLoading ? (
        <FacultyViewSkeleton />
      ) : error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-sm font-medium text-rose-700">
          {error}
        </div>
      ) : faculty ? (
        <FacultyView faculty={faculty} />
      ) : null}

      <DeleteFacultyDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        facultyId={faculty?.id ?? null}
        facultyName={faculty?.fullName}
        onDeleted={() => {
          toast.success("Faculty deleted.");
          router.push("/faculty");
        }}
      />
    </div>
  );
}