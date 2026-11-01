'use server';




import { API_ENDPOINTS } from "@/app/core/constants/api_endpoint";
import authOptions from "@/auth";
import axios from "axios";
import { getServerSession } from "next-auth";

// ======================================================
// USER INTERFACES
// ======================================================

export interface IUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
  status: string;
  emailVerified: boolean;
  deleted: boolean;
  lastLoginAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUserResponse {
  success: boolean;
  status: string;
  message: string;
  data: {
    content: IUser[];
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

export interface ISingleUserResponse {
  success: boolean;
  status: string;
  message: string;
  data: IUser;
}

export interface CreateUserPayload {
  fullName: string;
  email: string;
  password: string;
  role: string;
}

export interface UpdateUserPayload {
  fullName?: string;
  email?: string;
  role?: string;
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
  const session = await getServerSession(authOptions);  // ✅ Correct

  const token = (session?.user as any)?.accessToken;

  if (!token) {
    throw new Error("Unauthorized");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

// ======================================================
// GET ALL USERS
// ======================================================

export const GetUsers = async (
  page: number = 0,
  size: number = 10,
  search: string = ""
): Promise<IUserResponse> => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.get(
      `${API_ENDPOINTS.user.getAll}?page=${page}&size=${size}&search=${search}`,
      { headers }
    );

    return response.data;
  } catch (error: any) {
    console.log("GET USERS ERROR:", error);
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Failed To Fetch Users"
    );
  }
};

// ======================================================
// CREATE USER
// ======================================================

export const CreateUser = async (data: CreateUserPayload) => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.post(
      API_ENDPOINTS.user.create,
      data,
      {
        headers,
      }
    );

    return response.data;
  } catch (error: any) {
    console.log("CREATE USER ERROR:", error);

    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Create User Failed"
    );
  }
};

// ======================================================
// GET USER BY ID
// ======================================================

export const GetUserById = async (
  id: string
): Promise<ISingleUserResponse> => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.get(
      `${API_ENDPOINTS.user.getById}${id}`,
      {
        headers,
      }
    );

    return response.data;
  } catch (error: any) {
    console.log("GET USER BY ID ERROR:", error);

    if (error.response?.status === 404) {
      throw new Error("User not found");
    }

    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    }

    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Failed To Fetch User"
    );
  }
};

// ======================================================
// UPDATE USER
// ======================================================

export const UpdateUser = async (
  id: string,
  data: UpdateUserPayload
) => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.put(
      `${API_ENDPOINTS.user.update}${id}`,
      data,
      {
        headers,
      }
    );

    return response.data;
  } catch (error: any) {
    console.log("UPDATE USER ERROR:", error);

    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Update User Failed"
    );
  }
};

// ======================================================
// SOFT DELETE USER
// ======================================================

export const SoftDeleteUser = async (id: string) => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.delete(
      `${API_ENDPOINTS.user.softDelete}${id}`,
      {
        headers,
      }
    );

    return response.data;
  } catch (error: any) {
    console.log("SOFT DELETE USER ERROR:", error);

    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Soft Delete User Failed"
    );
  }
};

// ======================================================
// RESTORE USER
// ======================================================

export const RestoreUser = async (id: string) => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.patch(
      `${API_ENDPOINTS.user.restore}${id}/restore`,
      {},
      {
        headers,
      }
    );

    return response.data;
  } catch (error: any) {
    console.log("RESTORE USER ERROR:", error);

    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Restore User Failed"
    );
  }
};