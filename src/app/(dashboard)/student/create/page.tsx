// import StudentForm from "@/components/student/StudentForm"

// const CreateStudent = () => {
//   return (
//     <>
//         <StudentForm/>
//     </>
//   )
// }

// export default CreateStudent


"use client";


import StudentForm from "@/components/student/StudentForm";
import { MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const CreateStudent = () => {
  const router = useRouter();

  return (
    <div className="p-6">
      {/* ====================== HEADER ====================== */}
      <div className="flex justify-between mx-7 items-start mb-6">
        {/* Left Side */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Create Student
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Fill the form below to create a new Student.
          </p>
        </div>

        {/* Right Side Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="inline-flex bg-[#0D9488] text-white items-center border border-[#0D9488] gap-2 hover:text-white hover:bg-gradient-to-r from-[#0F766E] to-[#28c2b5] hover:border-none px-4 py-2 rounded-full font-medium"
          >
            <MoveLeft className="w-4 h-4" />
            Back
          </button>
        </div>
      </div>

      {/* ====================== FORM ====================== */}
      <div className="mx-7">
         <StudentForm/>
      </div>
    </div>
  );
};

export default CreateStudent;