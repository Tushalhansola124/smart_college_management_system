"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Trash, X } from "lucide-react";
import { GetCourses, ICourse, SoftDeleteCourse } from "./controller";
 // Make sure to update controller imports

const GetAllCourses = () => {
  const router = useRouter();

  const [courses, setCourses] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Auto Search State
  const [search, setSearch] = useState("");

  // Custom Delete Dialog State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedCourseName, setSelectedCourseName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // ====================== FETCH COURSES ======================
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await GetCourses(page, size, search);

      // Matches Postman response data structure: data.content, data.totalElements, etc.
      setCourses(res.data.content);
      setTotalElements(res.data.totalElements);
      setTotalPages(res.data.totalPages);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  // Debounced/Reactive effect when page or search changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCourses();
    }, 300); // 300ms debounce for auto-search

    return () => clearTimeout(timer);
  }, [page, search]);

  // ====================== OPEN DELETE DIALOG ======================
  const openDeleteDialog = (id: string, name: string) => {
    setSelectedCourseId(id);
    setSelectedCourseName(name);
    setDeleteDialogOpen(true);
  };

  // ====================== CLOSE DELETE DIALOG ======================
  const closeDeleteDialog = () => {
    if (isDeleting) return;
    setDeleteDialogOpen(false);
    setSelectedCourseId(null);
    setSelectedCourseName("");
  };

  // ====================== CONFIRM DELETE ======================
  const handleConfirmDelete = async () => {
    if (!selectedCourseId) return;

    try {
      setIsDeleting(true);
      await SoftDeleteCourse(selectedCourseId);
      toast.success("Course deleted successfully");
      closeDeleteDialog();
      fetchCourses();
    } catch (error: any) {
      toast.error(error.message || "Delete failed");
    } finally {
      setIsDeleting(false);
    }
  };

  // ====================== EDIT ======================
  const handleEdit = (id: string) => {
    router.push(`/course/update/${id}`);
  };

  return (
    <div className="p-6">
      {/* ====================== AUTO SEARCH BAR ====================== */}
      <div className="mb-6">
        <div className="flex gap-3 max-w-md relative">
          <input
            type="text"
            placeholder="Search by course name or code..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0); // Reset page to 0 on new search input
            }}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setPage(0);
              }}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* ====================== TABLE ====================== */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="text-left px-6 py-4 font-semibold">#</th>
              <th className="text-left px-6 py-4 font-semibold">Course Name</th>
              <th className="text-left px-6 py-4 font-semibold">Code</th>
              <th className="text-left px-6 py-4 font-semibold">Department</th>
              <th className="text-left px-6 py-4 font-semibold">Duration</th>
              <th className="text-left px-6 py-4 font-semibold">Semesters</th>
              <th className="text-left px-6 py-4 font-semibold">Status</th>
              <th className="text-left px-6 py-4 font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-10 text-gray-500">
                  Loading courses...
                </td>
              </tr>
            ) : courses.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-10 text-gray-500">
                  No courses found
                </td>
              </tr>
            ) : (
              courses.map((course, index) => (
                <tr key={course.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{page * size + index + 1}</td>
                  <td className="px-6 py-4 font-medium">{course.name}</td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded text-xs font-semibold">
                      {course.code}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{course.departmentName}</td>
                  <td className="px-6 py-4 text-gray-600">{course.durationYears} Years</td>
                  <td className="px-6 py-4 text-gray-600">{course.totalSemesters} Sems</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        course.status === "ACTIVE"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {course.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(course.id)}
                        className="border text-[#0D9488] border-[#8c8f8f31] hover:bg-[#0D9488] hover:text-white px-3 py-2.5 rounded-full text-sm transition-colors"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => openDeleteDialog(course.id, course.name)}
                        className="border text-[#0D9488] border-[#8c8f8f31] hover:bg-[#0D9488] hover:text-white px-3 py-2.5 rounded-full text-sm transition-colors"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* ====================== FOOTER ====================== */}
        <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            Total Records: <span className="font-semibold">{totalElements}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1.5 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Previous
            </button>

            <span className="px-3 py-1.5 text-sm">
              Page {page + 1} of {totalPages || 1}
            </span>

            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page + 1 >= totalPages}
              className="px-3 py-1.5 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* ====================== CUSTOM DELETE DIALOG ====================== */}
      {deleteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeDeleteDialog}
          />

          {/* Dialog */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
            {/* Close button */}
            <button
              onClick={closeDeleteDialog}
              disabled={isDeleting}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            >
              <X size={20} />
            </button>

            {/* Icon */}
            <div className="flex items-center justify-center w-14 h-14 mx-auto mb-4 rounded-full bg-red-100">
              <Trash className="text-red-600" size={28} />
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold text-center text-gray-900 mb-2">
              Delete Course
            </h3>

            {/* Description */}
            <p className="text-center text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900">
                {selectedCourseName}
              </span>
              ? This action cannot be undone.
            </p>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={closeDeleteDialog}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetAllCourses;