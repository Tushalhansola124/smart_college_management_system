"use server";

import { API_ENDPOINTS } from "@/app/core/constants/api_endpoint";
import authOptions from "@/auth";
import axios from "axios";
import { getServerSession } from "next-auth";

// ======================================================
// ACADEMIC YEAR INTERFACES
// ======================================================

export interface IAcademicYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  current: boolean;
}

export interface IAcademicYearResponse {
  success: boolean;
  status: string;
  message: string;
  data: {
    content: IAcademicYear[];
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

export interface ISingleAcademicYearResponse {
  success: boolean;
  status: string;
  message: string;
  data: IAcademicYear;
}

export interface ICreateAcademicYearPayload {
  name: string;
  startDate: string;
  endDate: string;
}

export interface IUpdateAcademicYearPayload {
  name?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
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
// GET ALL ACADEMIC YEARS
// ======================================================

export const GetAcademicYears = async (
  page: number = 0,
  size: number = 10,
  search: string = ""
): Promise<IAcademicYearResponse> => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.get(
      API_ENDPOINTS.academicYear.getAll,
      {
        headers,
        params: {
          page,
          size,
          ...(search.trim() ? { search: search.trim() } : {}),
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "GET ACADEMIC YEARS ERROR:",
      getErrorMessage(error, "")
    );

    throw new Error(
      getErrorMessage(error, "Failed to fetch academic years")
    );
  }
};

// ======================================================
// CREATE ACADEMIC YEAR
// ======================================================

export const CreateAcademicYear = async (
  data: ICreateAcademicYearPayload
): Promise<ISingleAcademicYearResponse> => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.post(
      API_ENDPOINTS.academicYear.create,
      data,
      { headers }
    );

    return response.data;
  } catch (error) {
    console.error(
      "CREATE ACADEMIC YEAR ERROR:",
      getErrorMessage(error, "")
    );

    throw new Error(
      getErrorMessage(error, "Failed to create academic year")
    );
  }
};

// ======================================================
// GET ACADEMIC YEAR BY ID
// ======================================================

export const GetAcademicYearById = async (
  id: string
): Promise<ISingleAcademicYearResponse> => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.get(
      `${API_ENDPOINTS.academicYear.getById}${id}`,
      { headers }
    );

    return response.data;
  } catch (error) {
    console.error(
      "GET ACADEMIC YEAR ERROR:",
      getErrorMessage(error, "")
    );

    throw new Error(
      getErrorMessage(error, "Failed to fetch academic year")
    );
  }
};

// ======================================================
// UPDATE ACADEMIC YEAR
// ======================================================

export const UpdateAcademicYear = async (
  id: string,
  data: IUpdateAcademicYearPayload
): Promise<ISingleAcademicYearResponse> => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.put(
      `${API_ENDPOINTS.academicYear.update}${id}`,
      data,
      { headers }
    );

    return response.data;
  } catch (error) {
    console.error(
      "UPDATE ACADEMIC YEAR ERROR:",
      getErrorMessage(error, "")
    );

    throw new Error(
      getErrorMessage(error, "Failed to update academic year")
    );
  }
};

// ======================================================
// SOFT DELETE ACADEMIC YEAR
// ======================================================

export const SoftDeleteAcademicYear = async (
  id: string
) => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.delete(
      `${API_ENDPOINTS.academicYear.softDelete}${id}`,
      { headers }
    );

    return response.data;
  } catch (error) {
    console.error(
      "DELETE ACADEMIC YEAR ERROR:",
      getErrorMessage(error, "")
    );

    throw new Error(
      getErrorMessage(error, "Failed to delete academic year")
    );
  }
};

// ======================================================
// GET DELETED ACADEMIC YEARS
// ======================================================

export const GetDeletedAcademicYears = async (
  page: number = 0,
  size: number = 10
): Promise<IAcademicYearResponse> => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.get(
      API_ENDPOINTS.academicYear.getDeleted,
      {
        headers,
        params: { page, size },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "GET DELETED ACADEMIC YEARS ERROR:",
      getErrorMessage(error, "")
    );

    throw new Error(
      getErrorMessage(error, "Failed to fetch deleted academic years")
    );
  }
};

// ======================================================
// RESTORE ACADEMIC YEAR
// ======================================================

export const RestoreAcademicYear = async (
  id: string
): Promise<ISingleAcademicYearResponse> => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.patch(
      `/api/academic-years/${id}/restore`,
      {},
      { headers }
    );

    return response.data;
  } catch (error) {
    console.error(
      "RESTORE ACADEMIC YEAR ERROR:",
      getErrorMessage(error, "")
    );

    throw new Error(
      getErrorMessage(error, "Failed to restore academic year")
    );
  }
};