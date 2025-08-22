import React from "react";
import "./Sidebar.css";

type TabKey = "info" | "booking" | "review" | "wishlist";

interface SidebarProps {
  activeTab: TabKey;
  onChange: (key: TabKey) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onChange }) => {
  const items: { key: TabKey; label: string }[] = [
    { key: "info", label: "나의 정보" },
    { key: "booking", label: "나의 예약" },
    { key: "review", label: "나의 후기" },
    { key: "wishlist", label: "나의 찜" },
  ];

  return (
    <nav
      className="sidebar"
      aria-label="마이페이지 사이드바"
      role="tablist"
      aria-orientation="vertical"
    >
      <ul className="sidebar__list">
        {items.map(({ key, label }) => {
          const selected = activeTab === key;
          return (
            <li className="sidebar__item" key={key}>
              <button
                role="tab"
                aria-selected={selected}
                aria-controls={`panel-${key}`}
                className={`sidebar__button ${selected ? "is-active" : ""}`}
                onClick={() => onChange(key)}
              >
                {label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Sidebar;
