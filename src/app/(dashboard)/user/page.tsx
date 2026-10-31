"use client";

import GetAllUsers from "@/components/user/getallUser";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

const UserComp = () => {
  const router = useRouter();

  return (
    <div className="p-6 ">
      {/* ====================== HEADER (Alag) ====================== */}
      <div className="flex justify-between  mx-7 items-start mb-6">
        {/* Left Side */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Users</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage all users, roles and permissions from here.
          </p>
        </div>

        {/* Right Side Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard/users/create")}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            <Plus className="w-4 h-4" />
            Add User
          </button>

          <button
            onClick={() => router.push("/dashboard/users/deleted")}
            className="inline-flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg font-medium transition"
          >
         <Trash2 className="w-4 h-4" />
            Deleted Users
          </button>
        </div>
      </div>

      {/* ====================== TABLE COMPONENT ====================== */}
      <GetAllUsers />
    </div>
  );
};

export default UserComp;