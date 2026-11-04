// import GetAllSubject from "@/components/subject/getAllSubject"


// const SubjectComp = () => {
//   return (
//    <GetAllSubject/>
//   )
// }

// export default SubjectComp


"use client";
import GetAllSubject from "@/components/subject/getAllSubject";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

const SubjectComp = () => {
  const router = useRouter();

  return (
    <div className="p-6">
      {/* ====================== HEADER ====================== */}
      <div className="flex justify-between mx-7 items-start mb-6">
        {/* Left Side */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Subject</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage all subjects, schedules and enrollments from here.
          </p>
        </div>

        {/* Right Side Buttons */}
        <div className="flex items-center gap-3">
          {/* Add Course */}
          <button
            onClick={() => router.push("/subject/create")}
            className="inline-flex items-center gap-2 border border-[#0D9488] text-[#0D9488] bg-white hover:bg-[#0D9488] hover:text-white px-4 py-2 rounded-full font-medium transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Subject
          </button>

          {/* Deleted Subjects */}
          <button
            onClick={() => router.push("/subject/deleted")}
            className="inline-flex items-center gap-2 border border-[#0D9488] text-[#0D9488] bg-white hover:bg-[#0D9488] hover:text-white px-4 py-2 rounded-full font-medium transition-all"
          >
            <Trash2 className="w-4 h-4" />
            Deleted Subject
          </button>
        </div>
      </div>

      {/* ====================== TABLE COMPONENT ====================== */}
      <GetAllSubject/>
    </div>
  );
};

export default SubjectComp;