"use server";

import { API_ENDPOINTS } from "@/app/core/constants/api_endpoint";
import authOptions from "@/auth";
import axios from "axios";
import { getServerSession } from "next-auth";

// ======================================================
// ASSIGNMENT INTERFACES
// ======================================================

export interface IAssignment {
  id: string;
  facultyId: string;
  facultyName: string;
  employeeCode: string;
  subject: {
    id: string;
    name: string;
  };
  academicYear: {
    id: string;
    name: string;
  };
  semester: {
    id: string;
    name: string;
  };
  classSection: {
    id: string;
    name: string;
  };
  assignedDate: string;
  status: string;
  deleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface IAssignmentResponse {
  success: boolean;
  status: string;
  message: string;
  data: {
    content: IAssignment[];
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

export interface ISingleAssignmentResponse {
  success: boolean;
  status: string;
  message: string;
  data: IAssignment;
}

export interface CreateAssignmentPayload {
  facultyId: string;
  subjectId: string;
  academicYearId: string;
  semesterId: string;
  classSectionId: string;
  assignedDate: string;
  status?: string;
}

export interface UpdateAssignmentPayload {
  facultyId?: string;
  subjectId?: string;
  academicYearId?: string;
  semesterId?: string;
  classSectionId?: string;
  assignedDate?: string;
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
// GET ALL ASSIGNMENTS
// ======================================================

export const GetAssignments = async (
  page: number = 0,
  size: number = 10,
  search: string = ""
): Promise<IAssignmentResponse> => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.get(
      `${API_ENDPOINTS.assignment.getAll}?page=${page}&size=${size}&search=${search}`,
      { headers }
    );

    return response.data;
  } catch (error: any) {
    console.log("GET ASSIGNMENTS ERROR:", error);
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Failed To Fetch Assignments"
    );
  }
};

// ======================================================
// GET DELETED ASSIGNMENTS
// ======================================================

export const GetDeletedAssignments = async (
  page: number = 0,
  size: number = 10,
  search: string = ""
): Promise<IAssignmentResponse> => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.get(
      `${API_ENDPOINTS.assignment.getDeleted}?page=${page}&size=${size}&search=${search}`,
      { headers }
    );

    return response.data;
  } catch (error: any) {
    console.log("GET DELETED ASSIGNMENTS ERROR:", error);
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Failed To Fetch Deleted Assignments"
    );
  }
};

// ======================================================
// CREATE ASSIGNMENT
// ======================================================

export const CreateAssignment = async (data: CreateAssignmentPayload) => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.post(
      API_ENDPOINTS.assignment.create,
      data,
      {
        headers,
      }
    );

    return response.data;
  } catch (error: any) {
    console.log("CREATE ASSIGNMENT ERROR:", error);

    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Create Assignment Failed"
    );
  }
};

// ======================================================
// GET ASSIGNMENT BY ID
// ======================================================

export const GetAssignmentById = async (
  id: string
): Promise<ISingleAssignmentResponse> => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.get(
      `${API_ENDPOINTS.assignment.getById}${id}`,
      {
        headers,
      }
    );

    return response.data;
  } catch (error: any) {
    console.log("GET ASSIGNMENT BY ID ERROR:", error);

    if (error.response?.status === 404) {
      throw new Error("Assignment not found");
    }

    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    }

    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Failed To Fetch Assignment"
    );
  }
};

// ======================================================
// UPDATE ASSIGNMENT
// ======================================================

export const UpdateAssignment = async (
  id: string,
  data: UpdateAssignmentPayload
) => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.put(
      `${API_ENDPOINTS.assignment.update}${id}`,
      data,
      {
        headers,
      }
    );

    return response.data;
  } catch (error: any) {
    console.log("UPDATE ASSIGNMENT ERROR:", error);

    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Update Assignment Failed"
    );
  }
};

// ======================================================
// SOFT DELETE ASSIGNMENT
// ======================================================

export const SoftDeleteAssignment = async (id: string) => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.delete(
      `${API_ENDPOINTS.assignment.softDelete}${id}`,
      {
        headers,
      }
    );

    return response.data;
  } catch (error: any) {
    console.log("SOFT DELETE ASSIGNMENT ERROR:", error);

    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Soft Delete Assignment Failed"
    );
  }
};

// ======================================================
// RESTORE ASSIGNMENT
// ======================================================

export const RestoreAssignment = async (id: string) => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.patch(
      `${API_ENDPOINTS.assignment.restore}${id}/restore`,
      {},
      {
        headers,
      }
    );

    return response.data;
  } catch (error: any) {
    console.log("RESTORE ASSIGNMENT ERROR:", error);

    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Restore Assignment Failed"
    );
  }
};