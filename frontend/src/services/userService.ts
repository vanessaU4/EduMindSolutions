import { apiClient } from './apiClient';

export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  role: 'user' | 'guide' | 'admin';
  age?: number;
  gender?: string;
  bio?: string;
  avatar?: string;
  is_anonymous_preferred: boolean;
  allow_peer_matching: boolean;
  crisis_contact_phone?: string;
  onboarding_completed: boolean;
  last_mood_checkin?: string;
  notification_preferences: Record<string, any>;
  professional_title?: string;
  license_number?: string;
  specializations?: string[];
  years_experience?: number;
  is_active: boolean;
  is_staff: boolean;
  date_joined: string;
  last_active: string;
  display_name: string;
  full_name: string;
}

export interface UpdateUserData {
  first_name?: string;
  last_name?: string;
  age?: number;
  gender?: string;
  bio?: string;
  is_anonymous_preferred?: boolean;
  allow_peer_matching?: boolean;
  crisis_contact_phone?: string;
  notification_preferences?: Record<string, any>;
  professional_title?: string;
  license_number?: string;
  specializations?: string[];
  years_experience?: number;
}

export interface OnboardingData {
  age: number;
  gender?: string;
  bio?: string;
  is_anonymous_preferred?: boolean;
  allow_peer_matching?: boolean;
  crisis_contact_phone?: string;
}

class UserService {
  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>('/accounts/me/');
  }

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateUserData): Promise<User> {
    return apiClient.patch<User>('/accounts/profile/', data);
  }

  /**
   * Complete onboarding
   */
  async completeOnboarding(data: OnboardingData): Promise<User> {
    return apiClient.post<User>('/accounts/onboarding/', data);
  }

  /**
   * Update mood check-in
   */
  async updateMoodCheckin(): Promise<{ detail: string; last_mood_checkin: string }> {
    return apiClient.post('/accounts/mood-checkin/');
  }

  /**
   * Get all users (admin only)
   */
  async getAllUsers(): Promise<User[]> {
    return apiClient.get<User[]>('/accounts/admin/users/');
  }

  /**
   * Get specific user (admin only)
   */
  async getUser(id: number): Promise<User> {
    return apiClient.get<User>(`/accounts/admin/users/${id}/`);
  }

  /**
   * Update user (admin only)
   */
  async updateUser(id: number, data: Partial<User>): Promise<User> {
    return apiClient.patch<User>(`/accounts/admin/users/${id}/`, data);
  }

  /**
   * Delete user (admin only)
   */
  async deleteUser(id: number): Promise<void> {
    return apiClient.delete<void>(`/accounts/admin/users/${id}/`);
  }

  /**
   * Deactivate user (admin only)
   */
  async deactivateUser(id: number): Promise<User> {
    return apiClient.patch<User>(`/accounts/admin/users/${id}/`, { is_active: false });
  }

  /**
   * Activate user (admin only)
   */
  async activateUser(id: number): Promise<User> {
    return apiClient.patch<User>(`/accounts/admin/users/${id}/`, { is_active: true });
  }

  /**
   * Change user role (admin only)
   */
  async changeUserRole(id: number, role: 'user' | 'guide' | 'admin'): Promise<User> {
    return apiClient.patch<User>(`/accounts/admin/users/${id}/`, { role });
  }

  /**
   * Create new user (admin only)
   */
  async createUser(data: {
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    password: string;
    role: 'user' | 'guide' | 'admin';
    age?: number;
    gender?: string;
    bio?: string;
  }): Promise<User> {
    return apiClient.post<User>('/accounts/admin/users/', data);
  }

  /**
   * Reset user password (admin only)
   */
  async resetUserPassword(id: number, newPassword: string): Promise<void> {
    return apiClient.post<void>(`/accounts/users/${id}/reset-password/`, { password: newPassword });
  }
}

export const userService = new UserService();
export default userService;
