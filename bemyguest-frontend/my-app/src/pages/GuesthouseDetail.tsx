import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { addWish, removeWish, getWishList } from "../services/wish";




/** ───────────────── Types ───────────────── */

type ReservationRequest = {
  userId: number;
  guesthouseId: number;
  checkinDate: string;   // YYYY-MM-DD
  checkoutDate: string;  // YYYY-MM-DD
};

type ReservationResponse = {
  id: number;
  userId: number;
  guesthouseId: number;
  checkinDate: string;
  checkoutDate: string;
  status: "RESERVED" | "CANCELLED" | "COMPLETED";
  createdAt: string;
  updatedAt: string;
};

type Guesthouse = {
  id: number;
  name: string;
  address: string;
  region: string;
  capacity: number;
  price: number;
  description: string;

  // booleans can be true/false/null or be missing
  wifi?: boolean | null;
  parking?: boolean | null;
  breakfast?: boolean | null;
  airConditioner?: boolean | null;
  tv?: boolean | null;
  laundry?: boolean | null;
  kitchen?: boolean | null;
  petAllowed?: boolean | null;
};

type ReservationInput = {
  checkIn: string;   // YYYY-MM-DD
  checkOut: string;  // YYYY-MM-DD
  guests: number;
};

type Review = {
  id: number;
  userId: number;
  userName: string;
  rating: number; // 1..5
  text: string;
  createdAt: string; // ISO string
};

/** ───────────────── Config ───────────────── */
const MOCK_MODE = false; // 실제 API 사용

/** 테스트용 로그인/회원 상태 (실제 로그인 붙기 전까지) */
const DEMO_USER = { id: 1, name: "나", isMember: true };

/** ───────────────── Component ───────────────── */
export default function GuesthouseDetail() {
  const { id } = useParams();
  const gid = id ?? ""; // for localStorage keys

const [likeBusy, setLikeBusy] = useState(false);
const [likedLoading, setLikedLoading] = useState(true);


  const [data, setData] = useState<Guesthouse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // member / like local states
  const [isMember, setIsMember] = useState<boolean>(DEMO_USER.isMember);
  const [liked, setLiked] = useState<boolean>(false);

  // reservation
  const [showReserve, setShowReserve] = useState(false);
  const [reserveForm, setReserveForm] = useState<ReservationInput>({
    checkIn: "",
    checkOut: "",
    guests: 1,
  });
  const [reserveMsg, setReserveMsg] = useState<string | null>(null);
  const [reserving, setReserving] = useState(false);

  // reviews
  const [reviews, setReviews] = useState<Review[]>([]);
  const [editing, setEditing] = useState<Review | null>(null);
  const [reviewDraft, setReviewDraft] = useState<{ rating: number; text: string }>({
    rating: 5,
    text: "",
  });

  /** Fetch guesthouse */
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get<Guesthouse>(`/guesthouses/${id}`);
        setData(res.data);
      } catch (e: any) {
        setError(e?.message ?? "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  /** Load liked + reviews from localStorage (mock persistence) */
// ❶ reviews: keep localStorage (unchanged)
useEffect(() => {
  if (!gid) return;
  try {
    const raw = localStorage.getItem(`gh:${gid}:reviews`);
    setReviews(raw ? (JSON.parse(raw) as Review[]) : []);
  } catch {
    setReviews([]);
  }
}, [gid]);

// ❷ liked: sync from server list whenever route/user changes
useEffect(() => {
  const run = async () => {
    setLikedLoading(true);
    try {
      if (!id || !isMember) {
        setLiked(false);
        return;
      }
      const list = await getWishList(DEMO_USER.id); // TODO: 실제 로그인 사용자 ID
      const currentId = Number(id);
      const has = list.some(w => w.guesthouseId === currentId);
      setLiked(has);
      // optional fallback cache
      localStorage.setItem(`gh:${id}:liked`, has ? "1" : "0");
    } catch (e) {
      // 서버 조회 실패 시 로컬 캐시로 폴백
      const lk = localStorage.getItem(`gh:${id}:liked`);
      if (lk) setLiked(lk === "1");
    } finally {
      setLikedLoading(false);
    }
  };
  run();
}, [id, isMember]);

  /** Persist liked/reviews */
  useEffect(() => {
    if (!gid) return;
    localStorage.setItem(`gh:${gid}:liked`, liked ? "1" : "0");
  }, [gid, liked]);

  useEffect(() => {
    if (!gid) return;
    localStorage.setItem(`gh:${gid}:reviews`, JSON.stringify(reviews));
  }, [gid, reviews]);

  const formatKRW = useMemo(
    () => new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }),
    []
  );

  /** Like toggle (local-only; wire to backend later if needed) */
