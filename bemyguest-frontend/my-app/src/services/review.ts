import api from "./api";

// Shape we'll render; maps flexibly from backend fields
export type ReviewItem = {
  id: number;
  userId?: number;
  userName?: string;
  rating: number;
  text: string;
  createdAt: string; // ISO string
};

export async function getReviewsByGuesthouse(
  guesthouseId: number
): Promise<ReviewItem[]> {
  const res = await api.get(`/review/search/guesthouse/${guesthouseId}`);
  const arr = Array.isArray(res.data) ? res.data : [];

  // Defensive mapping in case field names differ slightly
  return arr.map((r: any) => ({
    id: r.id ?? r.reviewId ?? Math.floor(Math.random() * 1e9),
    userId: r.userId ?? r.authorId ?? r.user?.id,
    userName:
      r.userName ?? r.nickname ?? r.authorName ?? r.user?.name ?? "익명",
    rating: Number(r.rating ?? r.score ?? r.stars ?? 0),
    text: r.text ?? r.content ?? r.reviewText ?? "",
    createdAt:
      r.createdAt ?? r.updatedAt ?? r.created_at ?? new Date().toISOString(),
  }));
}
