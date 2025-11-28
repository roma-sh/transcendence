/**
 * JWT Token Management Utilities
 */

const TOKEN_KEY = 'jwt_token';
const USER_KEY = 'user_data';

export interface UserData {
  id: number;
  username: string;
  email: string;
}

/**
 * Store JWT token in localStorage
 */
export function storeToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Get JWT token from localStorage
 */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Remove JWT token from localStorage
 */
export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/**
 * Store user data in localStorage
 */
export function storeUserData(user: UserData): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/**
 * Get user data from localStorage
 */
export function getUserData(): UserData | null {
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

/**
 * Check if user is authenticated (has valid token)
 */
export function isAuthenticated(): boolean {
  return getToken() !== null;
}

/**
 * Get Authorization header value for API requests
 */
export function getAuthHeader(): { Authorization: string } | {} {
  const token = getToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

/**
 * Make authenticated API request
 */
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  return fetch(url, {
    ...options,
    headers,
  });
}