const toggleLike = async () => {
  if (!data || likeBusy) return;

  if (!isMember) {
    alert("회원만 이용 가능합니다.");
    return;
  }

  const userId = DEMO_USER.id;                           // TODO: 실제 로그인 사용자 ID로 교체
  const guesthouseId = data?.id ?? Number(id);           // URL과 데이터 동기화 보장
  if (!Number.isFinite(guesthouseId)) return;

  const next = !liked;
  setLiked(next);        // UI 낙관적 업데이트
  setLikeBusy(true);

  try {
    if (next) {
      await addWish(userId, guesthouseId);               // 찜 추가
    } else {
      await removeWish(userId, guesthouseId);            // 찜 해제 (스펙 확정되면 wish.ts에서 한 패턴만 남기세요)
    }
    // 성공 시 LocalStorage도 반영(이미 하고 있다면 생략 가능)
    localStorage.setItem(`gh:${guesthouseId}:liked`, next ? "1" : "0");
  } catch (e) {
    // 실패 시 롤백
    console.error("[wish] toggle failed", e);
    setLiked(!next);
    alert("찜 처리에 실패했습니다. 잠시 후 다시 시도해주세요.");
  } finally {
    setLikeBusy(false);
  }
};

  /** Reservation submit */
const submitReservation = async () => {
  if (!id) return;
  setReserveMsg(null);

  // basic client-side validation
  if (!reserveForm.checkIn || !reserveForm.checkOut) {
    setReserveMsg("체크인/체크아웃 날짜를 선택해주세요.");
    return;
  }
  if (reserveForm.checkIn >= reserveForm.checkOut) {
    setReserveMsg("체크아웃 날짜는 체크인보다 뒤여야 합니다.");
    return;
  }
  if (!isMember) {
    setReserveMsg("회원만 예약할 수 있습니다.");
    return;
  }
  if (reserveForm.guests > (data?.capacity ?? 1)) {
    setReserveMsg(`최대 인원(${data?.capacity}명)을 초과했습니다.`);
    return;
  }

  try {
    const payload: ReservationRequest = {
      userId: 1, // TODO: 로그인 연동 시 실제 사용자 ID 사용
      guesthouseId: Number(id),
      checkinDate: reserveForm.checkIn,   // "YYYY-MM-DD"
      checkoutDate: reserveForm.checkOut, // "YYYY-MM-DD"
    };

    const res = await api.post("/reservations", payload);

    if (res.status !== 201 && res.status !== 200) {
      throw new Error(`Unexpected status ${res.status}`);
    }

    const created: any = res.data;
    setReserveMsg(`예약이 생성되었습니다! (예약번호 #${created?.id ?? "알수없음"})`);
    setShowReserve(false);
    setReserveForm({ checkIn: "", checkOut: "", guests: 1 });
  } catch (e: any) {
    const status = e?.response?.status;
    const body = e?.response?.data;

    // Normalize error message (string or JSON object)
    let msg = "예약 생성에 실패했습니다.";
    if (typeof body === "string") {
      msg = body;
    } else if (body && typeof body === "object") {
      msg = body.message || body.error || JSON.stringify(body);
    } else if (e?.message) {
      msg = e.message;
    }

    // Common cases
    if (status === 409) msg = "해당 기간에는 이미 예약이 존재합니다.";
    if (status === 404) msg = "사용자 또는 게스트하우스를 찾을 수 없습니다.";
    if (status === 400 && /Unrecognized|Cannot deserialize|JSON parse/i.test(String(body))) {
      msg = "요청 형식이 서버와 일치하지 않습니다. (필드명/날짜형식 확인)";
    }
    if (status === 403) msg = "권한이 없습니다. (로그인이 필요할 수 있어요)";

    setReserveMsg(msg);
    // 디버깅용 로그 (원인 파악 시 유용)
    // console.error("Reservation error:", { status, body, err: e });
  }
};


  /** Review create/update/delete (mock) */
  const submitReview = async () => {
    if (!id) return;
    const now = new Date().toISOString();
    if (!reviewDraft.text.trim()) return;

    if (editing) {
      const updated = reviews.map((r) =>
        r.id === editing.id ? { ...r, rating: reviewDraft.rating, text: reviewDraft.text } : r
      );
      setReviews(updated);
      setEditing(null);
    } else {
      const newReview: Review = {
        id: Date.now(),
        userId: DEMO_USER.id,
        userName: DEMO_USER.name,
        rating: reviewDraft.rating,
        text: reviewDraft.text,
        createdAt: now,
      };
      setReviews([newReview, ...reviews]);
    }

    if (!MOCK_MODE) {
      // await api.post(`/guesthouses/${id}/reviews`, ...);
    }
    setReviewDraft({ rating: 5, text: "" });
  };

  const startEditReview = (r: Review) => {
    setEditing(r);
    setReviewDraft({ rating: r.rating, text: r.text });
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const deleteReview = (rid: number) => {
    setReviews((prev) => prev.filter((r) => r.id !== rid));
    if (!MOCK_MODE) {
      // await api.delete(`/guesthouses/${id}/reviews/${rid}`);
    }
  };

  /** ──────────────── Render ──────────────── */
  if (loading) return <div style={styles.page}>불러오는 중...</div>;
  if (error) return <div style={styles.page}>에러: {error}</div>;
  if (!data) return <div style={styles.page}>데이터가 없습니다.</div>;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.headerRow}>
          <div>
            <h1 style={{ margin: 0, fontSize: 28 }}>{data.name}</h1>
            <div style={{ color: "#666", marginTop: 6 }}>
              {data.address} • {data.region} • 최대 {data.capacity}명
            </div>
            <div style={{ marginTop: 10, fontSize: 18, fontWeight: 600 }}>
              {formatKRW.format(data.price)} / 1박
            </div>
          </div>

          {/* Actions */}
          <div style={styles.actions}>
