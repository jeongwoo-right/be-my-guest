import apiClient from './api';

// 1. 백엔드에서 받아올 리뷰 데이터의 타입을 정의합니다.
// (ReviewResponseDto 와 일치해야 합니다.)
export interface Review {
  reviewId: number;
  authorNickname: string;
  guesthouseName: string; // 리뷰에 대한 숙소 이름을 DTO에 포함하는 것이 좋습니다.
  guesthouseId: number;
  rating: number;
  content: string;
  createdAt: string; // ISO 8601 형식의 날짜 문자열 (예: "2025-08-25T13:30:00")
  updatedAt: string;
}

/**
 * 특정 사용자가 작성한 모든 리뷰 목록을 조회하는 API 함수
 * @returns Promise<Review[]>
 */
export const fetchUserReviews = async (): Promise<Review[]> => {
  try {
    // API 명세서에 따라 경로를 '/reviews/user/{userId}' 등으로 수정해야 할 수 있습니다.
    const response = await apiClient.get<Review[]>(`/review/search/user/me`);
    return response.data;
  } catch (error) {
    console.error('작성한 리뷰를 불러오는 데 실패했습니다.', error);
    return [];
  }
};

// [신규] 리뷰 수정을 위한 데이터 타입
export interface ReviewUpdateRequest {
  rating: number;
  content: string;
}

/**
 * [신규] 특정 리뷰를 수정하는 API 함수
 */
export const updateReview = async (reviewId: number, reviewData: ReviewUpdateRequest): Promise<void> => {
  try {
    await apiClient.put(`/review/edit/${reviewId}`, reviewData);
  } catch (error) {
    console.error('리뷰 수정에 실패했습니다.', error);
    throw error;
  }
};

/**
 * [신규] 특정 리뷰를 삭제하는 API 함수
 */
export const deleteReview = async (reviewId: number): Promise<void> => {
  try {
    await apiClient.delete(`/review/edit/${reviewId}`);
  } catch (error) {
    console.error('리뷰 삭제에 실패했습니다.', error);
    throw error;
  }
};