// "use client";

// import React, { useEffect, useState } from "react";
// import { useRouter, useParams } from "next/navigation";
// import { toast } from "sonner";
// import {
//   CreateUser,
//   UpdateUser,
//   GetUserById,
//   CreateUserPayload,
//   UpdateUserPayload,
// } from "./contoller"; // adjust path if needed
// import { Save, UserPlus } from "lucide-react";

// const ROLES = ["STUDENT", "FACULTY", "HOD", "SUPER_ADMIN"] as const;

// const UserForm = () => {
//   const router = useRouter();
//   const params = useParams();
//   const id = params?.id as string | undefined;

//   const isEditMode = Boolean(id);

//   const [loading, setLoading] = useState(false);
//   const [fetching, setFetching] = useState(false);

//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     password: "",
//     role: "STUDENT" as (typeof ROLES)[number],
//   });

//   const [errors, setErrors] = useState<Record<string, string>>({});

//   // ====================== FETCH USER (EDIT MODE) ======================
//   useEffect(() => {
//     if (!isEditMode || !id) return;

//     const fetchUser = async () => {
//       try {
//         setFetching(true);
//         const res = await GetUserById(id);
//         const user = res.data;

//         setFormData({
//           fullName: user.fullName || "",
//           email: user.email || "",
//           password:user.password || "",
//           role: (user.role as (typeof ROLES)[number]) || "STUDENT",
//         });
//       } catch (error: any) {
//         toast.error(error.message || "Failed to load user");
//         router.push("/dashboard/user");
//       } finally {
//         setFetching(false);
//       }
//     };

//     fetchUser();
//   }, [id, isEditMode, router]);

//   // ====================== HANDLE CHANGE ======================
//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));

//     if (errors[name]) {
//       setErrors((prev) => {
//         const copy = { ...prev };
//         delete copy[name];
//         return copy;
//       });
//     }
//   };

//   // ====================== VALIDATION ======================
//   const validate = () => {
//     const newErrors: Record<string, string> = {};

//     if (!formData.fullName.trim()) {
//       newErrors.fullName = "Full name is required";
//     }

//     if (!formData.email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       newErrors.email = "Please enter a valid email";
//     }

//     if (!isEditMode) {
//       if (!formData.password) {
//         newErrors.password = "Password is required";
//       } else if (formData.password.length < 8) {
//         newErrors.password = "Password must be at least 8 characters";
//       }
//     } else if (formData.password && formData.password.length < 8) {
//       newErrors.password = "Password must be at least 8 characters";
//     }

//     if (!formData.role) {
//       newErrors.role = "Role is required";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // ====================== SUBMIT ======================
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!validate()) return;

//     try {
//       setLoading(true);

//       if (isEditMode && id) {
//         const payload: UpdateUserPayload = {
//           fullName: formData.fullName.trim(),
//           email: formData.email.trim(),
//           role: formData.role,
//         };

//         if (formData.password.trim()) {
//           (payload as any).password = formData.password;
//         }

//          await UpdateUser(id, payload);
//         toast.success("User updated successfully");
//       } else {
//         const payload: CreateUserPayload = {
//           fullName: formData.fullName.trim(),
//           email: formData.email.trim(),
//           password: formData.password,
//           role: formData.role,
//         };

//         await CreateUser(payload);
//         toast.success("User created successfully");
//       }

//       router.push("/dashboard/user");
//     } catch (error: any) {
//       toast.error(error.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ====================== LOADING STATE ======================
//   if (fetching) {
//     return (
//       <div className="flex items-center justify-center min-h-[300px]">
//         <div className="flex flex-col items-center gap-3">
//           <div className="w-10 h-10 border-4 border-[#0D9488] border-t-transparent rounded-full animate-spin" />
//           <p className="text-gray-500">Loading user details...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full max-w-xl">
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//         <form onSubmit={handleSubmit} className="p-6 space-y-6">
//           {/* Full Name */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1.5">
//               Full Name <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               name="fullName"
//               value={formData.fullName}
//               onChange={handleChange}
//               placeholder="Enter full name"
//               className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30 transition-all ${
//                 errors.fullName
//                   ? "border-red-400 bg-red-50"
//                   : "border-gray-300 hover:border-gray-400"
//               }`}
//             />
//             {errors.fullName && (
//               <p className="mt-1.5 text-sm text-red-500">{errors.fullName}</p>
//             )}
//           </div>

//           {/* Email */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1.5">
//               Email Address <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="user@example.com"
//               className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30 transition-all ${
//                 errors.email
//                   ? "border-red-400 bg-red-50"
//                   : "border-gray-300 hover:border-gray-400"
//               }`}
//             />
//             {errors.email && (
//               <p className="mt-1.5 text-sm text-red-500">{errors.email}</p>
//             )}
//           </div>

