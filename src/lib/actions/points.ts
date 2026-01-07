// src/lib/actions/points.ts

'use server';

import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import api from '@/lib/api';

/**
 * Get user points (Server Action)
 */
export async function getPoints() {
  const session = await auth();
  
  if (!session?.user?.lineUserId) {
    return { points: 0, error: 'Not authenticated' };
  }

  try {
    const response = await api.get(`/users/${session.user.lineUserId}/points`);
    return { points: response.data.points, error: null };
  } catch (error) {
    console.error('Failed to get points:', error);
    return { points: 0, error: 'Failed to fetch points' };
  }
}

/**
 * Redeem points (Server Action)
 */
export async function redeemPoints(rewardId: string, pointsToRedeem: number) {
  const session = await auth();
  
  if (!session?.user?.lineUserId) {
    return { success: false, error: 'Not authenticated' };
  }

  try {
    await api.post(`/users/${session.user.lineUserId}/points/redeem`, {
      rewardId,
      points: pointsToRedeem,
    });

    // Revalidate the points page to show updated data
    revalidatePath('/points');

    return { success: true, error: null };
  } catch (error) {
    console.error('Failed to redeem points:', error);
    return { success: false, error: 'Failed to redeem points' };
  }
}

/**
 * Get points history (Server Action)
 */
export async function getPointsHistory(page = 1, limit = 10) {
  const session = await auth();
  
  if (!session?.user?.lineUserId) {
    return { history: [], total: 0, error: 'Not authenticated' };
  }

  try {
    const response = await api.get(
      `/users/${session.user.lineUserId}/points/history`,
      { params: { page, limit } }
    );
    return {
      history: response.data.history,
      total: response.data.total,
      error: null,
    };
  } catch (error) {
    console.error('Failed to get points history:', error);
    return { history: [], total: 0, error: 'Failed to fetch history' };
  }
}
