import apiRequest from './client';

export interface User {
  _id: string;
  name?: string;
  email: string;
  role: 'user' | 'admin';
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

// Get all users with pagination and filters
export async function getUsers(params: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
} = {}): Promise<{ users: User[]; total: number; page: number; pages: number }> {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value.toString());
    }
  });

  return apiRequest(`/users?${searchParams.toString()}`);
}

// Update user role
export async function updateUserRole(userId: string, role: 'user' | 'admin'): Promise<{ message: string; user: User }> {
  return apiRequest(`/users/${userId}/role`, {
    method: 'PUT',
    body: JSON.stringify({ role }),
  });
}