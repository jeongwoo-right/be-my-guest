import React, { useState } from "react";
import MyInfoTab from "./components/MyInfoTab";
import MyBookingTab from "./components/MyBookingTab";
import MyReviewTab from "./components/MyReviewTab";
import MyWishlistTab from "./components/MyWishlistTab";
import Sidebar from "./components/Sidebar";
import "./MyPage.css";
import "./MyPageCommon.css"

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
  <div className="mypage-container">
    {/* <h2 className="mypage-title">마이페이지</h2> */}
    <div className="mypage-layout">
      {/* 왼쪽: 사이드바 (activeTab을 런타임에서 TabKey로 안전하게 좁혀서 전달) */}
      <Sidebar
        activeTab={
          (activeTab === "info" ||
            activeTab === "booking" ||
            activeTab === "review" ||
            activeTab === "wishlist"
            ? activeTab
            : "info") as "info" | "booking" | "review" | "wishlist"
        }
        onChange={(k) => setActiveTab(k)}  // onChange 시그니처를 TabKey로 고정
    />
      {/* 오른쪽: 렌더링 영역 */}
      <section className="mypage-content">
        {renderTabContent()}
      </section>
    </div>
  </div>
  );
};

export default MyPage;
