import React, { useState, useEffect } from "react";
import {
  fetchUserBookings,
  cancelBooking,
} from "../../../services/reservationService";
import { createReview } from "../../../services/reviewService";
import type { Booking } from "../../../services/reservationService";
import ReviewModal from "./ReviewModal";
import "./MyBookingTab.css";

const MyBookingTab: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const loadBookings = async () => {
    setIsLoading(true);
    const data = await fetchUserBookings();
    setBookings(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleOpenReviewModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleReviewSubmit = async (rating: number, content: string) => {
    if (!selectedBooking) return;
    try {
      await createReview(selectedBooking.reservationId, { rating, content });
      alert("리뷰가 성공적으로 등록되었습니다.");
      setIsModalOpen(false);
      setSelectedBooking(null);
      loadBookings();
    } catch (error) {
      alert("리뷰 등록에 실패했습니다.");
    }
  };

  const handleCancelBooking = async (reservationId: number) => {
    if (window.confirm("해당 예약을 정말로 취소하시겠습니까?")) {
      try {
        await cancelBooking(reservationId);
        alert("예약이 성공적으로 취소되었습니다.");
        loadBookings();
      } catch (error) {
        alert(
          "예약 취소 중 오류가 발생했습니다. 이미 취소되었거나 이용완료된 예약인지 확인해주세요."
        );
      }
    }
  };

  const getStatusInfo = (status: Booking["status"]) => {
    switch (status) {
      case "COMPLETED":
        return { text: "이용완료", className: "status-completed" };
      case "CANCELLED":
        return { text: "예약취소", className: "status-cancelled" };
      case "RESERVED":
        return { text: "예약됨", className: "status-reserved" };
      default:
        return { text: status, className: "" };
    }
  };

  return (
    <div className="my-page-tab-container">
      <h2 className="my-page-tab-title">나의 예약 현황</h2>
      <div className="my-page-tab-content">
        <div className="booking-table-container">
          {isLoading ? (
            <p className="loading-text">예약 내역을 불러오는 중입니다...</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>시설명</th>
                  <th>예약일시</th>
                  <th>상태</th>
                  <th>비고</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length > 0 ? (
                  bookings.map((booking) => {
                    const statusInfo = getStatusInfo(booking.status);
                    return (
                      <tr key={booking.reservationId}>
                        <td>
                          <a
                            href={`/guesthouses/${booking.guesthouseId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {booking.guesthouseName}
                          </a>
                        </td>
                        <td>
                          {booking.checkinDate} ~ {booking.checkoutDate}
                        </td>
                        <td className={statusInfo.className}>
                          {statusInfo.text}
                        </td>
                        <td>
                          {booking.status === "COMPLETED" &&
                            !booking.reviewWritten && (
                              <button
                                className="action-button review"
                                onClick={() => handleOpenReviewModal(booking)}
                              >
                                리뷰 쓰기
                              </button>
                            )}
                          {booking.status === "RESERVED" && (
                            <button
                              className="action-button cancel"
                              onClick={() =>
                                handleCancelBooking(booking.reservationId)
                              }
                            >
                              예약 취소
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="no-results">
                      예약 내역이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {selectedBooking && (
        <ReviewModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleReviewSubmit}
          guesthouseName={selectedBooking.guesthouseName}
        />
      )}
    </div>
  );
};

export default MyBookingTab;