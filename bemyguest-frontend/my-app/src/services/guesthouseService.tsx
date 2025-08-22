import apiClient from './api';

// 1. [수정] API 요청 시 Body에 담을 데이터의 타입을 정의합니다.
export interface GuesthouseSearchRequest {
  startDate: string;
  endDate: string;
  guests: number;
  region: string;
  page: number;
  size: number;
  sort: 'name' | 'price' | 'rating'; // 정렬 기준
  dir: 'asc' | 'desc'; // 정렬 방향
}

// 2. [수정] 백엔드에서 받아올 게스트하우스 데이터의 타입을 명세서에 맞게 정의합니다.
export interface Guesthouse {
  id: number;
  name: string;
  address: string;
  region: string;
  capacity: number;
  price: number;
  description: string;
  ratingAvg: number;
  ratingCount: number;
}

// 3. [수정] 백엔드 API의 전체 응답 구조에 대한 타입을 정의합니다.
export interface GuesthouseApiResponse {
  content: Guesthouse[];
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number; // 현재 페이지 번호 (0부터 시작)
  // pageable, sort, first, numberOfElements, empty 등 다른 필드는 필요 시 추가
}

/**
 * 4. [수정] 다양한 검색 조건으로 게스트하우스 목록을 조회하는 API 함수
 * @param searchParams - 검색 조건을 담은 객체
 * @returns Promise<GuesthouseApiResponse>
 */
export const searchGuesthouses = async (
  searchParams: GuesthouseSearchRequest
): Promise<GuesthouseApiResponse> => {
  try {
    // 5. [수정] GET에서 POST 메서드로 변경하고, 두 번째 인자로 요청 Body 데이터를 전달합니다.
    const response = await apiClient.post<GuesthouseApiResponse>('/guesthouses', searchParams);
    
    // 성공 시 받아온 데이터를 반환합니다.
    return response.data;

  } catch (error) {
    console.error('게스트하우스 검색에 실패했습니다.', error);
    
    // 6. [수정] 에러 발생 시 반환하는 기본값의 구조를 새로운 API 응답 타입에 맞게 변경합니다.
    return {
      content: [],
      totalPages: 0,
      totalElements: 0,
      last: true,
      size: searchParams.size,
      number: searchParams.page,
    };
  }
};