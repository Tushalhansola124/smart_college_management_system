"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


import { GetDepartments } from "../department/department.controller"; // ← adjust path
import { GetSemesters } from "../semster/semster.contoller";         // ← adjust path
import { SubjectFormValues, subjectSchema } from "@/app/schemas/subject.schema";
import { CreateSubject, GetSubjectById, UpdateSubject } from "./contoller";

interface SubjectFormProps {
  editId?: string | null; // null = create mode
}

interface DropdownOption {
  id: string;
  name: string;
}

const SubjectForm = ({ editId = null }: SubjectFormProps) => {
  const router = useRouter();
  const isEditMode = Boolean(editId);

  // Form fields
  const [subjectCode, setSubjectCode] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [description, setDescription] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [semesterId, setSemesterId] = useState("");
  const [subjectType, setSubjectType] = useState<"THEORY" | "PRACTICAL" | "BOTH" | "">("");
  const [credits, setCredits] = useState<number | "">("");

  // Errors
  const [errors, setErrors] = useState<
    Partial<Record<keyof SubjectFormValues, string>>
  >({});

  // Dropdown options
  const [departments, setDepartments] = useState<DropdownOption[]>([]);
  const [semesters, setSemesters] = useState<DropdownOption[]>([]);

  // Loading states
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ====================== FETCH DROPDOWN OPTIONS ======================
  const fetchOptions = async () => {
    try {
      setLoadingOptions(true);

      const [departmentsRes, semestersRes] = await Promise.all([
        GetDepartments(0, 100),
        GetSemesters(0, 100),
      ]);

      setDepartments(
        departmentsRes?.data?.content || departmentsRes?.data || []
      );
      setSemesters(semestersRes?.data?.content || semestersRes?.data || []);
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
      const res = await GetSubjectById(id);

      if (res.success && res.data) {
        const data = res.data;
        setSubjectCode(data.subjectCode || "");
        setSubjectName(data.subjectName || "");
        setDescription(data.description || "");
        setDepartmentId(data.department?.id || "");
        setSemesterId(data.semester?.id || "");
        setSubjectType((data.subjectType as any) || "");
        setCredits(data.credits ?? "");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load subject");
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
      subjectCode: subjectCode.trim(),
      subjectName: subjectName.trim(),
      description: description.trim() || undefined,
      departmentId,
      semesterId,
      subjectType: subjectType as "THEORY" | "PRACTICAL" | "BOTH",
      credits: Number(credits),
    };

    // ===== Zod Validation =====
    const result = subjectSchema.safeParse(payload);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof SubjectFormValues, string>> = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof SubjectFormValues;
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
        await UpdateSubject(editId, result.data);
        toast.success("Subject updated successfully");
      } else {
        await CreateSubject(result.data);
        toast.success("Subject created successfully");
      }

      router.push("/subject"); // ← change to your list page path
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
          {/* Subject Code + Subject Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Subject Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={subjectCode}
                onChange={(e) => setSubjectCode(e.target.value)}
                placeholder="e.g. BCA-JAVA-301"
                className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.subjectCode ? "border-red-500" : "border-gray-300"
                }`}
                disabled={submitting}
              />
              {errors.subjectCode && (
                <p className="mt-1 text-sm text-red-600">{errors.subjectCode}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Subject Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                placeholder="e.g. Advanced Java Programming"
                className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.subjectName ? "border-red-500" : "border-gray-300"
                }`}
                disabled={submitting}
              />
              {errors.subjectName && (
                <p className="mt-1 text-sm text-red-600">{errors.subjectName}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter subject description..."
              rows={3}
              className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
              disabled={submitting}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Department + Semester */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                <p className="mt-1 text-sm text-red-600">{errors.departmentId}</p>
              )}
            </div>

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
          </div>

          {/* Subject Type + Credits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Subject Type <span className="text-red-500">*</span>
              </label>
              <select
                value={subjectType}
                onChange={(e) =>
                  setSubjectType(e.target.value as "THEORY" | "PRACTICAL" | "BOTH")
                }
                className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${
                  errors.subjectType ? "border-red-500" : "border-gray-300"
                }`}
                disabled={submitting}
              >
                <option value="">Select Type</option>
                <option value="THEORY">Theory</option>
                <option value="PRACTICAL">Practical</option>
                <option value="BOTH">Both</option>
              </select>
              {errors.subjectType && (
                <p className="mt-1 text-sm text-red-600">{errors.subjectType}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Credits <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={credits}
                onChange={(e) =>
                  setCredits(e.target.value === "" ? "" : Number(e.target.value))
                }
                placeholder="e.g. 4"
                className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.credits ? "border-red-500" : "border-gray-300"
                }`}
                disabled={submitting}
              />
              {errors.credits && (
                <p className="mt-1 text-sm text-red-600">{errors.credits}</p>
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
                "Update Subject"
              ) : (
                "Create Subject"
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SubjectForm;