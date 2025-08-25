import React, { useState, useEffect } from 'react';
import { fetchUserBookings } from '../../../services/reservationService';
import type { Booking } from '../../../services/reservationService';
import BookingItem from './BookingItem';
import './MyBookingTab.css';

const MyBookingTab: React.FC = () => {
  // 1. 상태 관리: 예약 목록, 로딩 상태
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 2. 컴포넌트가 처음 렌더링될 때 API 호출
  useEffect(() => {
    const loadBookings = async () => {
      setIsLoading(true);
      const userId = 1; // 사용자 ID를 1로 가정
      const data = await fetchUserBookings(userId);
      setBookings(data);
      setIsLoading(false);
    };

    loadBookings();
  }, []); // 빈 배열을 전달하여 한 번만 실행되도록 설정

  // 3. 렌더링 로직
  return (
    <div className="my-booking-tab">
      <h2>나의 예약 내역</h2>
      <div className="booking-list">
        {isLoading ? (
          <p>예약 내역을 불러오는 중입니다...</p>
        ) : bookings.length > 0 ? (
          bookings.map(booking => (
            <BookingItem key={booking.reservationId} booking={booking} />
          ))
        ) : (
          <p>예약 내역이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default MyBookingTab;