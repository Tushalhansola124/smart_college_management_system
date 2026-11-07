// import StudentsTable from '@/components/student/getAllStudent'


// const StudentComp = () => {
//   return (
//     <>
//         <StudentsTable/>
//     </>
//   )
// }

// export default StudentComp




"use client";


import StudentsTable from "@/components/student/getAllStudent";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

const StudentComp = () => {
  const router = useRouter();

  return (
    <div className="p-6">
      {/* ====================== HEADER ====================== */}
      <div className="flex justify-between mx-7 items-start mb-6">
        {/* Left Side */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Students </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage all student, schedules and enrollments from here.
          </p>
        </div>

        {/* Right Side Buttons */}
        <div className="flex items-center gap-3">
          {/* Add Course */}
          <button
            onClick={() => router.push("/student/create")}
            className="inline-flex items-center gap-2 border border-[#0D9488] text-[#0D9488] bg-white hover:bg-[#0D9488] hover:text-white px-4 py-2 rounded-full font-medium transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Student
          </button>

          {/* Deleted Courses */}
          <button
            onClick={() => router.push("/student/deleted")}
            className="inline-flex items-center gap-2 border border-[#0D9488] text-[#0D9488] bg-white hover:bg-[#0D9488] hover:text-white px-4 py-2 rounded-full font-medium transition-all"
          >
            <Trash2 className="w-4 h-4" />
            Deleted Student
          </button>
        </div>
      </div>

      {/* ====================== TABLE COMPONENT ====================== */}
       <StudentsTable/>
    </div>
  );
};

export default StudentComp;