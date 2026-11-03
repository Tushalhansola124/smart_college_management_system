
"use server";

import { API_ENDPOINTS } from "@/app/core/constants/api_endpoint";
import authOptions from "@/auth";
import axios from "axios";
import { getServerSession } from "next-auth";

// ======================================================
// SEMESTER INTERFACES
// ======================================================

export interface ISemester {
  id: string;
  name: string;
  semesterNumber: number;
  courseId: string;
  academicYearId: string;
  startDate: string;
  endDate: string;
  status: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ISemesterResponse {
  success: boolean;
  status: string;
  message: string;
  data: {
    content: ISemester[];
    pageable: {
      pageNumber: number;
      pageSize: number;
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
    numberOfElements: number;
    empty: boolean;
  };
}

export interface ISingleSemesterResponse {
  success: boolean;
  status: string;
  message: string;
  data: ISemester;
}

export interface ICreateSemesterPayload {
  name: string;
  semesterNumber: number;
  courseId: string;
  academicYearId: string;
  startDate: string;
  endDate: string;
}

export interface IUpdateSemesterPayload {
  name?: string;
  semesterNumber?: number;
  courseId?: string;
  academicYearId?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
}

// ======================================================
// AXIOS INSTANCE
// ======================================================

const axiosInstance = axios.create({
  baseURL: process.env.SERVER_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 15000,
});

// ======================================================
// TOKEN HELPER
// ======================================================

interface IAuthUser {
  accessToken?: string;
}

const getAuthHeaders = async () => {
  const session = await getServerSession(authOptions);

  const user = session?.user as IAuthUser | undefined;
  const token = user?.accessToken;

  if (!token) {
    throw new Error("Unauthorized. Please login again.");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

// ======================================================
// ERROR HELPER
// ======================================================

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      error.message ||
      fallback
    );
  }

  return error instanceof Error ? error.message : fallback;
};

// ======================================================
// GET ALL SEMESTERS
// ======================================================

export const GetSemesters = async (
  page: number = 0,
  size: number = 10
): Promise<ISemesterResponse> => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.get(
      API_ENDPOINTS.semester.getAll,
      {
        headers,
        params: { page, size },
      }
    );

    return response.data;
  } catch (error) {
    console.error("GET SEMESTERS ERROR:", getErrorMessage(error, ""));

    throw new Error(
      getErrorMessage(error, "Failed to fetch semesters")
    );
  }
};

// ======================================================
// CREATE SEMESTER
// ======================================================

export const CreateSemester = async (
  data: ICreateSemesterPayload
): Promise<ISingleSemesterResponse> => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.post(
      API_ENDPOINTS.semester.create,
      data,
      { headers }
    );

    return response.data;
  } catch (error) {
    console.error("CREATE SEMESTER ERROR:", getErrorMessage(error, ""));

    throw new Error(
      getErrorMessage(error, "Failed to create semester")
    );
  }
};

// ======================================================
// GET SEMESTER BY ID
// ======================================================

export const GetSemesterById = async (
  id: string
): Promise<ISingleSemesterResponse> => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.get(
      `${API_ENDPOINTS.semester.getById}${id}`,
      { headers }
    );

    return response.data;
  } catch (error) {
    console.error("GET SEMESTER ERROR:", getErrorMessage(error, ""));

    throw new Error(
      getErrorMessage(error, "Failed to fetch semester")
    );
  }
};

// ======================================================
// UPDATE SEMESTER
// ======================================================

export const UpdateSemester = async (
  id: string,
  data: IUpdateSemesterPayload
): Promise<ISingleSemesterResponse> => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.put(
      `${API_ENDPOINTS.semester.update}${id}`,
      data,
      { headers }
    );

    return response.data;
  } catch (error) {
    console.error("UPDATE SEMESTER ERROR:", getErrorMessage(error, ""));

    throw new Error(
      getErrorMessage(error, "Failed to update semester")
    );
  }
};

// ======================================================
// SOFT DELETE SEMESTER
// ======================================================

export const SoftDeleteSemester = async (
  id: string
) => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.delete(
      `${API_ENDPOINTS.semester.softDelete}${id}`,
      { headers }
    );

    return response.data;
  } catch (error) {
    console.error("DELETE SEMESTER ERROR:", getErrorMessage(error, ""));

    throw new Error(
      getErrorMessage(error, "Failed to delete semester")
    );
  }
};

// ======================================================
// GET DELETED SEMESTERS
// ======================================================

export const GetDeletedSemesters = async (
  page: number = 0,
  size: number = 10
): Promise<ISemesterResponse> => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.get(
      API_ENDPOINTS.semester.getDeleted,
      {
        headers,
        params: { page, size },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "GET DELETED SEMESTERS ERROR:",
      getErrorMessage(error, "")
    );

    throw new Error(
      getErrorMessage(error, "Failed to fetch deleted semesters")
    );
  }
};

// ======================================================
// RESTORE SEMESTER
// ======================================================

export const RestoreSemester = async (
  id: string
): Promise<ISingleSemesterResponse> => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.patch(
      `${API_ENDPOINTS.semester.restore}${id}/restore`,
      {},
      { headers }
    );

    return response.data;
  } catch (error) {
    console.error("RESTORE SEMESTER ERROR:", getErrorMessage(error, ""));

    throw new Error(
      getErrorMessage(error, "Failed to restore semester")
    );
  }
};
