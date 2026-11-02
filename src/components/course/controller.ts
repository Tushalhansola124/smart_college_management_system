"use server";

import { API_ENDPOINTS } from "@/app/core/constants/api_endpoint";
import authOptions from "@/auth";
import axios from "axios";
import { getServerSession } from "next-auth";

// ======================================================
// COURSE INTERFACES
// ======================================================

export interface ICourse {
  id: string;
  name: string;
  code: string;
  deletedAt:string;
  departmentId:string;
  durationYears:number;
  totalSemesters:number;
  description: string;
  credits: number;
  departmentName:string;
  status: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICourseResponse {
  success: boolean;
  status: string;
  message: string;
  data: {
    content: ICourse[];
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

export interface ISingleCourseResponse {
  success: boolean;
  status: string;
  message: string;
  data: ICourse;
}

export interface CreateCoursePayload {
  name: string;
  code: string;
  totalSemesters:number;
  departmentId:string;
  description?: string;
  durationYears:number;
  credits?: number;
}

export interface UpdateCoursePayload {
  name?: string;
  code?: string;
  totalSemesters:number;
  durationYears:number;
  departmentId:string;
  description?: string;
  credits?: number;
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
// GET ALL COURSES
// ======================================================

export const GetCourses = async (
  page: number = 0,
  size: number = 10,
  search: string = ""
): Promise<ICourseResponse> => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.get(
      `${API_ENDPOINTS.course.getAll}?page=${page}&size=${size}&search=${search}`,
      { headers }
    );

    return response.data;
  } catch (error: any) {
    console.log("GET COURSES ERROR:", error);
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Failed To Fetch Courses"
    );
  }
};

// ======================================================
// GET DELETED COURSES
// ======================================================

export const GetDeletedCourses = async (
  page: number = 0,
  size: number = 10,
  search: string = ""
): Promise<ICourseResponse> => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.get(
      `${API_ENDPOINTS.course.getDeleted}?page=${page}&size=${size}&search=${search}`,
      { headers }
    );

    return response.data;
  } catch (error: any) {
    console.log("GET DELETED COURSES ERROR:", error);
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Failed To Fetch Deleted Courses"
    );
  }
};

// ======================================================
// CREATE COURSE
// ======================================================

export const CreateCourse = async (data: CreateCoursePayload) => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.post(
      API_ENDPOINTS.course.create,
      data,
      {
        headers,
      }
    );

    return response.data;
  } catch (error: any) {
    console.log("CREATE COURSE ERROR:", error);

    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Create Course Failed"
    );
  }
};

// ======================================================
// GET COURSE BY ID
// ======================================================

export const GetCourseById = async (
  id: string
): Promise<ISingleCourseResponse> => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.get(
      `${API_ENDPOINTS.course.getById}${id}`,
      {
        headers,
      }
    );

    return response.data;
  } catch (error: any) {
    console.log("GET COURSE BY ID ERROR:", error);

    if (error.response?.status === 404) {
      throw new Error("Course not found");
    }

    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    }

    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Failed To Fetch Course"
    );
  }
};

// ======================================================
// UPDATE COURSE
// ======================================================

export const UpdateCourse = async (
  id: string,
  data: UpdateCoursePayload
) => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.put(
      `${API_ENDPOINTS.course.update}${id}`,
      data,
      {
        headers,
      }
    );

    return response.data;
  } catch (error: any) {
    console.log("UPDATE COURSE ERROR:", error);

    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Update Course Failed"
    );
  }
};

// ======================================================
// SOFT DELETE COURSE
// ======================================================

export const SoftDeleteCourse = async (id: string) => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.delete(
      `${API_ENDPOINTS.course.softDelete}${id}`,
      {
        headers,
      }
    );

    return response.data;
  } catch (error: any) {
    console.log("SOFT DELETE COURSE ERROR:", error);

    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Soft Delete Course Failed"
    );
  }
};

// ======================================================
// RESTORE COURSE
// ======================================================

export const RestoreCourse = async (id: string) => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.patch(
      `${API_ENDPOINTS.course.restore}${id}/restore`,
      {},
      {
        headers,
      }
    );

    return response.data;
  } catch (error: any) {
    console.log("RESTORE COURSE ERROR:", error);

    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Restore Course Failed"
    );
  }
};