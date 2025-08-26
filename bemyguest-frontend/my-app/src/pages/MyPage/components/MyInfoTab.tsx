import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

type Gender = "M" | "F" | "N";

interface MeResponse {
  email: string;
  nickname: string;
  // 백엔드 응답이 phone 또는 phoneNumber 중 무엇을 주더라도 커버
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
    // 로그인X 상태
    if (!token) {
      return;
    }


    // 로그인 상태라면
    (async () => {
      try {
        const res = await axios.get<MeResponse>("/api/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data;
        setEmail(data.email);
        setNickname(data.nickname ?? "");
        setPhone(data.phone ?? "");
        setGender((data.gender as Gender) ?? "N");
      } 
      catch (e: any) {

      }       
    })();
  }, [token]);



  const handleSave = async () => {
    // 로그인 X 상태
    if (!token) {
      setSaveError("로그인이 필요합니다.");
      return;
    }

    // 로그인 상태
    try {
      setSaving(true);
      setSaveError(null);
      setSaveSuccess(null);

      // 백엔드 사양에 맞춰 phone 키로 전송
      await axios.put(
        "/api/user/me",
        { nickname, phone, gender },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSaveSuccess("수정이 완료되었습니다.");
    } 
    catch (e: any) {
      setSaveError(e?.response?.data?.message || "수정 중 오류가 발생했습니다.");
    }
    finally {
      setSaving(false);
    }
  };


  return (
    <div>
      <div>
        <label>이메일</label>
        <div>{email}</div>
      </div>

      <div>
        <label htmlFor="nickname">닉네임</label>
        <input id="nickname" type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="닉네임을 입력하세요"/>
      </div>

      <div>
        <label htmlFor="phone">전화번호</label>
        <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="010-0000-0000"/>
      </div>

      <div>
        <label htmlFor="gender">성별</label>
        <select id="gender" value={gender} onChange={(e) => setGender(e.target.value as Gender)}>
          <option value="M">M</option>
          <option value="F">F</option>
          <option value="N">N</option>
        </select>
      </div>

      <div>
        <button onClick={handleSave} disabled={saving}>
          {saving ? "저장 중..." : "수정하기"}
        </button>
      </div>

      {saveError && <p>{saveError}</p>}
      {saveSuccess && <p>{saveSuccess}</p>}
    </div>
  );
};

export default MyInfoTab;
