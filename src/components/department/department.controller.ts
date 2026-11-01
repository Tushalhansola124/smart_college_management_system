
"use server";

import { API_ENDPOINTS } from "@/app/core/constants/api_endpoint";
import authOptions from "@/auth";
import axios from "axios";
import { getServerSession } from "next-auth";

// ======================================================
// DEPARTMENT INTERFACES
// ======================================================

export interface IDepartment {
  id: string;
  name: string;
  code: string;
  description: string;
  status: string;
  hodId: string | null;
  hodName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IDepartmentResponse {
  success: boolean;
  status: string;
  message: string;
  data: {
    content: IDepartment[];
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

export interface ISingleDepartmentResponse {
  success: boolean;
  status: string;
  message: string;
  data: IDepartment;
}

export interface ICreateDepartmentPayload {
  name: string;
  code: string;
  description: string;
  hodId: string | null;
}

export interface IUpdateDepartmentPayload {
  name?: string;
  code?: string;
  description?: string;
  hodId?: string | null;
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

const getAuthHeaders = async () => {
  const session = await getServerSession(authOptions);

  const token = (session?.user as any)?.accessToken;

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
// GET ALL DEPARTMENTS
// ======================================================

export const GetDepartments = async (
  page: number = 0,
  size: number = 10,
  search: string = ""
): Promise<IDepartmentResponse> => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.get(
      API_ENDPOINTS.department.getAll,
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
    console.error("GET DEPARTMENTS ERROR:", getErrorMessage(error, ""));
    throw new Error(
      getErrorMessage(error, "Failed to fetch departments")
    );
  }
};

// ======================================================
// CREATE DEPARTMENT
// ======================================================

export const CreateDepartment = async (
  data: ICreateDepartmentPayload
): Promise<ISingleDepartmentResponse> => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.post(
      API_ENDPOINTS.department.create,
      data,
      { headers }
    );

    return response.data;
  } catch (error) {
    console.error("CREATE DEPARTMENT ERROR:", getErrorMessage(error, ""));
    throw new Error(
      getErrorMessage(error, "Failed to create department")
    );
  }
};

// ======================================================
// GET DEPARTMENT BY ID
// ======================================================

export const GetDepartmentById = async (
  id: string
): Promise<ISingleDepartmentResponse> => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.get(
      `${API_ENDPOINTS.department.getById}${id}`,
      { headers }
    );

    return response.data;
  } catch (error) {
    console.error("GET DEPARTMENT ERROR:", getErrorMessage(error, ""));

    throw new Error(
      getErrorMessage(error, "Failed to fetch department")
    );
  }
};

// ======================================================
// UPDATE DEPARTMENT
// ======================================================

export const UpdateDepartment = async (
  id: string,
  data: IUpdateDepartmentPayload
): Promise<ISingleDepartmentResponse> => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.put(
      `${API_ENDPOINTS.department.update}${id}`,
      data,
      { headers }
    );

    return response.data;
  } catch (error) {
    console.error("UPDATE DEPARTMENT ERROR:", getErrorMessage(error, ""));

    throw new Error(
      getErrorMessage(error, "Failed to update department")
    );
  }
};

// ======================================================
// SOFT DELETE DEPARTMENT
// ======================================================

export const SoftDeleteDepartment = async (
  id: string
) => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.delete(
      `${API_ENDPOINTS.department.softDelete}${id}`,
      { headers }
    );

    return response.data;
  } catch (error) {
    console.error("DELETE DEPARTMENT ERROR:", getErrorMessage(error, ""));

    throw new Error(
      getErrorMessage(error, "Failed to delete department")
    );
  }
};

// ======================================================
// GET DELETED DEPARTMENTS
// ======================================================

export const GetDeletedDepartments = async (
  page: number = 0,
  size: number = 10
): Promise<IDepartmentResponse> => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.get(
      API_ENDPOINTS.department.getDeleted,
      {
        headers,
        params: { page, size },
      }
    );

    return response.data;
  } catch (error) {
    console.error("GET DELETED DEPARTMENTS ERROR:", getErrorMessage(error, ""));

    throw new Error(
      getErrorMessage(error, "Failed to fetch deleted departments")
    );
  }
};


// ======================================================
// RESTORE DEPARTMENT
// ======================================================

export const RestoreDepartment = async (
  id: string
): Promise<ISingleDepartmentResponse> => {
  try {
    const headers = await getAuthHeaders();

    // You can replace the hardcoded URL with your API_ENDPOINTS constant 
    // if you add `restore: "/api/departments/"` to your constants file.
    const response = await axiosInstance.patch(
      `/api/departments/${id}/restore`,
      {}, // Empty payload since the ID is in the URL
      { headers }
    );

    return response.data;
  } catch (error) {
    console.error("RESTORE DEPARTMENT ERROR:", getErrorMessage(error, ""));

    throw new Error(
      getErrorMessage(error, "Failed to restore department")
    );
  }
};