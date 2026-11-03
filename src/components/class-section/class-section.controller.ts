"use server";

import { API_ENDPOINTS } from "@/app/core/constants/api_endpoint";
import authOptions from "@/auth";
import axios from "axios";
import { getServerSession } from "next-auth";

// ==================== Class Section Interface ====================

export interface IClassSection {
  id: string;
  name: string;

  course: {
    id: string;
    name: string;
  };

  semester: {
    id: string;
    name: string;
  };

  academicYear: {
    id: string;
    name: string;
  };

  department: {
    id: string;
    name: string;
  };

  status: string;
  deleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// ==================== Pagination Interface ====================

export interface IClassSectionResponse {
  success: boolean;
  status: string;
  message: string;
  data: {
    content: IClassSection[];
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

export interface ISingleClassSectionResponse {
  success: boolean;
  status: string;
  message: string;
  data: IClassSection;
}

// ==================== Payload Interface ====================

export interface ICreateClassSectionPayload {
  name: string;
  courseId: string;
  semesterId: string;
  academicYearId: string;
  departmentId: string;
}

export interface IUpdateClassSectionPayload {
  name?: string;
  courseId?: string;
  semesterId?: string;
  academicYearId?: string;
  departmentId?: string;
}

export interface IUpdateClassSectionStatusPayload {
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

// ==================== Get All Class Sections ====================

export const GetClassSections = async (
  page = 0,
  size = 10
): Promise<IClassSectionResponse> => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.get(
      API_ENDPOINTS.classSection.getAll,
      {
        headers,
        params: { page, size },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Failed to fetch class sections")
    );
  }
};

// ==================== Create Class Section ====================

export const CreateClassSection = async (
  data: ICreateClassSectionPayload
) => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.post(
      API_ENDPOINTS.classSection.create,
      data,
      { headers }
    );

    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Failed to create class section")
    );
  }
};

// ==================== Get Class Section By ID ====================

export const GetClassSectionById = async (
  id: string
): Promise<ISingleClassSectionResponse> => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.get(
      `${API_ENDPOINTS.classSection.getById}${id}`,
      { headers }
    );

    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Failed to fetch class section")
    );
  }
};

// ==================== Update Class Section ====================

export const UpdateClassSection = async (
  id: string,
  data: IUpdateClassSectionPayload
) => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.put(
      `${API_ENDPOINTS.classSection.update}${id}`,
      data,
      { headers }
    );

    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Failed to update class section")
    );
  }
};

// ==================== Delete Class Section ====================

export const SoftDeleteClassSection = async (id: string) => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.delete(
      `${API_ENDPOINTS.classSection.softDelete}${id}`,
      { headers }
    );

    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Failed to delete class section")
    );
  }
};

// ==================== Get Deleted Class Sections ====================

export const GetDeletedClassSections = async (
  page = 0,
  size = 10
): Promise<IClassSectionResponse> => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.get(
      API_ENDPOINTS.classSection.getDeleted,
      {
        headers,
        params: { page, size },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Failed to fetch deleted class sections")
    );
  }
};

// ==================== Restore Class Section ====================

export const RestoreClassSection = async (id: string) => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.patch(
      `${API_ENDPOINTS.classSection.restore}${id}/restore`,
      {},
      { headers }
    );

    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Failed to restore class section")
    );
  }
};

// ==================== Update Class Section Status ====================

export const UpdateClassSectionStatus = async (
  id: string,
  data: IUpdateClassSectionStatusPayload
) => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.patch(
      `${API_ENDPOINTS.classSection.updateStatus}${id}/status`,
      data,
      { headers }
    );

    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Failed to update class section status")
    );
  }
};

// ==================== Get Class Sections By Academic Year ====================

export const GetClassSectionsByAcademicYear = async (
  academicYearId: string,
  page = 0,
  size = 10
): Promise<IClassSectionResponse> => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.get(
      `${API_ENDPOINTS.classSection.byAcademicYear}${academicYearId}`,
      {
        headers,
        params: { page, size },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Failed to fetch academic year class sections")
    );
  }
};

// ==================== Get Class Sections By Semester ====================

export const GetClassSectionsBySemester = async (
  semesterId: string,
  page = 0,
  size = 10
): Promise<IClassSectionResponse> => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.get(
      `${API_ENDPOINTS.classSection.bySemester}${semesterId}`,
      {
        headers,
        params: { page, size },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Failed to fetch semester class sections")
    );
  }
};

// ==================== Get Class Sections By Course ====================

export const GetClassSectionsByCourse = async (
  courseId: string,
  page = 0,
  size = 10
): Promise<IClassSectionResponse> => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.get(
      `${API_ENDPOINTS.classSection.byCourse}${courseId}`,
      {
        headers,
        params: { page, size },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Failed to fetch course class sections")
    );
  }
};

// ==================== Get Class Sections By Department ====================

export const GetClassSectionsByDepartment = async (
  departmentId: string,
  page = 0,
  size = 10
): Promise<IClassSectionResponse> => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.get(
      `${API_ENDPOINTS.classSection.byDepartment}${departmentId}`,
      {
        headers,
        params: { page, size },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Failed to fetch department class sections")
    );
  }
};