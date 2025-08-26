import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./MyInfoTab.css";

type Gender = "M" | "F" | "N";

interface MeResponse {
  email: string;
  nickname: string;
  phone?: string;
  phoneNumber?: string;
  gender: Gender;
}

const MyInfoTab: React.FC = () => {
  const token = useMemo(() => localStorage.getItem("token"), []);

  // 표시용(읽기 전용)
  const [email, setEmail] = useState("");

  // 수정 가능한 폼 상태
  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState<Gender>("N");

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    (async () => {
      try {
        const res = await axios.get<MeResponse>("/api/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;
        setEmail(data.email);
        setNickname(data.nickname ?? "");
        setPhone((data.phone ?? data.phoneNumber) ?? "");
        setGender((data.gender as Gender) ?? "N");
      } catch {
        // 조용히 실패 처리(헤더에서 이미 로그인 상태를 표기하므로 별도 알림 불필요)
      }
    })();
  }, [token]);

  const handleSave = async () => {
    if (!token) {
      setSaveError("로그인이 필요합니다.");
      return;
    }

    try {
      setSaving(true);
      setSaveError(null);
      setSaveSuccess(null);

      await axios.put(
        "/api/user/me",
        { nickname, phone, gender },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSaveSuccess("수정이 완료되었습니다.");
    } catch (e: any) {
      setSaveError(e?.response?.data?.message || "수정 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="my-info-tab">
      <h2>내 정보</h2>

      <div className="info-form">
        <div className="form-group">
          <label>이메일</label>
          <div className="readonly-box">{email || "-"}</div>
        </div>

        <div className="form-group">
          <label htmlFor="nickname">닉네임</label>
          <input
            id="nickname"
            className="form-input"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임을 입력하세요"
            maxLength={30}
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">전화번호</label>
          <input
            id="phone"
            className="form-input"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="010-0000-0000"
            inputMode="tel"
          />
        </div>

        <div className="form-group">
          <label htmlFor="gender">성별</label>
          <select
            id="gender"
            className="form-select"
            value={gender}
            onChange={(e) => setGender(e.target.value as Gender)}
          >
            <option value="M">M</option>
            <option value="F">F</option>
            <option value="N">N</option>
          </select>
        </div>

        <div className="form-actions">
          <button
            onClick={handleSave}
            disabled={saving}
            className="primary-button"
          >
            {saving ? "저장 중..." : "수정하기"}
          </button>
        </div>

        {saveError && <p className="feedback error">{saveError}</p>}
        {saveSuccess && <p className="feedback success">{saveSuccess}</p>}
      </div>
    </div>
  );
};

export default MyInfoTab;
