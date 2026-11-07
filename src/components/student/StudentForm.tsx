"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";


import { GetUsers } from "../user/contoller";
import { GetDeletedDepartments, GetDepartments } from "../department/department.controller";
import { GetCourses } from "../course/controller";
import { GetSemesters } from "../semester/semester.controller";
import { GetClassSections } from "../class-section/class-section.controller";
import { CreateStudent, GetStudentById, ICreateStudentPayload, IUpdateStudentPayload, UpdateStudent } from "./contoller";

// Import your other controllers (adjust paths)

const StudentForm = () => {
  const router = useRouter();
  const params = useParams();
  const studentId = params?.id as string | undefined;
  const isEdit = Boolean(studentId);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [optionsLoading, setOptionsLoading] = useState(true);

  // Dropdown options
  const [users, setUsers] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [semesters, setSemesters] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    userId: "",
    studentCode: "",
    dateOfBirth: "",
    gender: "MALE",
    phone: "",
    address: "",
    departmentId: "",
    courseId: "",
    semesterId: "",
    sectionId: "",
    admissionDate: "",
    enrollmentStatus: "ACTIVE",
    guardianName: "",
    guardianPhone: "",
  });

  // ====================== FETCH DROPDOWN OPTIONS ======================
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setOptionsLoading(true);

        const [usersRes, deptRes, courseRes, semesterRes, sectionRes] =
          await Promise.all([
            GetUsers(0, 100),
            GetDepartments(0, 100),
            GetCourses(0, 100),
            GetSemesters(0, 100),
            GetClassSections(0, 100),
          ]);

        setUsers(usersRes?.data?.content || []);
        setDepartments(deptRes?.data?.content || []);
        setCourses(courseRes?.data?.content || []);
        setSemesters(semesterRes?.data?.content || []);
        setSections(sectionRes?.data?.content || []);
      } catch (error: any) {
        console.error(error);
        toast.error("Failed to load dropdown options");
      } finally {
        setOptionsLoading(false);
      }
    };

    fetchOptions();
  }, []);

  // ====================== FETCH STUDENT FOR EDIT ======================
  useEffect(() => {
    if (!isEdit || !studentId) return;

    const fetchStudent = async () => {
      try {
        setFetching(true);
        const res = await GetStudentById(studentId);

        if (res.success && res.data) {
          const s = res.data;
          setFormData({
            userId: s.userId || "",
            studentCode: s.studentCode || "",
            dateOfBirth: s.dateOfBirth || "",
            gender: s.gender || "MALE",
            phone: s.phone || "",
            address: s.address || "",
            departmentId: s.department?.id || "",
            courseId: s.course?.id || "",
            semesterId: s.semester?.id || "",
            sectionId: s.section?.id || "",
            admissionDate: s.admissionDate || "",
            enrollmentStatus: s.enrollmentStatus || "ACTIVE",
            guardianName: s.guardianName || "",
            guardianPhone: s.guardianPhone || "",
          });
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to load student");
        router.push("/students");
      } finally {
        setFetching(false);
      }
    };

    fetchStudent();
  }, [isEdit, studentId, router]);

  // ====================== HANDLE INPUT CHANGE ======================
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ====================== HANDLE SUBMIT ======================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.userId ||
      !formData.studentCode ||
      !formData.dateOfBirth ||
      !formData.phone ||
      !formData.departmentId ||
      !formData.courseId ||
      !formData.semesterId ||
      !formData.admissionDate
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const payload: any = {
        userId: formData.userId,
        studentCode: formData.studentCode,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        phone: formData.phone,
        address: formData.address || undefined,
        departmentId: formData.departmentId,
        courseId: formData.courseId,
        semesterId: formData.semesterId,
        sectionId: formData.sectionId || null,
        admissionDate: formData.admissionDate,
        guardianName: formData.guardianName || undefined,
        guardianPhone: formData.guardianPhone || undefined,
      };

      // enrollmentStatus only send on Edit
      if (isEdit) {
        payload.enrollmentStatus = formData.enrollmentStatus;
      }

      if (isEdit && studentId) {
        await UpdateStudent(studentId, payload as IUpdateStudentPayload);
        toast.success("Student updated successfully");
      } else {
        await CreateStudent(payload as ICreateStudentPayload);
        toast.success("Student created successfully");
      }

      router.push("/students");
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
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            {isEdit ? "Edit Student" : "Add New Student"}
          </h1>
          <p className="text-sm text-gray-500">
            {isEdit
              ? "Update student information below"
              : "Fill in the details to create a new student"}
          </p>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow p-4 sm:p-6 space-y-6"
      >
        {/* ===================== BASIC INFO ===================== */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* User Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User <span className="text-red-500">*</span>
              </label>
              <select
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0D9488] bg-white"
                required
              >
                <option value="">Select User</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.fullName || user.name || user.email} ({user.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Student Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Student Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="studentCode"
                value={formData.studentCode}
                onChange={handleChange}
                placeholder="SCM-2026-001"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
                required
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
                required
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0D9488] bg-white"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+919876543210"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
                required
              />
            </div>

            {/* Address */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Rajkot, Gujarat"
                rows={2}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0D9488] resize-none"
              />
            </div>
          </div>
        </div>

        {/* ===================== ACADEMIC INFO ===================== */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
            Academic Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department <span className="text-red-500">*</span>
              </label>
              <select
                name="departmentId"
                value={formData.departmentId}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0D9488] bg-white"
                required
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Course */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course <span className="text-red-500">*</span>
              </label>
              <select
                name="courseId"
                value={formData.courseId}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0D9488] bg-white"
                required
              >
                <option value="">Select Course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
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

            {/* Section (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Section
              </label>
              <select
                name="sectionId"
                value={formData.sectionId}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0D9488] bg-white"
              >
                <option value="">Select Section (Optional)</option>
                {sections.map((section) => (
                  <option key={section.id} value={section.id}>
                    {section.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Admission Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Admission Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="admissionDate"
                value={formData.admissionDate}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
                required
              />
            </div>

            {/* Enrollment Status - Only show in Edit mode */}
            {isEdit && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enrollment Status <span className="text-red-500">*</span>
                </label>
                <select
                  name="enrollmentStatus"
                  value={formData.enrollmentStatus}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0D9488] bg-white"
                  required
                >
                  <option value="ACTIVE">Active</option>
                  <option value="GRADUATED">Graduated</option>
                  <option value="TRANSFERRED">Transferred</option>
                  <option value="DISCONTINUED">Discontinued</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* ===================== GUARDIAN INFO ===================== */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
            Guardian Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Guardian Name
              </label>
              <input
                type="text"
                name="guardianName"
                value={formData.guardianName}
                onChange={handleChange}
                placeholder="Parent Name"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Guardian Phone
              </label>
              <input
                type="text"
                name="guardianPhone"
                value={formData.guardianPhone}
                onChange={handleChange}
                placeholder="+919876543211"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
              />
            </div>
          </div>
        </div>

        {/* ===================== ACTIONS ===================== */}
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
              "Update Student"
            ) : (
              "Create Student"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentForm;