import apiRequest from './client';

export interface UpdateProfileRequest {
  firebaseUid: string;
  phone?: string;
  address?: string;
}

export interface UserProfile {
  firebaseUid: string;
  phone: string | null;
  address: string | null;
  updatedAt?: string;
}

// Update user profile
export async function updateUserProfile(profileData: UpdateProfileRequest): Promise<UserProfile> {
  return apiRequest<UserProfile>('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
}

// Get user profile
export async function getUserProfile(firebaseUid: string): Promise<UserProfile> {
  return apiRequest<UserProfile>(`/users/profile/${firebaseUid}`);
}