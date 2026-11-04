"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { RotateCcw, X } from "lucide-react";
import { GetDeletedSubjects, ISubject, RestoreSubject } from "@/components/subject/contoller";


const DeletedSubjectsTable = () => {
  const router = useRouter();

  const [subjects, setSubjects] = useState<ISubject[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Search
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // Custom Restore Dialog
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedSubjectName, setSelectedSubjectName] = useState("");
  const [isRestoring, setIsRestoring] = useState(false);

  // ====================== FETCH DELETED SUBJECTS ======================
  const fetchDeletedSubjects = async () => {
    try {
      setLoading(true);
      const res = await GetDeletedSubjects(page, size);

      if (res.success && res.data) {
        setSubjects(res.data.content);
        setTotalElements(res.data.totalElements || 0);
        setTotalPages(res.data.totalPages || 0);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to load deleted subjects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeletedSubjects();
  }, [page, search]);

  // ====================== SEARCH HANDLER ======================
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    setSearch(searchInput.trim());
  };

  // ====================== OPEN RESTORE DIALOG ======================
  const openRestoreDialog = (id: string, name: string) => {
    setSelectedSubjectId(id);
    setSelectedSubjectName(name);
    setRestoreDialogOpen(true);
  };

  // ====================== CLOSE RESTORE DIALOG ======================
  const closeRestoreDialog = () => {
    if (isRestoring) return;
    setRestoreDialogOpen(false);
    setSelectedSubjectId(null);
    setSelectedSubjectName("");
  };

  // ====================== CONFIRM RESTORE ======================
  const handleConfirmRestore = async () => {
    if (!selectedSubjectId) return;

    try {
      setIsRestoring(true);
      await RestoreSubject(selectedSubjectId);
      toast.success("Subject restored successfully");
      closeRestoreDialog();
      fetchDeletedSubjects();
    } catch (error: any) {
      toast.error(error.message || "Restore failed");
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <div className="p-6">
      {/* ====================== SEARCH BAR ====================== */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-3 max-w-md">
          <input
            type="text"
            placeholder="Search by subject name or code..."
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
              <th className="text-left px-6 py-4 font-semibold">Code</th>
              <th className="text-left px-6 py-4 font-semibold">Subject Name</th>
              <th className="text-left px-6 py-4 font-semibold">Department</th>
              <th className="text-left px-6 py-4 font-semibold">Semester</th>
              <th className="text-left px-6 py-4 font-semibold">Type</th>
              <th className="text-left px-6 py-4 font-semibold">Credits</th>
              <th className="text-left px-6 py-4 font-semibold">Deleted At</th>
              <th className="text-left px-6 py-4 font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center py-10">
                  Loading...
                </td>
              </tr>
            ) : subjects.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-10 text-gray-500">
                  No deleted subjects found
                </td>
              </tr>
            ) : (
              subjects.map((subject, index) => (
                <tr key={subject.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{page * size + index + 1}</td>
                  <td className="px-6 py-4 font-medium">{subject.subjectCode}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium">{subject.subjectName}</div>
                    {subject.description && (
                      <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                        {subject.description}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">{subject.department?.name || "N/A"}</td>
                  <td className="px-6 py-4">{subject.semester?.name || "N/A"}</td>
                  <td className="px-6 py-4">{subject.subjectType}</td>
                  <td className="px-6 py-4">{subject.credits}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {subject.deletedAt
                      ? new Date(subject.deletedAt).toLocaleString()
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          openRestoreDialog(subject.id, subject.subjectName)
                        }
                        className="border text-[#0D9488] border-[#8c8f8f31] hover:bg-[#0D9488] hover:text-white px-3 py-2.5 rounded-full text-sm flex items-center gap-1"
                        title="Restore"
                      >
                        <RotateCcw size={16} />
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

      {/* ====================== CUSTOM RESTORE DIALOG ====================== */}
      {restoreDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeRestoreDialog}
          />

          {/* Dialog */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
            {/* Close button */}
            <button
              onClick={closeRestoreDialog}
              disabled={isRestoring}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            >
              <X size={20} />
            </button>

            {/* Icon */}
            <div className="flex items-center justify-center w-14 h-14 mx-auto mb-4 rounded-full bg-teal-100">
              <RotateCcw className="text-[#0D9488]" size={28} />
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold text-center text-gray-900 mb-2">
              Restore Subject
            </h3>

            {/* Description */}
            <p className="text-center text-gray-600 mb-6">
              Are you sure you want to restore{" "}
              <span className="font-semibold text-gray-900">
                {selectedSubjectName}
              </span>
              ?
            </p>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={closeRestoreDialog}
                disabled={isRestoring}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRestore}
                disabled={isRestoring}
                className="flex-1 px-4 py-2.5 bg-[#0D9488] hover:bg-[#0F766E] text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isRestoring ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Restoring...
                  </>
                ) : (
                  "Restore"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeletedSubjectsTable;