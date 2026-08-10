/**
 * Automatic Faculty Domain Detection logic.
 * Checks institutional email patterns to detect faculty credentials.
 */
export function detectRoleFromEmail(email: string): "student" | "faculty" {
  const normalized = email.trim().toLowerCase();
  
  const isFacultyDomain = 
    normalized.endsWith("@college.edu.in") ||
    normalized.endsWith("@faculty.college.edu.in") ||
    normalized.includes("faculty") ||
    normalized.includes("prof.") ||
    normalized.includes("professor") ||
    normalized.includes("hod");

  return isFacultyDomain ? "faculty" : "student";
}
