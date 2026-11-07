// import AssignmentForm from '@/components/assignment/assigmentForm'
// import React from 'react'

// const page = () => {
//   return (
//     <>
//         <AssignmentForm/>
//     </>
//   )
// }

// export default page




"use client";

import AssignmentForm from "@/components/assignment/assigmentForm";


import { MoveLeft  } from "lucide-react";
import { useRouter } from "next/navigation";

const UpdateForm = () => {
  const router = useRouter();

  return (
    <div className="p-6 ">
      {/* ====================== HEADER (Alag) ====================== */}
      <div className="flex justify-between  mx-7 items-start mb-6">
        {/* Left Side */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Update Assignments</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage all Edit assignments from here.
          </p>
        </div>

        {/* Right Side Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="inline-flex bg-[#0D9488] text-white items-center border border-[#0D9488] gap-2   hover:text-white hover:bg-linear-to-r from-[#0F766E] to-[#28c2b5] hover:border-none px-4 py-2  rounded-full font-medium"
          >
            <MoveLeft className="w-4 h-4" />
           Back
          </button>

         
        </div>
      </div>

      {/* ====================== TABLE COMPONENT ====================== */}
      <AssignmentForm/>
    </div>
  );
};

export default UpdateForm;