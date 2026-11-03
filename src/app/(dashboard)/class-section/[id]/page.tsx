"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil, RefreshCw, Trash2 } from "lucide-react";

import { GetClassSectionById, type IClassSection } from "@/components/class-section/class-section.controller";
import { ClassSectionView } from "@/components/class-section/ClassSectionView";
import { ClassSectionViewSkeleton } from "@/components/class-section/ClassSectionSkeleton";
import { ClassSectionStatusDialog } from "@/components/class-section/ClassSectionStatusDialog";
import { DeleteClassSectionDialog } from "@/components/class-section/DeleteClassSectionDialog";

export default function ClassSectionDetailsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [classSection, setClassSection] = useState<IClassSection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const fetchClassSection = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await GetClassSectionById(id);
      setClassSection(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load class section.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    let ignore = false;
    (async () => {
      if (ignore) return;
      await fetchClassSection();
    })();
    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div className="mx-auto w-full max-w-9xl space-y-6 px-4 py-6 sm:px-6 lg:px-10">
     

      <div className="flex items-center justify-between border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Class Section Details</h1>
          <p className="text-sm text-slate-500">View complete class section information.</p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Button
            variant="outline"
            className="h-10 gap-2 rounded-full border-slate-200 px-5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            onClick={() => router.push("/class-section")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          {classSection && (
            <>
              <Button
                variant="outline"
                className="h-10 gap-2 rounded-full border-slate-200 px-5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                onClick={() => router.push(`/class-section/${id}/edit`)}
              >
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="outline"
                className="h-10 gap-2 rounded-full border-slate-200 px-5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                onClick={() => setIsStatusOpen(true)}
              >
                <RefreshCw className="h-4 w-4" />
                Change Status
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
        <ClassSectionViewSkeleton />
      ) : error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-sm font-medium text-rose-700">
          {error}
        </div>
      ) : classSection ? (
        <ClassSectionView classSection={classSection} />
      ) : null}

      <ClassSectionStatusDialog
        open={isStatusOpen}
        onOpenChange={setIsStatusOpen}
        classSectionId={classSection?.id ?? null}
        classSectionName={classSection?.name}
        currentStatus={classSection?.status}
        onUpdated={fetchClassSection}
      />

      <DeleteClassSectionDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        classSectionId={classSection?.id ?? null}
        classSectionName={classSection?.name}
        onDeleted={() => {
          toast.success("Class section deleted.");
          router.push("/class-section");
        }}
      />
    </div>
  );
}