//           {/* Password */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1.5">
//               Password{" "}
//               {!isEditMode && <span className="text-red-500">*</span>}
//               {isEditMode && (
//                 <span className="text-gray-400 font-normal ml-1">
//                   (leave blank to keep current)
//                 </span>
//               )}
//             </label>
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               placeholder={
//                 isEditMode ? "Enter new password (optional)" : "Enter password"
//               }
//               className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30 transition-all ${
//                 errors.password
//                   ? "border-red-400 bg-red-50"
//                   : "border-gray-300 hover:border-gray-400"
//               }`}
//             />
//             {errors.password && (
//               <p className="mt-1.5 text-sm text-red-500">{errors.password}</p>
//             )}
//           </div>

//           {/* Role */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1.5">
//               Role <span className="text-red-500">*</span>
//             </label>
//             <select
//               name="role"
//               value={formData.role}
//               onChange={handleChange}
//               className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30 transition-all appearance-none bg-white ${
//                 errors.role
//                   ? "border-red-400 bg-red-50"
//                   : "border-gray-300 hover:border-gray-400"
//               }`}
//             >
//               {ROLES.map((role) => (
//                 <option key={role} value={role}>
//                   {role.replace("_", " ")}
//                 </option>
//               ))}
//             </select>
//             {errors.role && (
//               <p className="mt-1.5 text-sm text-red-500">{errors.role}</p>
//             )}
//           </div>

//           {/* Actions */}
//           <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
//             <button
//               type="button"
//               onClick={() => router.back()}
//               disabled={loading}
//               className="flex-1 px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
//             >
//               Cancel
//             </button>

//             <button
//               type="submit"
//               disabled={loading}
//               className="flex-1 px-5 py-2.5 bg-[#0D9488] hover:bg-[#0f766e] text-white font-medium rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
//             >
//               {loading ? (
//                 <>
//                   <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                   {isEditMode ? "Updating..." : "Creating..."}
//                 </>
//               ) : (
//                 <>
//                   {isEditMode ? <Save size={18} /> : <UserPlus size={18} />}
//                   {isEditMode ? "Update User" : "Create User"}
//                 </>
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default UserForm;



"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import {
  CreateUser,
  UpdateUser,
  GetUserById,
  CreateUserPayload,
  UpdateUserPayload,
} from "./contoller"; // adjust path if needed
import { Save, UserPlus } from "lucide-react";

const ROLES = ["STUDENT", "FACULTY", "HOD", "SUPER_ADMIN"] as const;
const STATUSES = ["ACTIVE", "INACTIVE"] as const;

const UserForm = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;

  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "STUDENT" as (typeof ROLES)[number],
    status: "ACTIVE" as (typeof STATUSES)[number],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // ====================== FETCH USER (EDIT MODE) ======================
  useEffect(() => {
    if (!isEditMode || !id) return;

    const fetchUser = async () => {
      try {
        setFetching(true);
        const res = await GetUserById(id);
        const user = res.data;

        setFormData({
          fullName: user.fullName || "",
          email: user.email || "",
          password: "", // never pre-fill password
          role: (user.role as (typeof ROLES)[number]) || "STUDENT",
          status: (user.status as (typeof STATUSES)[number]) || "ACTIVE",
        });
      } catch (error: any) {
        toast.error(error.message || "Failed to load user");
        router.push("/user");
      } finally {
        setFetching(false);
      }
    };

    fetchUser();
  }, [id, isEditMode, router]);

  // ====================== HANDLE CHANGE ======================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  // ====================== VALIDATION ======================
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!isEditMode) {
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }
    } else if (formData.password && formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.role) {
      newErrors.role = "Role is required";
    }

    if (isEditMode && !formData.status) {
      newErrors.status = "Status is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ====================== SUBMIT ======================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      if (isEditMode && id) {
        const payload: UpdateUserPayload = {
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          role: formData.role,
          status: formData.status,
        };

        if (formData.password.trim()) {
          (payload as any).password = formData.password;
        }

        await UpdateUser(id, payload);
        toast.success("User updated successfully");
      } else {
        const payload: CreateUserPayload = {
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          password: formData.password,
          role: formData.role,
        };

        await CreateUser(payload);
        toast.success("User created successfully");
      }

      router.push("/user");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ====================== LOADING STATE ======================
  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#0D9488] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500">Loading user details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter full name"
              className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30 transition-all ${
                errors.fullName
                  ? "border-red-400 bg-red-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            />
            {errors.fullName && (
              <p className="mt-1.5 text-sm text-red-500">{errors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="user@example.com"
              className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30 transition-all ${
                errors.email
                  ? "border-red-400 bg-red-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            />
            {errors.email && (
              <p className="mt-1.5 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Password{" "}
              {!isEditMode && <span className="text-red-500">*</span>}
              {isEditMode && (
                <span className="text-gray-400 font-normal ml-1">
                  (leave blank to keep current)
                </span>
              )}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={
                isEditMode ? "Enter new password (optional)" : "Enter password"
              }
              className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30 transition-all ${
                errors.password
                  ? "border-red-400 bg-red-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            />
            {errors.password && (
              <p className="mt-1.5 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30 transition-all appearance-none bg-white ${
                errors.role
                  ? "border-red-400 bg-red-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {role.replace("_", " ")}
                </option>
              ))}
            </select>
            {errors.role && (
              <p className="mt-1.5 text-sm text-red-500">{errors.role}</p>
            )}
          </div>

          {/* Status - Only in Edit Mode */}
          {isEditMode && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30 transition-all appearance-none bg-white ${
                  errors.status
                    ? "border-red-400 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              {errors.status && (
                <p className="mt-1.5 text-sm text-red-500">{errors.status}</p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={loading}
              className="flex-1 px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-5 py-2.5 bg-[#0D9488] hover:bg-[#0f766e] text-white font-medium rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  {isEditMode ? <Save size={18} /> : <UserPlus size={18} />}
                  {isEditMode ? "Update User" : "Create User"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;