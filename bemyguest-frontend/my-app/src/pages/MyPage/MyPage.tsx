import React, { useState } from "react";
import MyInfoTab from "./components/MyInfoTab";
import MyBookingTab from "./components/MyBookingTab";
import MyReviewTab from "./components/MyReviewTab";
import MyWishlistTab from "./components/MyWishlistTab";

const MyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("info");

  const renderTabContent = () => {
    switch (activeTab) {
      case "info": return <MyInfoTab />;
      case "booking": return <MyBookingTab />;
      case "review": return <MyReviewTab />;
      case "wishlist": return <MyWishlistTab />;
      default: return <MyInfoTab />;
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "20px auto" }}>
      <h2>마이페이지</h2>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button onClick={() => setActiveTab("info")}>나의 정보</button>
        <button onClick={() => setActiveTab("booking")}>나의 예약</button>
        <button onClick={() => setActiveTab("review")}>나의 후기</button>
        <button onClick={() => setActiveTab("wishlist")}>나의 찜</button>
      </div>
      {renderTabContent()}
    </div>
  );
};

export default MyPage;
