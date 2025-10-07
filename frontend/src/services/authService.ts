import { api } from '@/lib/config';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;
  username: string;
  age: number;
  role: string;
}

export interface User {
  id: number | string;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  role: 'user' | 'guide' | 'admin';
  display_name: string;
  onboarding_completed: boolean;
  age?: number;
  is_active: boolean;
  date_joined: string;
  bio?: string;
  gender?: string;
  is_anonymous_preferred?: boolean;
  allow_peer_matching?: boolean;
  crisis_contact_phone?: string;
  last_mood_checkin?: string;
  notification_preferences?: Record<string, any>;
  professional_title?: string;
  license_number?: string;
  specializations?: string[];
  years_experience?: number;
  is_staff?: boolean;
  last_active?: string;
  full_name?: string;
}

export interface AuthResponse {
  detail: string;
  token: {
    access: string;
    refresh: string;
  };
  user: User;
}

export interface ApiError {
  detail?: string;
  email?: string[];
  username?: string[];
  password?: string[];
  [key: string]: any;
}

class AuthService {
  private baseUrl = api.baseUrl;

  /**
   * Login user with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/accounts/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Login failed');
    }

    // Store tokens in localStorage
    this.setTokens(data.token);
    this.setUser(data.user);

    return data;
  }

  /**
   * Register new user
   */
  async register(userData: RegisterData): Promise<{ detail: string; user: any }> {
    const response = await fetch(`${this.baseUrl}/accounts/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error('Registration failed') as Error & { data: ApiError };
      error.data = data;
      throw error;
    }

    return data;
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<{ detail: string }> {
    const response = await fetch(`${this.baseUrl}/accounts/password-reset/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Password reset request failed');
    }

    return data;
  }

  /**
   * Confirm password reset with token
   */
  async confirmPasswordReset(uid: string, token: string, newPassword: string): Promise<{ detail: string }> {
    const response = await fetch(`${this.baseUrl}/accounts/password-reset-confirm/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uid,
        token,
        new_password: newPassword,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Password reset failed');
    }

    return data;
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    const token = this.getAccessToken();
    
    if (!token) {
      throw new Error('No access token available');
    }

    const response = await fetch(`${this.baseUrl}/accounts/me/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired, try to refresh
        await this.refreshToken();
        return this.getCurrentUser(); // Retry with new token
      }
      throw new Error('Failed to get user profile');
    }

    const user = await response.json();
    this.setUser(user);
    return user;
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<void> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${this.baseUrl}/accounts/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      // Refresh token is invalid, logout user
      this.logout();
      throw new Error('Session expired. Please login again.');
    }

    const data = await response.json();
    localStorage.setItem('access_token', data.access);
  }

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('pending_user');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    const user = this.getUser();
    return !!(token && user);
  }

  /**
   * Get stored access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  /**
   * Get stored refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  /**
   * Get stored user data
   */
  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Store authentication tokens
   */
  private setTokens(tokens: { access: string; refresh: string }): void {
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
  }

  /**
   * Store user data
   */
  private setUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  /**
   * Get authorization header for API requests
   */
  getAuthHeader(): { Authorization: string } | {} {
    const token = this.getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Make authenticated API request
   */
  async authenticatedRequest(url: string, options: RequestInit = {}): Promise<Response> {
    const token = this.getAccessToken();
    
    if (!token) {
      throw new Error('No access token available');
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 401) {
      // Try to refresh token
      try {
        await this.refreshToken();
        // Retry request with new token
        return this.authenticatedRequest(url, options);
      } catch (error) {
        // Refresh failed, logout user
        this.logout();
        throw new Error('Session expired. Please login again.');
      }
    }

    return response;
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
