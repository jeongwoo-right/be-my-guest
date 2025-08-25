import apiClient from './api';
// Guesthouse 타입을 재사용합니다.
import type { Guesthouse } from './guesthouseService';

/**
 * 특정 사용자의 찜 목록(위시리스트)을 조회하는 API 함수
 * @param userId - 조회할 사용자의 ID
 * @returns Promise<Guesthouse[]>
 */
export const fetchUserWishlist = async (userId: number): Promise<Guesthouse[]> => {
  try {
    // API 명세서에 따라 경로를 '/wishlists' 또는 '/users/{userId}/wishlist' 등으로 가정합니다.
    const response = await apiClient.get<Guesthouse[]>(`/api/user/${userId}/wish`);
    return response.data;
  } catch (error) {
    console.error('찜 목록을 불러오는 데 실패했습니다.', error);
    return [];
  }
};