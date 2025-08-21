import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

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

export default function GuesthouseDetail() {
  const { id } = useParams();
  const [data, setData] = useState<Guesthouse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        // Thanks to Vite proxy, this forwards to http://localhost:8080
        const res = await fetch(`/api/guesthouses/${id}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as Guesthouse;
        setData(json);
      } catch (e: any) {
        setError(e?.message ?? "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const formatKRW = useMemo(
    () => new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }),
    []
  );

  if (loading) return <div style={styles.page}>불러오는 중...</div>;
  if (error) return <div style={styles.page}>에러: {error}</div>;
  if (!data) return <div style={styles.page}>데이터가 없습니다.</div>;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={{ margin: 0, fontSize: 28 }}>{data.name}</h1>
        <div style={{ color: "#666", marginTop: 6 }}>
          {data.address} • {data.region} • 최대 {data.capacity}명
        </div>

        <div style={{ marginTop: 16, fontSize: 18, fontWeight: 600 }}>
          {formatKRW.format(data.price)} / 1박
        </div>

        <p style={{ marginTop: 16, lineHeight: 1.6 }}>{data.description}</p>

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
      </div>
    </div>
  );
}

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

const styles: Record<string, React.CSSProperties> = {
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
};
