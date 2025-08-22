import React, { useEffect, useState } from "react";
import axios from "axios";

interface UserInfo {
  email: string;
  nickname: string;
  phoneNumber?: string;
  gender: "M" | "F" | "N";
}

const MyInfoTab: React.FC = () => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get<UserInfo>("http://localhost:8080/api/user/me", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setUser(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleUpdate = () => {
    axios.put("http://localhost:8080/api/user/me", user, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => {
      alert("수정 완료!");
      setIsEditing(false);
    }).catch(err => console.error(err));
  };

  if (!user) return <p>로딩 중...현재 MyInfoTab입니다.</p>;

  return (
    <div>
      {isEditing ? (
        <div>
          <input
            type="text"
            value={user.nickname}
            onChange={(e) => setUser({ ...user, nickname: e.target.value })}
          />
          <input
            type="text"
            value={user.phoneNumber || ""}
            onChange={(e) => setUser({ ...user, phoneNumber: e.target.value })}
          />
          <button onClick={handleUpdate}>저장</button>
          <button onClick={() => setIsEditing(false)}>취소</button>
        </div>
      ) : (
        <div>
          <p>이메일: {user.email}</p>
          <p>닉네임: {user.nickname}</p>
          <p>전화번호: {user.phoneNumber || "없음"}</p>
          <p>성별: {user.gender}</p>
          <button onClick={() => setIsEditing(true)}>수정하기</button>
        </div>
      )}
    </div>
  );
};

export default MyInfoTab;
