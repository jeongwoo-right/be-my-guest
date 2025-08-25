import apiClient from './api';

// 1. 백엔드에서 받아올 예약 데이터의 타입을 정의합니다.
// (ReservationResponseDto 와 일치해야 합니다.)
export interface Booking {
  reservationId: number;
  guesthouseName: string;
  checkinDate: string;
  checkoutDate: string;
  status: 'RESERVED' | 'CANCELLED' | 'COMPLETED';
}

/**
 * 특정 사용자의 모든 예약 내역을 조회하는 API 함수
 * @param userId - 조회할 사용자의 ID
 * @returns Promise<Booking[]>
 */
export const fetchUserBookings = async (userId: number): Promise<Booking[]> => {
  try {
    const response = await apiClient.get<Booking[]>(`/users/${userId}/reservations`);
    return response.data;
  } catch (error) {
    console.error('예약 내역을 불러오는 데 실패했습니다.', error);
    return []; // 에러 발생 시 빈 배열 반환
  }
};