<button
  onClick={toggleLike}
  aria-pressed={liked}
  disabled={likeBusy || likedLoading}
  style={{
    ...styles.btn,
    ...styles.btnGhost,
    borderColor: liked ? "#f66" : "#ddd",
    opacity: likeBusy || likedLoading ? 0.6 : 1,
    pointerEvents: likeBusy || likedLoading ? "none" : "auto",
  }}
>
  {liked ? "❤️ 찜 해제" : "🤍 찜하기"}
</button>



            <button
              onClick={() => setShowReserve(true)}
              disabled={!isMember}
              title={isMember ? "예약하기" : "회원만 예약 가능"}
              style={{
                ...styles.btn,
                ...(isMember ? styles.btnPrimary : styles.btnDisabled),
                marginLeft: 8,
              }}
            >
              예약하기
            </button>
          </div>
        </div>

        <p style={{ marginTop: 16, lineHeight: 1.6 }}>{data.description}</p>

        {/* Facilities */}
        <h2 style={{ marginTop: 24, fontSize: 20 }}>시설</h2>
        <div style={styles.facilityGrid}>
          <Facility label="Wi-Fi"        value={data.wifi}           icon="📶" />
          <Facility label="주차"          value={data.parking}        icon="🅿️" />
          <Facility label="조식"          value={data.breakfast}      icon="🍳" />
          <Facility label="에어컨"        value={data.airConditioner} icon="❄️" />
          <Facility label="TV"           value={data.tv}             icon="📺" />
          <Facility label="세탁"          value={data.laundry}        icon="🧺" />
          <Facility label="주방"          value={data.kitchen}        icon="🍽️" />
          <Facility label="반려동물"      value={data.petAllowed}     icon="🐶" />
        </div>

        {/* Reviews */}
        <h2 style={{ marginTop: 28, fontSize: 20 }}>후기</h2>
        {reviews.length === 0 ? (
          <div style={{ color: "#666" }}>아직 후기가 없습니다.</div>
        ) : (
          <div style={{ marginTop: 10 }}>
            {reviews.map((r) => (
              <div key={r.id} style={styles.reviewItem}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <strong>{r.userName}</strong>{" "}
                    <span aria-label={`rating ${r.rating}`}>{renderStars(r.rating)}</span>
                    <span style={{ color: "#999", marginLeft: 8 }}>
                      {new Date(r.createdAt).toLocaleDateString("ko-KR")}
                    </span>
                  </div>
                  {r.userId === DEMO_USER.id && (
                    <div>
                      <button style={{ ...styles.linkBtn }} onClick={() => startEditReview(r)}>
                        수정
                      </button>
                      <button
                        style={{ ...styles.linkBtn, color: "#c00", marginLeft: 8 }}
                        onClick={() => deleteReview(r.id)}
                      >
                        삭제
                      </button>
                    </div>
                  )}
                </div>
                <div style={{ marginTop: 6, whiteSpace: "pre-wrap" }}>{r.text}</div>
              </div>
            ))}
          </div>
        )}

        {/* Review form */}
        <div style={styles.reviewForm}>
          <div style={{ marginBottom: 6, fontWeight: 600 }}>
            {editing ? "후기 수정" : "후기 작성"}
          </div>
          <div>
            <label style={{ marginRight: 8 }}>평점:</label>
            <StarPicker
              value={reviewDraft.rating}
              onChange={(v) => setReviewDraft((d) => ({ ...d, rating: v }))}
            />
          </div>
          <textarea
            placeholder="숙소 후기를 작성해주세요."
            value={reviewDraft.text}
            onChange={(e) => setReviewDraft((d) => ({ ...d, text: e.target.value }))}
            rows={4}
            style={styles.textarea}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ ...styles.btn, ...styles.btnPrimary }} onClick={submitReview}>
              {editing ? "수정 완료" : "등록"}
            </button>
            {editing && (
              <button
                style={{ ...styles.btn, ...styles.btnGhost }}
                onClick={() => {
                  setEditing(null);
                  setReviewDraft({ rating: 5, text: "" });
                }}
              >
                취소
              </button>
            )}
          </div>
        </div>

        {/* Dev-only membership toggle (remove when auth 붙이면 됨) */}
        <div style={{ marginTop: 24, color: "#777" }}>
          <label>
            <input
              type="checkbox"
              checked={isMember}
              onChange={(e) => setIsMember(e.target.checked)}
            />{" "}
            테스트용: 회원 상태로 보기
          </label>
        </div>
      </div>

      {/* Reservation modal */}
      {showReserve && (
        <div style={styles.modalBackdrop} onClick={() => setShowReserve(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0 }}>예약하기</h3>
            <div style={styles.formRow}>
              <label style={styles.label}>체크인</label>
              <input
                type="date"
                value={reserveForm.checkIn}
                onChange={(e) => setReserveForm((f) => ({ ...f, checkIn: e.target.value }))}
                style={styles.input}
              />
            </div>
            <div style={styles.formRow}>
              <label style={styles.label}>체크아웃</label>
              <input
                type="date"
                value={reserveForm.checkOut}
                onChange={(e) => setReserveForm((f) => ({ ...f, checkOut: e.target.value }))}
                style={styles.input}
              />
            </div>
            <div style={styles.formRow}>
              <label style={styles.label}>인원</label>
              <input
                type="number"
                min={1}
                max={data.capacity}
                value={reserveForm.guests}
                onChange={(e) =>
                  setReserveForm((f) => ({ ...f, guests: Math.max(1, Number(e.target.value)) }))
                }
                style={styles.input}
              />
            </div>

            {reserveMsg && <div style={{ color: "#c00", marginBottom: 8 }}>{reserveMsg}</div>}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button
                style={{ ...styles.btn, ...styles.btnGhost }}
                onClick={() => setShowReserve(false)}
                disabled={reserving}
              >
                취소
              </button>
              <button
                style={{ ...styles.btn, ...styles.btnPrimary }}
                onClick={submitReservation}
                disabled={reserving}
              >
                {reserving ? "예약 요청 중..." : "예약 요청"}
              </button>
            </div>
            <div style={{ marginTop: 8, color: "#888", fontSize: 12 }}>
              * 실제 API 연결 상태입니다.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** ───────────────── Small UI helpers ───────────────── */

function Facility({
  label,
  value,
  icon,
}: {
  label: string;
  value?: boolean | null;
  icon: string;
}) {
  const state = value === true ? "on" : value === false ? "off" : "unknown";
  const caption = state === "on" ? "제공" : state === "off" ? "미제공" : "정보 없음";

  return (
    <div
      style={{
        ...styles.facilityItem,
        opacity: state === "on" ? 1 : 0.6,
        borderStyle: state === "unknown" ? "dashed" : "solid",
      }}
      title={`${label}: ${caption}`}
    >
      <span style={{ fontSize: 20 }}>{icon}</span>
      <span style={{ marginTop: 6 }}>{label}</span>
      <span style={{ marginTop: 2, fontSize: 12, color: state === "on" ? "#0a7" : "#999" }}>
        {caption}
      </span>
    </div>
  );
}

function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <span>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          style={{
            ...styles.starBtn,
            opacity: n <= value ? 1 : 0.35,
          }}
          aria-label={`rating ${n}`}
          type="button"
        >
          ★
        </button>
      ))}
    </span>
  );
}

