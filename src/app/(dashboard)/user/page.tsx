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
            onClick={() => router.push("/user/create")}
            className="inline-flex text-[#0D9488] items-center border border-[#0D9488] gap-2 bg-white  hover:text-white hover:bg-linear-to-r from-[#0F766E] to-[#28c2b5] hover:border-none px-4 py-2  rounded-full font-medium"
          >
            <Plus className="w-4 h-4" />
            Add User
          </button>

          <button
            onClick={() => router.push("/user/deleted")}
            className="inline-flex text-[#0D9488] items-center border border-[#0D9488] gap-2 bg-white  hover:bg-linear-to-r from-[#0F766E] to-[#28c2b5] hover:text-white hover:border-none px-4 py-2 rounded-full font-medium "
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