"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Archive, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { CustomDropdown, type DropdownOption } from "@/components/faculty/CustomDropdown";

interface FacultyFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  departmentId: string;
  onDepartmentChange: (value: string) => void;
  departmentOptions: DropdownOption[];
  status: string;
  onStatusChange: (value: string) => void;
  onClearFilters: () => void;
}

const statusOptions: DropdownOption[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
];

export function FacultyFilters({
  search,
  onSearchChange,
  departmentId,
  onDepartmentChange,
  departmentOptions,
  status,
  onStatusChange,
  onClearFilters,
}: FacultyFiltersProps) {
  const router = useRouter();
  const hasActiveFilters = !!search || !!departmentId || !!status;

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name or code..."
            className="h-10 rounded-lg border-slate-200 bg-white pl-9 text-sm shadow-sm transition-shadow focus-visible:border-[#0D9488] focus-visible:ring-2 focus-visible:ring-[#0D9488]/20"
          />
        </div>

        <div className="w-full sm:w-48">
          <CustomDropdown
            options={departmentOptions}
            value={departmentId}
            onChange={onDepartmentChange}
            placeholder="All Departments"
          />
        </div>

        <div className="w-full sm:w-40">
          <CustomDropdown
            options={statusOptions}
            value={status}
            onChange={onStatusChange}
            placeholder="All Status"
            searchable={false}
          />
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="h-10 gap-1.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            onClick={onClearFilters}
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </Button>
        )}
      </div>

      <div className="flex gap-2.5">
        <Button
          variant="outline"
          className="h-10 gap-2 rounded-full border-[#0D9488] bg-white px-5 text-sm font-medium text-[#0D9488] shadow-sm transition-colors hover:bg-[#0D9488] hover:text-white"
          onClick={() => router.push("/faculty/create")}
        >
          <Plus className="h-4 w-4" />
          Add Faculty
        </Button>

        <Button
          variant="outline"
          className="h-10 gap-2 rounded-full border-[#0D9488] bg-white px-5 text-sm font-medium text-[#0D9488] shadow-sm transition-colors hover:bg-[#0D9488] hover:text-white"
          onClick={() => router.push("/faculty/restore")}
        >
          <Archive className="h-4 w-4" />
          Restore Deleted
        </Button>
      </div>
    </div>
  );
}