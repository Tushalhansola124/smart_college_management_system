"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Archive, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { CustomDropdown, type DropdownOption } from "@/components/class-section/CustomDropdown";

interface ClassSectionFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  departmentId: string;
  onDepartmentChange: (value: string) => void;
  departmentOptions: DropdownOption[];
  courseId: string;
  onCourseChange: (value: string) => void;
  courseOptions: DropdownOption[];
  semesterId: string;
  onSemesterChange: (value: string) => void;
  semesterOptions: DropdownOption[];
  academicYearId: string;
  onAcademicYearChange: (value: string) => void;
  academicYearOptions: DropdownOption[];
  status: string;
  onStatusChange: (value: string) => void;
  onClearFilters: () => void;
}

const statusOptions: DropdownOption[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
];

export function ClassSectionFilters({
  search,
  onSearchChange,
  departmentId,
  onDepartmentChange,
  departmentOptions,
  courseId,
  onCourseChange,
  courseOptions,
  semesterId,
  onSemesterChange,
  semesterOptions,
  academicYearId,
  onAcademicYearChange,
  academicYearOptions,
  status,
  onStatusChange,
  onClearFilters,
}: ClassSectionFiltersProps) {
  const router = useRouter();
  const hasActiveFilters =
    !!search || !!departmentId || !!courseId || !!semesterId || !!academicYearId || !!status;

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="flex-1 space-y-3">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by class/section name..."
              className="h-11 rounded-full border-slate-200 bg-white pl-9 text-sm shadow-sm transition-shadow focus-visible:border-[#0D9488] focus-visible:ring-2 focus-visible:ring-[#0D9488]/20"
            />
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-5">
            <CustomDropdown
              options={academicYearOptions}
              value={academicYearId}
              onChange={onAcademicYearChange}
              placeholder="Academic Year"
            />
            <CustomDropdown
              options={departmentOptions}
              value={departmentId}
              onChange={onDepartmentChange}
              placeholder="Department"
            />
            <CustomDropdown
              options={courseOptions}
              value={courseId}
              onChange={onCourseChange}
              placeholder="Course"
            />
            <CustomDropdown
              options={semesterOptions}
              value={semesterId}
              onChange={onSemesterChange}
              placeholder="Semester"
            />
            <CustomDropdown
              options={statusOptions}
              value={status}
              onChange={onStatusChange}
              placeholder="Status"
              searchable={false}
            />
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 rounded-full px-3 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              onClick={onClearFilters}
            >
              <X className="h-3.5 w-3.5" />
              Clear Filters
            </Button>
          )}
        </div>

        <div className="flex shrink-0 gap-2.5 xl:pt-0.5">
          <Button
            variant="outline"
            className="h-11 gap-2 rounded-full border-[#0D9488] bg-white px-5 text-sm font-medium text-[#0D9488] shadow-sm transition-colors hover:bg-[#0D9488] hover:text-white"
            onClick={() => router.push("/class-section/create")}
          >
            <Plus className="h-4 w-4" />
            Create New Class
          </Button>

          <Button
            variant="outline"
            className="h-11 gap-2 rounded-full border-[#0D9488] bg-white px-5 text-sm font-medium text-[#0D9488] shadow-sm transition-colors hover:bg-[#0D9488] hover:text-white"
            onClick={() => router.push("/class-section/restore")}
          >
            <Archive className="h-4 w-4" />
            View Deleted
          </Button>
        </div>
      </div>
    </div>
  );
}