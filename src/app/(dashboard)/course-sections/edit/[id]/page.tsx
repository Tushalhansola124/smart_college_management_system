"use client";

import ClassSectionForm from "@/components/course-section/courseForm";
import { useParams } from "next/navigation";

const EditCourseSection = () => {
  const params = useParams();
  const editId = params.id as string;

  return (
    <div className="p-6">
      <div className="mx-7 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Edit Course Section</h1>
      </div>

      <div className="mx-7">
        <ClassSectionForm editId={editId} />
      </div>
    </div>
  );
};

export default EditCourseSection;