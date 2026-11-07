"use server";

import { API_ENDPOINTS } from "@/app/core/constants/api_endpoint";
import authOptions from "@/auth";
import axios from "axios";
import { getServerSession } from "next-auth";

// ==================== Student Interface ====================

export interface IStudent {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  studentCode: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  address: string;
  department: {
    id: string;
    name: string;
  };
  course: {
    id: string;
    name: string;
  };
  semester: {
    id: string;
    name: string;
  };
  section: any;
  admissionDate: string;
  enrollmentStatus: string;
  guardianName: string;
  guardianPhone: string;
  deleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// ==================== Pagination Interface ====================

export interface IStudentResponse {
  success: boolean;
  status: string;
  message: string;
  data: {
    content: IStudent[];
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

export interface ISingleStudentResponse {
  success: boolean;
  status: string;
  message: string;
  data: IStudent;
}

// ==================== Payload Interfaces ====================

export interface ICreateStudentPayload {
  fullName: string;
  email: string;
  studentCode: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  address?: string;
  departmentId: string;
  courseId: string;
  semesterId: string;
  section?: any;
  admissionDate: string;
  enrollmentStatus?: string;
  guardianName?: string;
  guardianPhone?: string;
}

export interface IUpdateStudentPayload {
  fullName?: string;
  email?: string;
  studentCode?: string;
  dateOfBirth?: string;
  gender?: string;
  phone?: string;
  address?: string;
  departmentId?: string;
  courseId?: string;
  semesterId?: string;
  section?: any;
  admissionDate?: string;
  enrollmentStatus?: string;
  guardianName?: string;
  guardianPhone?: string;
}

export interface IUpdateStudentStatusPayload {
  enrollmentStatus: "ACTIVE" | "INACTIVE" | "GRADUATED" | "DROPPED";
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

// ==================== Get All Students ====================

export const GetStudents = async (
  page = 0,
  size = 10,
  search: string = ""
): Promise<IStudentResponse> => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.get(API_ENDPOINTS.student.getAll, {
      headers,
      params: { page, size, search },
    });

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch students"));
  }
};

// ==================== Create Student ====================

export const CreateStudent = async (data: ICreateStudentPayload) => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.post(
      API_ENDPOINTS.student.create,
      data,
      { headers }
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to create student"));
  }
};

// ==================== Get Student By ID ====================

export const GetStudentById = async (
  id: string
): Promise<ISingleStudentResponse> => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.get(
      `${API_ENDPOINTS.student.getById}${id}`,
      { headers }
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch student"));
  }
};

// ==================== Update Student ====================

export const UpdateStudent = async (
  id: string,
  data: IUpdateStudentPayload
) => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.put(
      `${API_ENDPOINTS.student.update}${id}`,
      data,
      { headers }
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to update student"));
  }
};

// ==================== Soft Delete Student ====================

export const SoftDeleteStudent = async (id: string) => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.delete(
      `${API_ENDPOINTS.student.softDelete}${id}`,
      { headers }
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to delete student"));
  }
};

// ==================== Get Deleted Students ====================

export const GetDeletedStudents = async (
  page = 0,
  size = 10
): Promise<IStudentResponse> => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.get(
      API_ENDPOINTS.student.getDeleted,
      {
        headers,
        params: { page, size },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Failed to fetch deleted students")
    );
  }
};

// ==================== Restore Student ====================

export const RestoreStudent = async (id: string) => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.patch(
      `${API_ENDPOINTS.student.restore}${id}/restore`,
      {},
      { headers }
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to restore student"));
  }
};