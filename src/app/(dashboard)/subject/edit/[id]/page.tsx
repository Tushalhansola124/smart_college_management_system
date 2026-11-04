"use client";


import SubjectForm from "@/components/subject/subjectForm";
import { useParams } from "next/navigation";

const EditSubject = () => {
  const params = useParams();
  const editId = params.id as string;

  return (
    <div className="p-6">
      <div className="mx-7 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Edit Subject </h1>
      </div>

      <div className="mx-7">
        <SubjectForm editId={editId} />
      </div>
    </div>
  );
};

export default EditSubject;