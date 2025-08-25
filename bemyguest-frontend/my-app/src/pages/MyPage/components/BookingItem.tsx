import React from 'react';
import type { Booking } from '../../../services/reservationService';
import './BookingItem.css'; // BookingItem 전용 CSS

interface BookingItemProps {
  booking: Booking;
}

const BookingItem: React.FC<BookingItemProps> = ({ booking }) => {
  // 예약 상태에 따라 다른 스타일을 적용하기 위한 함수
  const getStatusClass = (status: Booking['status']) => {
    switch (status) {
      case 'COMPLETED': return 'status-completed';
      case 'CANCELLED': return 'status-cancelled';
      case 'RESERVED': return 'status-reserved';
      default: return '';
    }
  };

  return (
    <div className="booking-item">
      <div className="booking-info">
        <span className={`booking-status ${getStatusClass(booking.status)}`}>
          {booking.status}
        </span>
        <h3 className="guesthouse-name">{booking.guesthouseName}</h3>
        <p className="booking-dates">
          {booking.checkinDate} ~ {booking.checkoutDate}
        </p>
      </div>
      <div className="booking-actions">
        {/* 예약 상태가 COMPLETED일 때만 리뷰 작성 버튼을 보여주는 로직 */}
        {booking.status === 'COMPLETED' && (
          <button className="review-button">리뷰 쓰기</button>
        )}
      </div>
    </div>
  );
};

export default BookingItem;