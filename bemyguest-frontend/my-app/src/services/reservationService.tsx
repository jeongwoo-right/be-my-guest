import apiClient from './api';

// 1. 백엔드에서 받아올 예약 데이터의 타입을 정의합니다.
// (ReservationResponseDto 와 일치해야 합니다.)
export interface Booking {
  reservationId: number;
  guesthouseName: string;
  guesthouseId: number;
  checkinDate: string;
  checkoutDate: string;
  status: 'RESERVED' | 'CANCELLED' | 'COMPLETED';
  reviewWritten: boolean;
}

/**
 * 특정 사용자의 모든 예약 내역을 조회하는 API 함수
 * @returns Promise<Booking[]>
 */
export const fetchUserBookings = async (): Promise<Booking[]> => {
  try {
    const response = await apiClient.get<Booking[]>(`/reservations/history`);
    return response.data;
  } catch (error) {
    console.error('예약 내역을 불러오는 데 실패했습니다.', error);
    return []; // 에러 발생 시 빈 배열 반환
  }
};

/**
 * [신규] 예약을 취소하는 API 함수
 * @param reservationId - 취소할 예약의 ID
 */
export const cancelBooking = async (reservationId: number): Promise<void> => {
  try {
    // PATCH 요청을 보냅니다.
    await apiClient.patch(`/reservations/${reservationId}/cancel`);
  } catch (error) {
    console.error('예약 취소에 실패했습니다.', error);
    // 프론트엔드에서 에러를 처리할 수 있도록 예외를 다시 던져줍니다.
    throw error;
  }
};