"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import { RotateCcw, X } from "lucide-react";
import { GetDeletedAssignments, IAssignment, RestoreAssignment } from "./contoller";


const DeletedAssignmentsTable = () => {
  const [assignments, setAssignments] = useState<IAssignment[]>([]);
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
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [selectedAssignmentName, setSelectedAssignmentName] = useState("");
  const [isRestoring, setIsRestoring] = useState(false);

  // ====================== FETCH DELETED ASSIGNMENTS ======================
  const fetchDeletedAssignments = async () => {
    try {
      setLoading(true);
      const res = await GetDeletedAssignments(page, size, search);

      if (res.success && res.data) {
        setAssignments(res.data.content);
        setTotalElements(res.data.totalElements || 0);
        setTotalPages(res.data.totalPages || 0);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to load deleted assignments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeletedAssignments();
  }, [page, search]);

  // ====================== SEARCH HANDLER ======================
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    setSearch(searchInput.trim());
  };

  // ====================== OPEN RESTORE DIALOG ======================
  const openRestoreDialog = (id: string, name: string) => {
    setSelectedAssignmentId(id);
    setSelectedAssignmentName(name);
    setRestoreDialogOpen(true);
  };

  // ====================== CLOSE RESTORE DIALOG ======================
  const closeRestoreDialog = () => {
    if (isRestoring) return;
    setRestoreDialogOpen(false);
    setSelectedAssignmentId(null);
    setSelectedAssignmentName("");
  };

  // ====================== CONFIRM RESTORE ======================
  const handleConfirmRestore = async () => {
    if (!selectedAssignmentId) return;

    try {
      setIsRestoring(true);
      await RestoreAssignment(selectedAssignmentId);
      toast.success("Assignment restored successfully");
      closeRestoreDialog();
      fetchDeletedAssignments();
    } catch (error: any) {
      toast.error(error.message || "Restore failed");
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      {/* ====================== SEARCH BAR ====================== */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3 max-w-md">
          <input
            type="text"
            placeholder="Search by faculty, subject, section..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-2">
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
        </div>
      </form>

      {/* ====================== TABLE ====================== */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="text-left px-4 sm:px-6 py-4 font-semibold">#</th>
                <th className="text-left px-4 sm:px-6 py-4 font-semibold">Faculty</th>
                <th className="text-left px-4 sm:px-6 py-4 font-semibold">Subject</th>
                <th className="text-left px-4 sm:px-6 py-4 font-semibold">Academic Year</th>
                <th className="text-left px-4 sm:px-6 py-4 font-semibold">Semester</th>
                <th className="text-left px-4 sm:px-6 py-4 font-semibold">Section</th>
                <th className="text-left px-4 sm:px-6 py-4 font-semibold">Assigned Date</th>
                <th className="text-left px-4 sm:px-6 py-4 font-semibold">Deleted At</th>
                <th className="text-left px-4 sm:px-6 py-4 font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center py-10">
                    Loading...
                  </td>
                </tr>
              ) : assignments.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-gray-500">
                    No deleted assignments found
                  </td>
                </tr>
              ) : (
                assignments.map((item, index) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-4">
                      {page * size + index + 1}
                    </td>

                    {/* Faculty */}
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium">{item.facultyName}</span>
                        <span className="text-sm text-gray-500">
                          {item.employeeCode}
                        </span>
                      </div>
                    </td>

                    {/* Subject */}
                    <td className="px-4 sm:px-6 py-4">
                      {item.subject?.name || "N/A"}
                    </td>

                    {/* Academic Year */}
                    <td className="px-4 sm:px-6 py-4">
                      {item.academicYear?.name || "N/A"}
                    </td>

                    {/* Semester */}
                    <td className="px-4 sm:px-6 py-4">
                      {item.semester?.name || "N/A"}
                    </td>

                    {/* Section */}
                    <td className="px-4 sm:px-6 py-4">
                      {item.classSection?.name || "N/A"}
                    </td>

                    {/* Assigned Date */}
                    <td className="px-4 sm:px-6 py-4 text-sm">
                      {item.assignedDate
                        ? new Date(item.assignedDate).toLocaleDateString()
                        : "N/A"}
                    </td>

                    {/* Deleted At */}
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-600">
                      {item.deletedAt
                        ? new Date(item.deletedAt).toLocaleString()
                        : "N/A"}
                    </td>

                    {/* Actions - Restore */}
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            openRestoreDialog(
                              item.id,
                              `${item.facultyName} - ${item.subject?.name}`
                            )
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
        </div>

        {/* ====================== FOOTER ====================== */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 px-4 sm:px-6 py-4 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            Total Records:{" "}
            <span className="font-semibold">{totalElements}</span>
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
            <div className="flex items-center justify-center w-14 h-14 mx-auto mb-4 rounded-full bg-green-100">
              <RotateCcw className="text-green-600" size={28} />
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold text-center text-gray-900 mb-2">
              Restore Assignment
            </h3>

            {/* Description */}
            <p className="text-center text-gray-600 mb-6">
              Are you sure you want to restore{" "}
              <span className="font-semibold text-gray-900">
                {selectedAssignmentName}
              </span>
              ? This assignment will be moved back to the active list.
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
                className="flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
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

export default DeletedAssignmentsTable;