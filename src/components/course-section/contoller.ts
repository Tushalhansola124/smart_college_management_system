"use server";

import { API_ENDPOINTS } from "@/app/core/constants/api_endpoint";
import authOptions from "@/auth";
import axios from "axios";
import { getServerSession } from "next-auth";

// ======================================================
// COURSE SECTION INTERFACES
// ======================================================

export interface ICourse {
  id: string;
  name: string;
}

export interface ISemester {
  id: string;
  name: string;
}

export interface IAcademicYear {
  id: string;
  name: string;
}

export interface IDepartment {
  id: string;
  name: string;
}

export interface IClassSection {
  id: string;
  name: string;
  course: ICourse;
  semester: ISemester;
  academicYear: IAcademicYear;
  department: IDepartment;
  status: string;
  deleted: boolean;
  deletedAt: any;
  createdAt: string;
  updatedAt: any;
}

export interface IClassSectionResponse {
  success: boolean;
  status: string;
  message: string;
  data: {
    content: IClassSection[];
    pageable: {
      pageNumber: number;
      pageSize: number;
      sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
      };
      offset: number;
      paged: boolean;
      unpaged: boolean;
    };
    last: boolean;
    totalPages: number;
    totalElements: number;
    first: boolean;
    size: number;
    number: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    numberOfElements: number;
    empty: boolean;
  };
}

export interface ISingleClassSectionResponse {
  success: boolean;
  status: string;
  message: string;
  data: IClassSection;
}

export interface CreateClassSectionPayload {
  name: string;
  courseId: string;
  semesterId: string;
  academicYearId: string;
  departmentId: string;
  status?:string;
}

export interface UpdateClassSectionPayload {
  name?: string;
  courseId?: string;
  semesterId?: string;
  academicYearId?: string;
  departmentId?: string;
  status?: string;
}

// ======================================================
// AXIOS INSTANCE
// ======================================================

const axiosInstance = axios.create({
  baseURL: process.env.SERVER_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ======================================================
// TOKEN HELPER
// ======================================================

const getAuthHeaders = async () => {
  const session = await getServerSession(authOptions);

  const token = (session?.user as any)?.accessToken;

  if (!token) {
    throw new Error("Unauthorized");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

// ======================================================
// GET ALL CLASS SECTIONS
// ======================================================

export const GetClassSections = async (
  page: number = 0,
  size: number = 10,
  search: string = ""
): Promise<IClassSectionResponse> => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.get(
      `${API_ENDPOINTS.courseSections.getAll}?page=${page}&size=${size}&search=${search}`,
      { headers }
    );

    return response.data;
  } catch (error: any) {
    console.log("GET CLASS SECTIONS ERROR:", error);
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Failed To Fetch Class Sections"
    );
  }
};

// ======================================================
// GET DELETED CLASS SECTIONS
// ======================================================

export const GetDeletedClassSections = async (
  page: number = 0,
  size: number = 10,
  search: string = ""
): Promise<IClassSectionResponse> => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.get(
      `${API_ENDPOINTS.courseSections.getDeleted}?page=${page}&size=${size}&search=${search}`,
      { headers }
    );

    return response.data;
  } catch (error: any) {
    console.log("GET DELETED CLASS SECTIONS ERROR:", error);
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Failed To Fetch Deleted Class Sections"
    );
  }
};

// ======================================================
// CREATE CLASS SECTION
// ======================================================

export const CreateClassSection = async (data: CreateClassSectionPayload) => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.post(
      API_ENDPOINTS.courseSections.create,
      data,
      {
        headers,
      }
    );

    return response.data;
  } catch (error: any) {
    console.log("CREATE CLASS SECTION ERROR:", error);

    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Create Class Section Failed"
    );
  }
};

// ======================================================
// GET CLASS SECTION BY ID
// ======================================================

export const GetClassSectionById = async (
  id: string
): Promise<ISingleClassSectionResponse> => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.get(
      `${API_ENDPOINTS.courseSections.getById}${id}`,
      {
        headers,
      }
    );

    return response.data;
  } catch (error: any) {
    console.log("GET CLASS SECTION BY ID ERROR:", error);

    if (error.response?.status === 404) {
      throw new Error("Class Section not found");
    }

    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    }

    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Failed To Fetch Class Section"
    );
  }
};

// ======================================================
// UPDATE CLASS SECTION
// ======================================================

export const UpdateClassSection = async (
  id: string,
  data: UpdateClassSectionPayload
) => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.put(
      `${API_ENDPOINTS.courseSections.update}${id}`,
      data,
      {
        headers,
      }
    );

    return response.data;
  } catch (error: any) {
    console.log("UPDATE CLASS SECTION ERROR:", error);

    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Update Class Section Failed"
    );
  }
};

// ======================================================
// SOFT DELETE CLASS SECTION
// ======================================================

export const SoftDeleteClassSection = async (id: string) => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.delete(
      `${API_ENDPOINTS.courseSections.softDelete}${id}`,
      {
        headers,
      }
    );

    return response.data;
  } catch (error: any) {
    console.log("SOFT DELETE CLASS SECTION ERROR:", error);

    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Soft Delete Class Section Failed"
    );
  }
};

// ======================================================
// RESTORE CLASS SECTION
// ======================================================

export const RestoreClassSection = async (id: string) => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.patch(
      `${API_ENDPOINTS.courseSections.restore}${id}/restore`,
      {},
      {
        headers,
      }
    );

    return response.data;
  } catch (error: any) {
    console.log("RESTORE CLASS SECTION ERROR:", error);

    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Restore Class Section Failed"
    );
  }
};