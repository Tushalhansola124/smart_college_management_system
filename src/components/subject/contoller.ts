"use server";

import { API_ENDPOINTS } from "@/app/core/constants/api_endpoint";
import authOptions from "@/auth";
import axios from "axios";
import { getServerSession } from "next-auth";

// ==================== Subject Interface ====================

export interface ISubject {
  id: string;
  subjectCode: string;
  subjectName: string;
  description: string;
  department: {
    id: string;
    name: string;
  };
  semester: {
    id: string;
    name: string;
  };
  subjectType: string;
  credits: number;
  status: string;
  deleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string | null;
}

// ==================== Pagination Interface ====================

export interface ISubjectResponse {
  success: boolean;
  status: string;
  message: string;
  data: {
    content: ISubject[];
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
    size: number;
    number: number;
    first: boolean;
    numberOfElements: number;
    empty: boolean;
  };
}

// ==================== Single Response Interface ====================

export interface ISingleSubjectResponse {
  success: boolean;
  status: string;
  message: string;
  data: ISubject;
}

// ==================== Payload Interfaces ====================

export interface ICreateSubjectPayload {
  subjectCode: string;
  subjectName: string;
  description?: string;
  departmentId: string;
  semesterId: string;
  subjectType: string;
  credits: number;
  status?: string;
}

export interface IUpdateSubjectPayload {
  subjectCode?: string;
  subjectName?: string;
  description?: string;
  departmentId?: string;
  semesterId?: string;
  subjectType?: string;
  credits?: number;
  status?: string;
}

export interface IUpdateSubjectStatusPayload {
  status: "ACTIVE" | "INACTIVE";
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

// ==================== Get All Subjects ====================

export const GetSubjects = async (
  page = 0,
  size = 10,
  search: string = ""
): Promise<ISubjectResponse> => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.get(API_ENDPOINTS.subject.getAll, {
      headers,
      params: { page, size, search },
    });

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch subjects"));
  }
};

// ==================== Create Subject ====================

export const CreateSubject = async (data: ICreateSubjectPayload) => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.post(
      API_ENDPOINTS.subject.create,
      data,
      { headers }
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to create subject"));
  }
};

// ==================== Get Subject By ID ====================

export const GetSubjectById = async (
  id: string
): Promise<ISingleSubjectResponse> => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.get(
      `${API_ENDPOINTS.subject.getById}${id}`,
      { headers }
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch subject"));
  }
};

// ==================== Update Subject ====================

export const UpdateSubject = async (
  id: string,
  data: IUpdateSubjectPayload
) => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.put(
      `${API_ENDPOINTS.subject.update}${id}`,
      data,
      { headers }
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to update subject"));
  }
};

// ==================== Soft Delete Subject ====================

export const SoftDeleteSubject = async (id: string) => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.delete(
      `${API_ENDPOINTS.subject.softDelete}${id}`,
      { headers }
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to delete subject"));
  }
};

// ==================== Get Deleted Subjects ====================

export const GetDeletedSubjects = async (
  page = 0,
  size = 10
): Promise<ISubjectResponse> => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.get(
      API_ENDPOINTS.subject.getDeleted,
      {
        headers,
        params: { page, size },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Failed to fetch deleted subjects")
    );
  }
};

// ==================== Restore Subject ====================

export const RestoreSubject = async (id: string) => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.patch(
      `${API_ENDPOINTS.subject.restore}${id}/restore`,
      {},
      { headers }
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to restore subject"));
  }
};

