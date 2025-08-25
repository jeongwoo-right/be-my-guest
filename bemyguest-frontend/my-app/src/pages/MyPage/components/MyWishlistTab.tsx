import React, { useState, useEffect } from 'react';
import { fetchUserWishlist } from '../../../services/wishlistService';
import type { Guesthouse } from '../../../services/guesthouseService';
// GuesthouseList 컴포넌트를 재사용하여 UI를 구성합니다.
import GuesthouseList from '../../../components/GuesthouseList'; 
import './MyWishlistTab.css';

const MyWishlistTab: React.FC = () => {
  const [wishlist, setWishlist] = useState<Guesthouse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadWishlist = async () => {
      setIsLoading(true);
      const data = await fetchUserWishlist();
      console.log('찜 목록 API 데이터:', data);
      setWishlist(data);
      setIsLoading(false);
    };

    loadWishlist();
  }, []); // 한 번만 실행

  return (
    <div className="my-wishlist-tab">
      <h2>나의 찜 목록</h2>
      {/* GuesthouseList 컴포넌트는 Guesthouse 배열과 로딩 상태를 props로 받으므로,
        찜 목록 UI를 위해 완벽하게 재사용할 수 있습니다.
      */}
      <GuesthouseList guesthouses={wishlist} isLoading={isLoading} />
    </div>
  );
};

export default MyWishlistTab;