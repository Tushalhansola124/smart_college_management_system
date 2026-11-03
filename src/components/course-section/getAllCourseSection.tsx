"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Pencil, Trash, X } from "lucide-react";
import { GetClassSections, IClassSection, SoftDeleteClassSection } from "./contoller";


const ClassSectionsTable = () => {
  const router = useRouter();

  const [sections, setSections] = useState<IClassSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Search
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // Custom Delete Dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [selectedSectionName, setSelectedSectionName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // ====================== FETCH CLASS SECTIONS ======================
  const fetchSections = async () => {
    try {
      setLoading(true);
      const res = await GetClassSections(page, size, search);

      if (res.success && res.data) {
        setSections(res.data.content);
        setTotalElements(res.data.totalElements || 0);
        setTotalPages(res.data.totalPages || 0);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to load class sections");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, [page, search]);

  // ====================== SEARCH HANDLER ======================
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    setSearch(searchInput.trim());
  };

  // ====================== OPEN DELETE DIALOG ======================
  const openDeleteDialog = (id: string, name: string) => {
    setSelectedSectionId(id);
    setSelectedSectionName(name);
    setDeleteDialogOpen(true);
  };

  // ====================== CLOSE DELETE DIALOG ======================
  const closeDeleteDialog = () => {
    if (isDeleting) return;
    setDeleteDialogOpen(false);
    setSelectedSectionId(null);
    setSelectedSectionName("");
  };

  // ====================== CONFIRM DELETE ======================
  const handleConfirmDelete = async () => {
    if (!selectedSectionId) return;

    try {
      setIsDeleting(true);
      await SoftDeleteClassSection(selectedSectionId);
      toast.success("Class section deleted successfully");
      closeDeleteDialog();
      fetchSections();
    } catch (error: any) {
      toast.error(error.message || "Delete failed");
    } finally {
      setIsDeleting(false);
    }
  };

  // ====================== EDIT ======================
  const handleEdit = (id: string) => {
    router.push(`/course-sections/edit/${id}`); // change path if needed
  };

  return (
    <div className="p-6">
      {/* ====================== SEARCH BAR ====================== */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-3 max-w-md">
          <input
            type="text"
            placeholder="Search by section name..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
          >
            Search
          </button>
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                setSearch("");
                setPage(0);
              }}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {/* ====================== TABLE ====================== */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="text-left px-6 py-4 font-semibold">#</th>
              <th className="text-left px-6 py-4 font-semibold">Section Name</th>
              <th className="text-left px-6 py-4 font-semibold">Course</th>
              <th className="text-left px-6 py-4 font-semibold">Department</th>
              <th className="text-left px-6 py-4 font-semibold">Semester</th>
              <th className="text-left px-6 py-4 font-semibold">Academic Year</th>
              <th className="text-left px-6 py-4 font-semibold">Status</th>
              <th className="text-left px-6 py-4 font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-10">
                  Loading...
                </td>
              </tr>
            ) : sections.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-10 text-gray-500">
                  No class sections found
                </td>
              </tr>
            ) : (
              sections.map((section, index) => (
                <tr key={section.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{page * size + index + 1}</td>
                  <td className="px-6 py-4 font-medium">{section.name}</td>
                  <td className="px-6 py-4">{section.course?.name || "N/A"}</td>
                  <td className="px-6 py-4">{section.department?.name || "N/A"}</td>
                  <td className="px-6 py-4">{section.semester?.name || "N/A"}</td>
                  <td className="px-6 py-4">{section.academicYear?.name || "N/A"}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        section.status === "ACTIVE" || section.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {section.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(section.id)}
                        className="border text-[#0D9488] border-[#8c8f8f31] hover:bg-[#0D9488] hover:text-white px-3 py-2.5 rounded-full text-sm"
                      >
                        <Pencil />
                      </button>
                      <button
                        onClick={() => openDeleteDialog(section.id, section.name)}
                        className="border text-[#0D9488] border-[#8c8f8f31] hover:bg-[#0D9488] hover:text-white px-3 py-2.5 rounded-full text-sm"
                      >
                        <Trash />
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
              Delete Class Section
            </h3>

            {/* Description */}
            <p className="text-center text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900">
                {selectedSectionName}
              </span>
              ? This action cannot be undone.
            </p>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={closeDeleteDialog}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
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

export default ClassSectionsTable;