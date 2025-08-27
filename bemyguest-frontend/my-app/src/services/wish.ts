import api from "../services/api";

// 목록 응답에 맞춘 타입 (원한다면 일부만 써도 됨)
export type WishListItem = {
  guesthouseId: number;
  name: string;
  address: string;
  region: string;
  capacity: number;
  price: number;
  description: string;
  ratingAvg: number;
  ratingCount: number;
  createdAt: string;
};

export async function getWishList(): Promise<WishListItem[]> {
  const res = await api.get(`/wish`);  
  return res.data as WishListItem[];
}

export async function addWish(guesthouseId: number) {
  return api.post(`/wish`, { guesthouseId });
}

export async function removeWish(guesthouseId: number) {
  return api.delete(`/wish/${guesthouseId}`);
}
