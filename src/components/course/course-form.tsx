"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { Save, BookPlus } from "lucide-react";
import {
  CreateCourse,
  CreateCoursePayload,
  GetCourseById,
  UpdateCourse,
  UpdateCoursePayload,
} from "./controller";
import { courseSchema } from "../../app/schemas/course.schema"
import { GetDepartments } from "../department/department.controller";


interface IDepartment {
  id: string;
  name: string;
  code: string;
  status: string;
}

const CourseForm = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [loadingDepartments, setLoadingDepartments] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    departmentId: "",
    durationYears: "" as string | number,
    totalSemesters: "" as string | number,
    status: "ACTIVE" as "ACTIVE" | "INACTIVE",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // ====================== FETCH DEPARTMENTS ======================
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoadingDepartments(true);
        const res = await GetDepartments(0, 100, ""); // get all departments
        setDepartments(res.data.content || []);
      } catch (error: any) {
        toast.error(error.message || "Failed to load departments");
      } finally {
        setLoadingDepartments(false);
      }
    };

    fetchDepartments();
  }, []);

  // ====================== FETCH COURSE (EDIT MODE) ======================
  useEffect(() => {
    if (!isEditMode || !id) return;

    const fetchCourse = async () => {
      try {
        setFetching(true);
        const res = await GetCourseById(id);
        const course = res.data;

        setFormData({
          name: course.name || "",
          code: course.code || "",
          departmentId: course.departmentId || "",
          durationYears: course.durationYears ?? "",
          totalSemesters: course.totalSemesters ?? "",
          status: (course.status as "ACTIVE" | "INACTIVE") || "ACTIVE",
        });
      } catch (error: any) {
        toast.error(error.message || "Failed to load course");
        router.push("/course");
      } finally {
        setFetching(false);
      }
    };

    fetchCourse();
  }, [id, isEditMode, router]);

  // ====================== HANDLE CHANGE ======================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };


   // ====================== VALIDATION ======================
  const validate = () => {
    const result = courseSchema.safeParse({
      name: formData.name.trim(),
      code: formData.code.trim(),
      departmentId: formData.departmentId.trim(),
      durationYears:
        formData.durationYears === ""
          ? undefined
          : Number(formData.durationYears),
      totalSemesters:
        formData.totalSemesters === ""
          ? undefined
          : Number(formData.totalSemesters),
      status: isEditMode ? formData.status : undefined,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};

      // Zod 3 → .errors | Zod 4 → .issues
      const issues = result.error?.issues  || [];

      issues.forEach((err: any) => {
        const field = err.path?.[0] as string;
        if (field && !fieldErrors[field]) {
          fieldErrors[field] = err.message;
        }
      });

      setErrors(fieldErrors);
      return false;
    }

    setErrors({});
    return true;
  };
  // ====================== SUBMIT ======================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);

      if (isEditMode && id) {
        const payload: UpdateCoursePayload = {
          name: formData.name.trim(),
          code: formData.code.trim(),
          departmentId: formData.departmentId.trim(),
          durationYears: Number(formData.durationYears),
          totalSemesters: Number(formData.totalSemesters),
          status: formData.status,
        };

        await UpdateCourse(id, payload);
        toast.success("Course updated successfully");
      } else {
        const payload: CreateCoursePayload = {
          name: formData.name.trim(),
          code: formData.code.trim(),
          departmentId: formData.departmentId.trim(),
          durationYears: Number(formData.durationYears),
          totalSemesters: Number(formData.totalSemesters),
        };

        await CreateCourse(payload);
        toast.success("Course created successfully");
      }

      router.push("/course");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ====================== LOADING ======================
  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-75">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#0D9488] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500">Loading course details...</p>
        </div>
      </div>
    );
  }

   return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-xl">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Course Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Course Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Bachelor of Computer Applications"
                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30 transition-all ${
                  errors.name
                    ? "border-red-400 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              />
              {errors.name && (
                <p className="mt-1.5 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Course Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Course Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="e.g. BCA"
                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30 transition-all uppercase ${
                  errors.code
                    ? "border-red-400 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              />
              {errors.code && (
                <p className="mt-1.5 text-sm text-red-500">{errors.code}</p>
              )}
            </div>

            {/* Department Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Department <span className="text-red-500">*</span>
              </label>
              <select
                name="departmentId"
                value={formData.departmentId}
                onChange={handleChange}
                disabled={loadingDepartments}
                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30 transition-all appearance-none bg-white ${
                  errors.departmentId
                    ? "border-red-400 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <option value="">
                  {loadingDepartments
                    ? "Loading departments..."
                    : "Select Department"}
                </option>
                {departments
                  .filter((dept) => dept.status === "ACTIVE")
                  .map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name} ({dept.code})
                    </option>
                  ))}
              </select>
              {errors.departmentId && (
                <p className="mt-1.5 text-sm text-red-500">
                  {errors.departmentId}
                </p>
              )}
            </div>

            {/* Duration + Semesters */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Duration (Years) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="durationYears"
                  value={formData.durationYears}
                  onChange={handleChange}
                  min={1}
                  max={10}
                  placeholder="3"
                  className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30 transition-all ${
                    errors.durationYears
                      ? "border-red-400 bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                />
                {errors.durationYears && (
                  <p className="mt-1.5 text-sm text-red-500">
                    {errors.durationYears}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Total Semesters <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="totalSemesters"
                  value={formData.totalSemesters}
                  onChange={handleChange}
                  min={1}
                  max={20}
                  placeholder="6"
                  className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30 transition-all ${
                    errors.totalSemesters
                      ? "border-red-400 bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                />
                {errors.totalSemesters && (
                  <p className="mt-1.5 text-sm text-red-500">
                    {errors.totalSemesters}
                  </p>
                )}
              </div>
            </div>

            {/* Status - Only Edit Mode */}
            {isEditMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30 appearance-none bg-white hover:border-gray-400"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => router.back()}
                disabled={loading}
                className="flex-1 px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-5 py-2.5 bg-[#0D9488] hover:bg-[#0f766e] text-white font-medium rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {isEditMode ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    {isEditMode ? <Save size={18} /> : <BookPlus size={18} />}
                    {isEditMode ? "Update Course" : "Create Course"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CourseForm;