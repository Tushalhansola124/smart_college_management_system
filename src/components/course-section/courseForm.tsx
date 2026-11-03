"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  ClassSectionFormValues,
  classSectionSchema,
} from "@/app/schemas/course-sections";
import { GetCourses } from "../course/controller";
import { GetDepartments } from "../department/department.controller";
import { GetSemesters } from "../semster/semster.contoller";
import { GetAcademicYears } from "../academic-year/academic-years.controller";
import {
  CreateClassSection,
  GetClassSectionById,
  UpdateClassSection,
} from "./contoller";

interface ClassSectionFormProps {
  editId?: string | null; // null = create mode
}

interface DropdownOption {
  id: string;
  name: string;
}

const ClassSectionForm = ({ editId = null }: ClassSectionFormProps) => {
  const router = useRouter();
  const isEditMode = Boolean(editId);

  // Form fields
  const [name, setName] = useState("");
  const [courseId, setCourseId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [semesterId, setSemesterId] = useState("");
  const [academicYearId, setAcademicYearId] = useState("");

  // Errors
  const [errors, setErrors] = useState<
    Partial<Record<keyof ClassSectionFormValues, string>>
  >({});

  // Dropdown options
  const [courses, setCourses] = useState<DropdownOption[]>([]);
  const [departments, setDepartments] = useState<DropdownOption[]>([]);
  const [semesters, setSemesters] = useState<DropdownOption[]>([]);
  const [academicYears, setAcademicYears] = useState<DropdownOption[]>([]);

  // Loading states
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ====================== FETCH DROPDOWN OPTIONS ======================
  const fetchOptions = async () => {
    try {
      setLoadingOptions(true);

      const [coursesRes, departmentsRes, semestersRes, academicYearsRes] =
        await Promise.all([
          GetCourses(0, 100),
          GetDepartments(0, 100),
          GetSemesters(0, 100),
          GetAcademicYears(0, 100),
        ]);

      setCourses(coursesRes?.data?.content || coursesRes?.data || []);
      setDepartments(
        departmentsRes?.data?.content || departmentsRes?.data || []
      );
      setSemesters(semestersRes?.data?.content || semestersRes?.data || []);
      setAcademicYears(
        academicYearsRes?.data?.content || academicYearsRes?.data || []
      );
    } catch (error: any) {
      toast.error(error.message || "Failed to load dropdown options");
    } finally {
      setLoadingOptions(false);
    }
  };

  // ====================== FETCH DATA FOR EDIT ======================
  const fetchEditData = async (id: string) => {
    try {
      setLoadingData(true);
      const res = await GetClassSectionById(id);

      if (res.success && res.data) {
        const data = res.data;
        setName(data.name || "");
        setCourseId(data.course?.id || "");
        setDepartmentId(data.department?.id || "");
        setSemesterId(data.semester?.id || "");
        setAcademicYearId(data.academicYear?.id || "");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load class section");
      router.back();
    } finally {
      setLoadingData(false);
    }
  };

  // ====================== LOAD DATA ======================
  useEffect(() => {
    fetchOptions();

    if (isEditMode && editId) {
      fetchEditData(editId);
    }
  }, [editId]);

  // ====================== SUBMIT ======================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const payload = {
      name: name.trim(),
      courseId,
      departmentId,
      semesterId,
      academicYearId,
    };

    // ===== Zod Validation =====
    const result = classSectionSchema.safeParse(payload);

    if (!result.success) {
      const fieldErrors: Partial<
        Record<keyof ClassSectionFormValues, string>
      > = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof ClassSectionFormValues;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });

      setErrors(fieldErrors);
      return;
    }

    // ===== API Call =====
    try {
      setSubmitting(true);

      if (isEditMode && editId) {
        await UpdateClassSection(editId, result.data);
        toast.success("Class section updated successfully");
      } else {
        await CreateClassSection(result.data);
        toast.success("Class section created successfully");
      }

      router.push("/course-sections"); // ← change to your list page path
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {loadingData || loadingOptions ? (
        <div className="py-16 text-center text-gray-500">
          Loading form data...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Section Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Section Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. BCA Sem 5 - A"
              className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              disabled={submitting}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Course + Department */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Course <span className="text-red-500">*</span>
              </label>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${
                  errors.courseId ? "border-red-500" : "border-gray-300"
                }`}
                disabled={submitting}
              >
                <option value="">Select Course</option>
                {courses.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              {errors.courseId && (
                <p className="mt-1 text-sm text-red-600">{errors.courseId}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Department <span className="text-red-500">*</span>
              </label>
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${
                  errors.departmentId ? "border-red-500" : "border-gray-300"
                }`}
                disabled={submitting}
              >
                <option value="">Select Department</option>
                {departments.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              {errors.departmentId && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.departmentId}
                </p>
              )}
            </div>
          </div>

          {/* Semester + Academic Year */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Semester <span className="text-red-500">*</span>
              </label>
              <select
                value={semesterId}
                onChange={(e) => setSemesterId(e.target.value)}
                className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${
                  errors.semesterId ? "border-red-500" : "border-gray-300"
                }`}
                disabled={submitting}
              >
                <option value="">Select Semester</option>
                {semesters.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              {errors.semesterId && (
                <p className="mt-1 text-sm text-red-600">{errors.semesterId}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Academic Year <span className="text-red-500">*</span>
              </label>
              <select
                value={academicYearId}
                onChange={(e) => setAcademicYearId(e.target.value)}
                className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${
                  errors.academicYearId ? "border-red-500" : "border-gray-300"
                }`}
                disabled={submitting}
              >
                <option value="">Select Academic Year</option>
                {academicYears.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              {errors.academicYearId && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.academicYearId}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={submitting}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2.5 bg-[#0D9488] hover:bg-[#0F766E] text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : isEditMode ? (
                "Update Class Section"
              ) : (
                "Create Class Section"
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ClassSectionForm;