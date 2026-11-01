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
  getDeleted:"/api/users",
  softDelete:"/api/users/"
 },
 course:{
  create:"/api/courses",
  getAll:"/api/courses",
  update:"api/courses",
  getById:"/api/courses/",
  restore:"/api/courses/",
  getDeleted:"/api/courses/deleted",
  softDelete:"/api/courses/"
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

};
