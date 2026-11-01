export const API_ENDPOINTS = {
  auth: {
    login: "/api/auth/login",
  },
 user:{
  create:"/api/users",
  getAll:"/api/users",
  update:"/api/users",
  getById:"/api/users/",
  restore:"/api/users/",
  softDelete:"/api/users/"
 },
   department: {
    getAll: "/api/departments",
    create: "/api/departments",
    getById: "/api/departments/",
    update: "/api/departments/",
    softDelete: "/api/departments/",
    getDeleted: "/api/departments/deleted",
    restore: "/api/departments/",
  },
  academicYear: {
  getAll: "/api/academic-years",
  create: "/api/academic-years",
  getById: "/api/academic-years/",
  update: "/api/academic-years/",
  softDelete: "/api/academic-years/",
  getDeleted: "/api/academic-years/deleted",
},

};
