import React, { useState, useEffect } from 'react';
import { fetchUserWishlist } from '../../../services/wishlistService';
import type { Guesthouse } from '../../../services/guesthouseService';
import GuesthouseList from '../../../components/GuesthouseList'; 
//import './MyWishlistTab.css';

const MyWishlistTab: React.FC = () => {
  const [wishlist, setWishlist] = useState<Guesthouse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadWishlist = async () => {
      setIsLoading(true);
      const data = await fetchUserWishlist();
      setWishlist(data);
      setIsLoading(false);
    };

    loadWishlist();
  }, []);

  return (
    <div className="my-page-tab-container">
      <h2 className="my-page-tab-title">나의 찜 목록</h2>
      <div className="my-page-tab-content">
        <GuesthouseList guesthouses={wishlist} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default MyWishlistTab;