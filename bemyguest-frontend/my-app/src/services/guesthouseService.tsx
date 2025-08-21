import apiClient from './api';

// 1. 백엔드와 주고받을 게스트하우스 데이터의 타입을 정의합니다.
// (API 명세서에 맞게 필드를 정확히 작성해주세요.)
export interface Guesthouse {
  id: number;
  name: string;
  location: string;
  price: number;
  thumbnailUrl: string; // 예시 필드
}

// 백엔드 API 응답이 페이지 정보를 포함할 경우를 대비한 타입
// (실제 백엔드 응답 구조에 맞춰 수정이 필요할 수 있습니다.)
export interface GuesthouseApiResponse {
  content: Guesthouse[];
  totalPages: number;
  totalElements: number;
  last: boolean;
}


/**
 * 검색어와 페이지 번호로 게스트하우스 목록을 조회하는 API 함수
 * @param keyword - 사용자가 입력한 검색어
 * @param page - 요청할 페이지 번호 (1부터 시작)
 * @returns Promise<GuesthouseApiResponse>
 */
export const searchGuesthouses = async (keyword: string, page: number): Promise<GuesthouseApiResponse> => {
  try {
    // GET 요청을 보내고, params로 쿼리 스트링을 전달합니다.
    // 예: /guesthouses/search?keyword=서울&page=1&size=10
    const response = await apiClient.get<GuesthouseApiResponse>('/guesthouses/search', {
      params: {
        keyword: keyword,
        page: page,
        size: 10, // 페이지당 10개씩 요청
      },
    });
    
    // 성공 시 받아온 데이터를 반환합니다.
    return response.data;

  } catch (error) {
    console.error('게스트하우스 검색에 실패했습니다.', error);
    // 에러 발생 시 기본값 또는 빈 데이터를 반환합니다.
    // 이는 페이지 컴포넌트에서 에러 처리를 용이하게 합니다.
    return {
      content: [],
      totalPages: 0,
      totalElements: 0,
      last: true,
    };
  }
};