/**
 * Student Services for Admin
 * Uses clientFetcher - throws on error for React Query
 */

import { clientFetcher } from '@/lib/fetcher';
import { API_CONFIG } from '@/lib/api-config';

export interface StudentRow {
  id: string;
  slug: string;
  name: string;
  birthday?: string | null;
  message?: string | null;
  school: string;
  isActive: boolean;
  createdAt?: string | null;
}

export interface CreateStudentInput {
  slug: string;
  name: string;
  birthday?: string | null;
  message?: string | null;
  school?: string;
  isActive?: boolean;
}

export interface UpdateStudentInput {
  slug?: string;
  name?: string;
  birthday?: string | null;
  message?: string | null;
  school?: string;
  isActive?: boolean;
}

/**
 * List all students with optional school filtering
 */
export async function listStudentsService(school?: string): Promise<{ students: StudentRow[] }> {
  const url = school 
    ? `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN.STUDENTS.LIST}?school=${encodeURIComponent(school)}`
    : `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN.STUDENTS.LIST}`;

  return clientFetcher.get<{ students: StudentRow[] }>(url);
}

/**
 * Get student by ID
 */
export async function getStudentService(id: string): Promise<{ student: StudentRow }> {
  return clientFetcher.get<{ student: StudentRow }>(
    `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN.STUDENTS.DETAIL(id)}`,
  );
}

/**
 * Create new student
 */
export async function createStudentService(
  data: CreateStudentInput,
): Promise<{ student: StudentRow }> {
  return clientFetcher.post<{ student: StudentRow }>(
    `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN.STUDENTS.CREATE}`,
    data,
  );
}

/**
 * Update student
 */
export async function updateStudentService(
  id: string,
  data: UpdateStudentInput,
): Promise<{ student: StudentRow }> {
  return clientFetcher.put<{ student: StudentRow }>(
    `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN.STUDENTS.UPDATE(id)}`,
    data,
  );
}

/**
 * Delete student
 */
export async function deleteStudentService(id: string): Promise<{ success: boolean }> {
  return clientFetcher.delete<{ success: boolean }>(
    `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN.STUDENTS.DELETE(id)}`,
  );
}
