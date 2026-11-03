"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Archive, Search } from "lucide-react";
import { useRouter } from "next/navigation";

interface SemesterFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export function SemesterFilters({ search, onSearchChange }: SemesterFiltersProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by semester name..."
          className="h-10 rounded-lg border-slate-200 bg-white pl-9 text-sm shadow-sm transition-shadow focus-visible:border-[#0D9488] focus-visible:ring-2 focus-visible:ring-[#0D9488]/20"
        />
      </div>

      <div className="flex gap-2.5">
        <Button
          variant="outline"
          className="h-10 gap-2 rounded-full border-[#0D9488] bg-white px-5 text-sm font-medium text-[#0D9488] shadow-sm transition-colors hover:bg-[#0D9488] hover:text-white"
          onClick={() => router.push("/semester/create")}
        >
          <Plus className="h-4 w-4" />
          Add Semester
        </Button>

        <Button
          variant="outline"
          className="h-10 gap-2 rounded-full border-[#0D9488] bg-white px-5 text-sm font-medium text-[#0D9488] shadow-sm transition-colors hover:bg-[#0D9488] hover:text-white"
          onClick={() => router.push("/semester/restore")}
        >
          <Archive className="h-4 w-4" />
          Deleted Semesters
        </Button>
      </div>
    </div>
  );
}