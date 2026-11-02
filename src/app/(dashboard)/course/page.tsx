"use client";

import GetAllCourses from "@/components/course/getAllCourse";
import GetAllUsers from "@/components/user/getallUser";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

const UserComp = () => {
  const router = useRouter();

  return (
    <div className="p-6">
      {/* ====================== HEADER ====================== */}
      <div className="flex justify-between mx-7 items-start mb-6">
        {/* Left Side */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Courses</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage all courses, schedules and enrollments from here.
          </p>
        </div>

        {/* Right Side Buttons */}
        <div className="flex items-center gap-3">
          {/* Add Course */}
          <button
            onClick={() => router.push("/course/create")}
            className="inline-flex items-center gap-2 border border-[#0D9488] text-[#0D9488] bg-white hover:bg-[#0D9488] hover:text-white px-4 py-2 rounded-full font-medium transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Course
          </button>

          {/* Deleted Courses */}
          <button
            onClick={() => router.push("/course/deleted")}
            className="inline-flex items-center gap-2 border border-[#0D9488] text-[#0D9488] bg-white hover:bg-[#0D9488] hover:text-white px-4 py-2 rounded-full font-medium transition-all"
          >
            <Trash2 className="w-4 h-4" />
            Deleted Course
          </button>
        </div>
      </div>

      {/* ====================== TABLE COMPONENT ====================== */}
      <GetAllCourses />
    </div>
  );
};

export default UserComp;