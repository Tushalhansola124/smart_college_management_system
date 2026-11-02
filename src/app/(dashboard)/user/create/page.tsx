"use client";

import UserForm from "@/components/user/userForm";
import { useRouter, useParams } from "next/navigation";
import { MoveLeft } from "lucide-react";

const UserFormComp = () => {
  const router = useRouter();
  const params = useParams();
  const isEditMode = Boolean(params?.id);

  return (
    <div className="p-6 min-h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        {/* Left - Heading */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditMode ? "Edit User" : "Add User"}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {isEditMode
              ? "Update the user information below"
              : "Fill in the details to create a new user"}
          </p>
        </div>

        {/* Right - Back Button */}
       <button
            onClick={() => router.back()}
            className="inline-flex bg-[#0D9488] text-white items-center border border-[#0D9488] gap-2   hover:text-white hover:bg-linear-to-r from-[#0F766E] to-[#28c2b5] hover:border-none px-4 py-2  rounded-full font-medium"
          >
            <MoveLeft className="w-4 h-4" />
           Back
          </button>
      </div>

      {/* Centered Form */}
      <div className="flex justify-center">
        <UserForm />
      </div>
    </div>
  );
};

export default UserFormComp;