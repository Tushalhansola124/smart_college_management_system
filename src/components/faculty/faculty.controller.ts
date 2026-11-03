"use server";

import { API_ENDPOINTS } from "@/app/core/constants/api_endpoint";
import authOptions from "@/auth";
import axios from "axios";
import { getServerSession } from "next-auth";

// ==================== Faculty Interface ====================

export interface IFaculty {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  employeeCode: string;
  departmentId: string;
  departmentName: string;
  designation: string;
  phone: string;
  qualification: string;
  joiningDate: string;
  employmentStatus: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// ==================== Faculty Response Interface ====================

export interface IFacultyResponse {
  success: boolean;
  status: string;
  message: string;
  data: {
    content: IFaculty[];
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

export interface ISingleFacultyResponse {
  success: boolean;
  status: string;
  message: string;
  data: IFaculty;
}

// ==================== Faculty Payload Interface ====================

export interface ICreateFacultyPayload {
  userId: string;
  employeeCode: string;
  departmentId: string;
  designation: string;
  phone: string;
  qualification: string;
  joiningDate: string;
}

export interface IUpdateFacultyPayload {
  userId?: string;
  employeeCode?: string;
  departmentId?: string;
  designation?: string;
  phone?: string;
  qualification?: string;
  joiningDate?: string;
  employmentStatus?: string;
}

// ==================== Axios Instance ====================

const axiosInstance = axios.create({
  baseURL: process.env.SERVER_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 15000,
});

// ==================== Auth Interface ====================

interface IAuthUser {
  accessToken?: string;
}

// ==================== Auth Headers ====================

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

// ==================== Error Handler ====================

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || fallback;
  }

  return error instanceof Error ? error.message : fallback;
};

// ==================== Get All Faculties ====================

export const GetFaculties = async (
  page = 0,
  size = 10,
  search = ""
): Promise<IFacultyResponse> => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.get(
      API_ENDPOINTS.faculty.getAll,
      {
        headers,
        params: {
          page,
          size,
          ...(search ? { search } : {}),
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch faculties"));
  }
};

// ==================== Create Faculty ====================

export const CreateFaculty = async (
  data: ICreateFacultyPayload
) => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.post(
      API_ENDPOINTS.faculty.create,
      data,
      { headers }
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to create faculty"));
  }
};

// ==================== Get Faculty By ID ====================

export const GetFacultyById = async (
  id: string
): Promise<ISingleFacultyResponse> => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.get(
      `${API_ENDPOINTS.faculty.getById}${id}`,
      { headers }
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch faculty"));
  }
};

// ==================== Update Faculty ====================

export const UpdateFaculty = async (
  id: string,
  data: IUpdateFacultyPayload
) => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.put(
      `${API_ENDPOINTS.faculty.update}${id}`,
      data,
      { headers }
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to update faculty"));
  }
};

// ==================== Soft Delete Faculty ====================

export const SoftDeleteFaculty = async (id: string) => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.delete(
      `${API_ENDPOINTS.faculty.softDelete}${id}`,
      { headers }
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to delete faculty"));
  }
};

// ==================== Get Deleted Faculties ====================

export const GetDeletedFaculties = async (
  page = 0,
  size = 10
): Promise<IFacultyResponse> => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.get(
      API_ENDPOINTS.faculty.getDeleted,
      {
        headers,
        params: { page, size },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Failed to fetch deleted faculties")
    );
  }
};

// ==================== Restore Faculty ====================

export const RestoreFaculty = async (id: string) => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.patch(
      `${API_ENDPOINTS.faculty.restore}${id}/restore`,
      {},
      { headers }
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to restore faculty"));
  }
};