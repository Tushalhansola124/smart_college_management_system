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
  update:"api/courses/",
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
  academicYear: {
  getAll: "/api/academic-years",
  create: "/api/academic-years",
  getById: "/api/academic-years/",
  update: "/api/academic-years/",
  softDelete: "/api/academic-years/",
  getDeleted: "/api/academic-years/deleted",
},

semester: {
  getAll: "/api/semesters",
  create: "/api/semesters",
  getById: "/api/semesters/",
  update: "/api/semesters/",
  softDelete: "/api/semesters/",
  getDeleted: "/api/semesters/deleted",
  restore: "/api/semesters/",
},
faculty: {
  getAll: "/api/faculties",
  create: "/api/faculties",
  getById: "/api/faculties/",
  update: "/api/faculties/",
  softDelete: "/api/faculties/",
  getDeleted: "/api/faculties/deleted",
  restore: "/api/faculties/",
},

};
