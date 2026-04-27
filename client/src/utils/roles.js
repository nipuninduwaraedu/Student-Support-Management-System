export const isStudent = (u) =>
  Boolean(u && (u.role === "student" || u.role === "Student"));

export const isAdmin = (u) =>
  Boolean(u && (u.role === "admin" || u.role === "Admin"));
