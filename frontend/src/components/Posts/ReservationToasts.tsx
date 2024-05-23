import { useState, useEffect } from "react";
import { Toast } from "react-bootstrap";
import { formatDistanceToNow } from "date-fns";

type ReservationToastProps = {
  showReservationToast: boolean;
  onClose: () => void;
};

const ReservationToast: React.FC<ReservationToastProps> = ({ showReservationToast, onClose }) => {
  const [reservationTime, setReservationTime] = useState<Date | null>(null);

  useEffect(() => {
    if (showReservationToast) {
      // Set the reservation time when the toast is shown
      setReservationTime(new Date());
    } else {
      // Reset the reservation time when the toast is hidden
      setReservationTime(null);
    }
  }, [showReservationToast]);

  return (
    <Toast
      show={showReservationToast}
      onClose={onClose}
      delay={10000}
      autohide
      className="position-fixed bottom-0 end-0 p-3 mb-3"
      style={{ zIndex: 9999 }}
    >
      <Toast.Header>
        <strong className="me-auto">Reservation</strong>
        {reservationTime && <small>{formatDistanceToNow(reservationTime)} ago</small>}
      </Toast.Header>
      <Toast.Body>Item has been reserved. Check your Inbox.</Toast.Body>
    </Toast>
  );
};

export default ReservationToast;