function renderStars(n: number) {
  return "★★★★★".slice(0, n) + "☆☆☆☆☆".slice(0, 5 - n);
}

/** ───────────────── Styles ───────────────── */
const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    padding: 24,
    background: "#f6f7fb",
  },
  card: {
    width: "100%",
    maxWidth: 880,
    background: "#fff",
    borderRadius: 16,
    padding: 24,
    boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "center",
  },
  actions: { display: "flex", alignItems: "center" },
  facilityGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
    gap: 12,
    marginTop: 12,
  },
  facilityItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    border: "1px solid #eee",
    borderRadius: 12,
    padding: 12,
    background: "#fafafa",
    transition: "opacity .2s ease",
  },

  // buttons
  btn: {
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid transparent",
    cursor: "pointer",
    fontWeight: 600,
  },
  btnPrimary: {
    background: "#0a7",
    color: "#fff",
  },
  btnGhost: {
    background: "#fff",
    border: "1px solid #ddd",
  },
  btnDisabled: {
    background: "#eee",
    color: "#999",
    cursor: "not-allowed",
  },
  linkBtn: {
    background: "transparent",
    border: "none",
    color: "#06c",
    cursor: "pointer",
    padding: 0,
    fontWeight: 600,
  },

  // reviews
  reviewItem: {
    border: "1px solid #eee",
    borderRadius: 12,
    padding: 12,
    background: "#fafafa",
    marginBottom: 10,
  },
  reviewForm: {
    marginTop: 12,
    borderTop: "1px solid #eee",
    paddingTop: 12,
  },
  textarea: {
    width: "100%",
    marginTop: 8,
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ddd",
    resize: "vertical",
  },
  starBtn: {
    fontSize: 22,
    background: "transparent",
    border: "none",
    cursor: "pointer",
  },

  // modal
  modalBackdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.35)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    zIndex: 1000,
  },
  modal: {
    width: "100%",
    maxWidth: 520,
    background: "#fff",
    borderRadius: 12,
    padding: 16,
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  },
  formRow: { display: "flex", alignItems: "center", margin: "8px 0" },
  label: { width: 90, color: "#555" },
  input: {
    flex: 1,
    padding: "8px 10px",
    borderRadius: 8,
    border: "1px solid #ddd",
  },
};
