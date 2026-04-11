import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useBookings } from "../hooks/useBookings";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../contexts/ToastContext";
import { createPayment, clearPaymentState } from "../slices/paymentsSlice";
import type { AppDispatch, RootState } from "../store";
import { Button } from "../components/ui/Button";
import { DatePicker } from "../components/ui/DatePicker";
import type { Listing } from "../types";

interface BookingModalProps {
  listing: Listing;
  isOpen: boolean;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  listing,

  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { token } = useAuth();
  const { createNewBooking, loading: bookingLoading, error } = useBookings();
  const { showToast } = useToast();
  const { loading: paymentLoading } = useSelector(
    (state: RootState) => state.payments
  );

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [nights, setNights] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState<"booking" | "payment">("booking");

  const calculatePrice = (from: string, to: string) => {
    if (!from || !to) return;

    const fromTime = new Date(from).getTime();
    const toTime = new Date(to).getTime();

    if (toTime <= fromTime) {
      showToast("Check-out date must be after check-in date", "error");
      return;
    }

    const daysDiff = Math.ceil((toTime - fromTime) / (1000 * 60 * 60 * 24));
    setNights(daysDiff);
    setTotalPrice(daysDiff * listing.price);
  };

  const handleFromDateChange = (date: string) => {
    setFromDate(date);
    if (toDate) calculatePrice(date, toDate);
  };

  const handleToDateChange = (date: string) => {
    setToDate(date);
    if (fromDate) calculatePrice(fromDate, date);
  };

  const handleBooking = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (!fromDate || !toDate) {
      showToast("Please select both check-in and check-out dates", "error");
      return;
    }

    try {
      const idempotencyKey = `${listing.id}-${fromDate}-${toDate}-${Date.now()}`;

      const result = await createNewBooking({
        booked_listing: listing.id,
        from: fromDate,
        to: toDate,
        idempotency_key: idempotencyKey,
      });

      if (result.payload) {
        const bookingData = result.payload as { booking: { id: string } };
        const bookingId = bookingData.booking.id;
        setBookingId(bookingId);
        showToast("Booking created! Now complete payment.", "success");
        setStep("payment");
      }
    } catch {
      showToast("Failed to create booking", "error");
    }
  };

  const handlePayment = async () => {
    if (!bookingId) return;

    const result = await dispatch(createPayment({ bookingId, phone }));

    if (createPayment.fulfilled.match(result)) {
      const { payment } = result.payload;

      window.open(payment.short_url, '_blank')
    } else {
      const errorMsg =
        typeof result.payload === "string"
          ? result.payload
          : "Failed to create payment";
      showToast(errorMsg, "error");
    }
  };

  const resetAndClose = () => {
    setFromDate("");
    setToDate("");
    setNights(0);
    setTotalPrice(0);
    setBookingId(null);
    setPhone("");
    setStep("booking");
    dispatch(clearPaymentState());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm"
      onClick={resetAndClose}
    >
      <div
        className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {step === "booking" ? "Book Listing" : "Complete Payment"}
          </h2>
          <button
            onClick={resetAndClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {step === "booking" && (
          <>
            <div className="mb-6 p-4 bg-gray-50 rounded">
              <h3 className="font-semibold text-gray-900">{listing.name}</h3>
              <p className="text-sm text-gray-600">{listing.location}</p>
              <p className="text-lg font-bold text-gray-900 mt-2">
                ₹{listing.price}/night
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check-in Date
                </label>
                <DatePicker
                  value={fromDate}
                  onChange={handleFromDateChange}
                  min={new Date().toISOString().split("T")[0]}
                  placeholder="DD/MM/YYYY"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check-out Date
                </label>
                <DatePicker
                  value={toDate}
                  onChange={handleToDateChange}
                  min={fromDate || new Date().toISOString().split("T")[0]}
                  placeholder="DD/MM/YYYY"
                />
              </div>
            </div>

            {nights > 0 && (
              <div className="space-y-2 mb-6 p-4 bg-gray-50 rounded">
                <div className="flex justify-between text-sm">
                  <span>₹{listing.price} × {nights} nights</span>
                  <span>₹{totalPrice}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span>₹{totalPrice}</span>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={resetAndClose}
                className="flex-1"
                disabled={bookingLoading}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleBooking}
                className="flex-1"
                disabled={bookingLoading || !fromDate || !toDate}
              >
                {bookingLoading ? "Booking..." : "Book Now"}
              </Button>
            </div>
          </>
        )}

        {step === "payment" && (
          <>
            <div className="mb-6 p-4 bg-gray-50 rounded">
              <h3 className="font-semibold text-gray-900">Payment Details</h3>
              <p className="text-sm text-gray-600 mt-1">
                {listing.name}
              </p>
              <p className="text-sm text-gray-600">
                {nights} night{nights !== 1 ? "s" : ""}
              </p>
              <p className="text-xl font-bold text-gray-900 mt-2">
                Total: ₹{totalPrice.toLocaleString()}
              </p>
            </div>

            {paymentLoading && (
              <div className="text-center py-4">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-2 text-gray-600">Preparing payment...</p>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setStep("booking")}
                className="flex-1"
                disabled={paymentLoading}
              >
                Back
              </Button>
              <Button
                variant="primary"
                onClick={handlePayment}
                className="flex-1"
                disabled={paymentLoading}
              >
                {paymentLoading ? "Processing..." : "Pay Now"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
