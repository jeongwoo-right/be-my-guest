import api from "../services/api";

export type WishItem = { guesthouseId: number; createdAt: string };

/** 찜 목록 조회 */
export async function getWishList(): Promise<WishItem[]> {
  const res = await api.get(`/user/wish`);
  return res.data as WishItem[];
}

/** 찜 추가 */
export async function addWish(guesthouseId: number) {
  return api.post(`/wish`, {guesthouseId});
}

/** 찜 해제 (스펙 확정 후 하나로 정리) */
export async function removeWish(guesthouseId: number) {
    return await api.delete(`/user/wish/${guesthouseId}`);
}
