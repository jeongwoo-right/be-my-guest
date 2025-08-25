import apiClient from './api';

// 1. 백엔드에서 받아올 리뷰 데이터의 타입을 정의합니다.
// (ReviewResponseDto 와 일치해야 합니다.)
export interface Review {
  reviewId: number;
  authorNickname: string;
  guesthouseName: string; // 리뷰에 대한 숙소 이름을 DTO에 포함하는 것이 좋습니다.
  rating: number;
  content: string;
  createdAt: string; // ISO 8601 형식의 날짜 문자열 (예: "2025-08-25T13:30:00")
}

/**
 * 특정 사용자가 작성한 모든 리뷰 목록을 조회하는 API 함수
 * @param userId - 조회할 사용자의 ID
 * @returns Promise<Review[]>
 */
export const fetchUserReviews = async (userId: number): Promise<Review[]> => {
  try {
    // API 명세서에 따라 경로를 '/reviews/user/{userId}' 등으로 수정해야 할 수 있습니다.
    const response = await apiClient.get<Review[]>(`/api/review/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('작성한 리뷰를 불러오는 데 실패했습니다.', error);
    return [];
  }
};