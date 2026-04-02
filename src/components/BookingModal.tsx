import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBookings } from "../hooks/useBookings";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../contexts/ToastContext";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
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
  const { token } = useAuth();
  const { createNewBooking, loading, error } = useBookings();
  const { showToast } = useToast();

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [nights, setNights] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Calculate nights and total price
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
        showToast("Booking created successfully!", "success");
        onClose();
        setFromDate("");
        setToDate("");
        setNights(0);
        setTotalPrice(0);
      }
    } catch {
      showToast("Failed to create booking", "error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Book Listing</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Listing Info */}
        <div className="mb-6 p-4 bg-gray-50 rounded">
          <h3 className="font-semibold text-gray-900">{listing.name}</h3>
          <p className="text-sm text-gray-600">{listing.location}</p>
          <p className="text-lg font-bold text-gray-900 mt-2">
            ₹{listing.price}/night
          </p>
        </div>

        {/* Date Inputs */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Check-in Date
            </label>
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => handleFromDateChange(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Check-out Date
            </label>
            <Input
              type="date"
              value={toDate}
              onChange={(e) => handleToDateChange(e.target.value)}
              min={fromDate || new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>

        {/* Price Breakdown */}
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

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={onClose}
            className="flex-1"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleBooking}
            className="flex-1"
            disabled={loading || !fromDate || !toDate}
          >
            {loading ? "Booking..." : "Book Now"}
          </Button>
        </div>
      </div>
    </div>
  );
};
