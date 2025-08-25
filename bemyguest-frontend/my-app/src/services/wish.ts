import api from "../services/api";

export type WishItem = { guesthouseId: number; createdAt: string };

/** 찜 목록 조회 */
export async function getWishList(userId: number): Promise<WishItem[]> {
  const res = await api.get(`/user/${userId}/wish`);
  return res.data as WishItem[];
}

/** 찜 추가 */
export async function addWish(userId: number, guesthouseId: number) {
  return api.post(`/user/${userId}/wish`, { guesthouseId });
}

/** 찜 해제 (스펙 확정 후 하나로 정리) */
export async function removeWish(userId: number, guesthouseId: number) {
  try {
    return await api.delete(`/user/${userId}/wish/${guesthouseId}`);
  } catch {
    return await api.delete(`/user/${userId}/wish`, { data: { guesthouseId } });
  }
}
