// src/lib/api/index.ts

import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: process.env.EXTERNAL_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    // const token = getToken();
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;

// ===========================================
// API Functions (use in Server Components)
// ===========================================

/**
 * Get user points by LINE User ID
 */
export async function getPoints(lineUserId: string): Promise<number> {
  try {
    const response = await api.get(`/users/${lineUserId}/points`);
    return response.data.points;
  } catch (error) {
    console.error('Failed to get points:', error);
    return 0;
  }
}

/**
 * Get user coupons by LINE User ID
 */
export async function getCoupons(lineUserId: string) {
  try {
    const response = await api.get(`/users/${lineUserId}/coupons`);
    return response.data.coupons;
  } catch (error) {
    console.error('Failed to get coupons:', error);
    return [];
  }
}

/**
 * Get user profile by LINE User ID
 */
export async function getUserProfile(lineUserId: string) {
  try {
    const response = await api.get(`/users/${lineUserId}/profile`);
    return response.data;
  } catch (error) {
    console.error('Failed to get profile:', error);
    return null;
  }
}

/**
 * Login with credentials
 */
export async function loginWithCredentials(username: string, password: string) {
  const response = await api.post('/auth/login', { username, password });
  return response.data;
}

/**
 * Verify LIFF access token
 */
export async function verifyLiffToken(lineUserId: string, accessToken: string) {
  const response = await api.post('/auth/liff/verify', { lineUserId, accessToken });
  return response.data;
}

/**
 * Get dashboard stats
 */
export async function getDashboardStats() {
  try {
    const response = await api.get('/dashboard/stats');
    return response.data;
  } catch (error) {
    console.error('Failed to get dashboard stats:', error);
    return {
      totalUsers: 0,
      ordersToday: 0,
      monthlyRevenue: 0,
    };
  }
}

/**
 * Get recent activities
 */
export async function getRecentActivities(limit = 5) {
  try {
    const response = await api.get(`/dashboard/activities?limit=${limit}`);
    return response.data.activities;
  } catch (error) {
    console.error('Failed to get activities:', error);
    return [];
  }
}
