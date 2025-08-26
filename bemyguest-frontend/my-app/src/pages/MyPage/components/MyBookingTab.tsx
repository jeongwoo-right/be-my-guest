import React, { useState, useEffect } from 'react';
import { fetchUserBookings, cancelBooking } from '../../../services/reservationService';
import type { Booking } from '../../../services/reservationService';
import './MyBookingTab.css';

const MyBookingTab: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);

  // 예약 목록을 불러오는 함수 (재사용을 위해 분리)
  const loadBookings = async () => {
    setIsLoading(true);
    // 로그인된 사용자의 데이터를 가져오도록 userId 인자 제거
    const data = await fetchUserBookings();
    setBookings(data);
    setIsLoading(false);
  };

  // 컴포넌트가 처음 마운트될 때 예약 목록 로드
  useEffect(() => {
    loadBookings();
  }, []);

  // 예약 취소 버튼 클릭 핸들러
  const handleCancelBooking = async () => {
    if (selectedBookingId === null) {
      alert('취소할 예약을 선택해주세요.');
      return;
    }
    
    if (window.confirm('선택한 예약을 정말로 취소하시겠습니까?')) {
      try {
        await cancelBooking(selectedBookingId);
        alert('예약이 성공적으로 취소되었습니다.');
        setSelectedBookingId(null); // 선택 상태 초기화
        loadBookings(); // 목록 새로고침
      } catch (error) {
        // 백엔드에서 보낸 에러 메시지를 보여주면 더 좋습니다.
        alert('예약 취소 중 오류가 발생했습니다.');
      }
    }
  };

  // 예약 상태에 따른 텍스트와 클래스 반환 함수
  const getStatusInfo = (status: Booking['status']) => {
    switch (status) {
      case 'COMPLETED': return { text: '이용완료', className: 'status-completed' };
      case 'CANCELLED': return { text: '예약취소', className: 'status-cancelled' };
      case 'RESERVED': return { text: '예약됨', className: 'status-reserved' };
      default: return { text: status, className: '' };
    }
  };

  return (
    <div className="my-booking-tab">
      <h2>나의 예약 현황</h2>
      
      <div className="booking-table-container">
        {isLoading ? (
          <p className="loading-text">예약 내역을 불러오는 중입니다...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>선택</th>
                <th>시설명</th>
                <th>예약일시</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length > 0 ? (
                bookings.map(booking => {
                  const statusInfo = getStatusInfo(booking.status);
                  return (
                    <tr key={booking.reservationId}>
                      <td>
                        <input
                          type="radio"
                          name="booking-selection"
                          value={booking.reservationId}
                          checked={selectedBookingId === booking.reservationId}
                          onChange={() => setSelectedBookingId(booking.reservationId)}
                          // 예약됨 상태가 아니면 비활성화
                          disabled={booking.status !== 'RESERVED'}
                        />
                      </td>
                      <td>
                        <a href={`/guesthouses/${booking.guesthouseId}`} target="_blank" rel="noopener noreferrer">
                          {booking.guesthouseName}
                        </a>
                      </td>
                      <td>{booking.checkinDate} ~ {booking.checkoutDate}</td>
                      <td className={statusInfo.className}>{statusInfo.text}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="no-results">예약 내역이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      
      <div className="tab-actions">
        <button 
          onClick={handleCancelBooking} 
          disabled={selectedBookingId === null}
        >
          예약 취소
        </button>
      </div>
    </div>
  );
};

export default MyBookingTab;