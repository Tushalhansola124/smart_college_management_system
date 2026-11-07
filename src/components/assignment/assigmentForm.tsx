"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";


import { GetFaculties } from "../faculty/faculty.controller";
import { GetSubjects } from "../subject/contoller";
import { GetAcademicYears } from "../academic-year/academic-years.controller";
import { GetSemesters } from "../semester/semester.controller";
import { GetClassSections } from "../class-section/class-section.controller";
import { CreateAssignment, CreateAssignmentPayload, GetAssignmentById, UpdateAssignment, UpdateAssignmentPayload } from "./contoller";

// Adjust these import paths according to your project


const AssignmentForm = () => {
  const router = useRouter();
  const params = useParams();
  const assignmentId = params?.id as string | undefined;
  const isEdit = Boolean(assignmentId);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [optionsLoading, setOptionsLoading] = useState(true);

  // Dropdown data
  const [faculties, setFaculties] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [academicYears, setAcademicYears] = useState<any[]>([]);
  const [semesters, setSemesters] = useState<any[]>([]);
  const [classSections, setClassSections] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    facultyId: "",
    subjectId: "",
    academicYearId: "",
    semesterId: "",
    classSectionId: "",
    assignedDate: "",
  });

  // ====================== FETCH DROPDOWN OPTIONS ======================
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setOptionsLoading(true);

        const [facultyRes, subjectRes, yearRes, semesterRes, sectionRes] =
          await Promise.all([
            GetFaculties(0, 100),
            GetSubjects(0, 100),
            GetAcademicYears(0, 100),
            GetSemesters(0, 100),
            GetClassSections(0, 100),
          ]);

        setFaculties(facultyRes?.data?.content || []);
        setSubjects(subjectRes?.data?.content || []);
        setAcademicYears(yearRes?.data?.content || []);
        setSemesters(semesterRes?.data?.content || []);
        setClassSections(sectionRes?.data?.content || []);
      } catch (error: any) {
        console.error(error);
        toast.error("Failed to load dropdown options");
      } finally {
        setOptionsLoading(false);
      }
    };

    fetchOptions();
  }, []);

  // ====================== FETCH ASSIGNMENT FOR EDIT ======================
  useEffect(() => {
    if (!isEdit || !assignmentId) return;

    const fetchAssignment = async () => {
      try {
        setFetching(true);
        const res = await GetAssignmentById(assignmentId);

        if (res.success && res.data) {
          const a = res.data;
          setFormData({
            facultyId: a.facultyId || "",
            subjectId: a.subject?.id || "",
            academicYearId: a.academicYear?.id || "",
            semesterId: a.semester?.id || "",
            classSectionId: a.classSection?.id || "",
            assignedDate: a.assignedDate || "",
          });
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to load assignment");
        router.push("/assignment");
      } finally {
        setFetching(false);
      }
    };

    fetchAssignment();
  }, [isEdit, assignmentId, router]);

  // ====================== HANDLE CHANGE ======================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ====================== HANDLE SUBMIT ======================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.facultyId ||
      !formData.subjectId ||
      !formData.academicYearId ||
      !formData.semesterId ||
      !formData.classSectionId ||
      !formData.assignedDate
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        facultyId: formData.facultyId,
        subjectId: formData.subjectId,
        academicYearId: formData.academicYearId,
        semesterId: formData.semesterId,
        classSectionId: formData.classSectionId,
        assignedDate: formData.assignedDate,
      };

      if (isEdit && assignmentId) {
        await UpdateAssignment(assignmentId, payload as UpdateAssignmentPayload);
        toast.success("Assignment updated successfully");
      } else {
        await CreateAssignment(payload as CreateAssignmentPayload);
        toast.success("Assignment created successfully");
      }

      router.push("/assignment");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ====================== LOADING ======================
  if (fetching || optionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#0D9488]" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      {/* Header */}
    

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow p-4 sm:p-6 space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Faculty */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Faculty <span className="text-red-500">*</span>
            </label>
            <select
              name="facultyId"
              value={formData.facultyId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0D9488] bg-white"
              required
            >
              <option value="">Select Faculty</option>
              {faculties.map((faculty) => (
                <option key={faculty.id} value={faculty.id}>
                  {faculty.fullName || faculty.name}{" "}
                  {faculty.employeeCode ? `(${faculty.employeeCode})` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject <span className="text-red-500">*</span>
            </label>
            <select
              name="subjectId"
              value={formData.subjectId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0D9488] bg-white"
              required
            >
              <option value="">Select Subject</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.subjectName || subject.name}
                </option>
              ))}
            </select>
          </div>

          {/* Academic Year */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Academic Year <span className="text-red-500">*</span>
            </label>
            <select
              name="academicYearId"
              value={formData.academicYearId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0D9488] bg-white"
              required
            >
              <option value="">Select Academic Year</option>
              {academicYears.map((year) => (
                <option key={year.id} value={year.id}>
                  {year.name}
                </option>
              ))}
            </select>
          </div>

          {/* Semester */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Semester <span className="text-red-500">*</span>
            </label>
            <select
              name="semesterId"
              value={formData.semesterId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0D9488] bg-white"
              required
            >
              <option value="">Select Semester</option>
              {semesters.map((sem) => (
                <option key={sem.id} value={sem.id}>
                  {sem.name}
                </option>
              ))}
            </select>
          </div>

          {/* Class Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class Section <span className="text-red-500">*</span>
            </label>
            <select
              name="classSectionId"
              value={formData.classSectionId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0D9488] bg-white"
              required
            >
              <option value="">Select Class Section</option>
              {classSections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.name}
                </option>
              ))}
            </select>
          </div>

          {/* Assigned Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assigned Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="assignedDate"
              value={formData.assignedDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
              required
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#0D9488] hover:bg-[#0f766e] text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {isEdit ? "Updating..." : "Creating..."}
              </>
            ) : isEdit ? (
              "Update Assignment"
            ) : (
              "Create Assignment"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssignmentForm;