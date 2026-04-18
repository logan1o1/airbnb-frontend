import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { Navbar } from "../components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useBookings } from "../hooks/useBookings";
import { useListings } from "../hooks/useListings";
import { confirmToast } from "../utils/confirmToast";
import type { AppDispatch } from "../store";

export const MyBookingsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { bookings, error, getBookings, cancelBooking } = useBookings();
  const { listings, getListings } = useListings();
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      await getBookings();
      await getListings();
      setInitialLoading(false);
    };
    load();
  }, []);

  const handleCancelClick = (bookingId: string) => {
    confirmToast({
      title: "Cancel Booking?",
      message: "Are you sure you want to cancel this booking?",
      confirmText: "Yes, Cancel",
      cancelText: "Keep",
      onConfirm: () => handleCancelBooking(bookingId),
    });
  };

  const handleCancelBooking = async (bookingId: string) => {
    setCancellingId(bookingId);
    try {
      const result = await dispatch(cancelBooking(bookingId));
      if (cancelBooking.fulfilled.match(result)) {
        toast.success("Booking cancelled successfully");
      } else {
        toast.error((result.payload as string) || "Failed to cancel booking");
      }
    } catch {
      toast.error("Failed to cancel booking");
    } finally {
      setCancellingId(null);
    }
  };

  const activeBookings = bookings.filter((b) => b.status !== "cancelled");

  const getListingName = (listingId: string) => {
    return listings.find((l) => l.id === listingId)?.name || "Unknown Listing";
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            My Bookings
          </h1>
          <p className="text-lg text-gray-600">
            View and manage all your bookings
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {initialLoading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-gray-200 rounded-lg h-48"
              />
            ))}
          </div>
        )}

        {/* Bookings List */}
        {!initialLoading && activeBookings.length > 0 && (
          <div className="space-y-4">
            {activeBookings.map((booking) => (
              <Card
                key={booking.id}
                className={`transition-opacity duration-200 ${cancellingId === booking.id ? "opacity-50" : ""}`}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>
                        {getListingName(booking.booked_listing)}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        Booking ID: {booking.id}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(
                        booking.status
                      )}`}
                    >
                      {booking.status.charAt(0).toUpperCase() +
                        booking.status.slice(1)}
                    </span>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Check-in</p>
                      <p className="font-semibold text-gray-900">
                        {formatDate(booking.from)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Check-out</p>
                      <p className="font-semibold text-gray-900">
                        {formatDate(booking.to)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Nights</p>
                      <p className="font-semibold text-gray-900">
                        {Math.ceil(
                          (new Date(booking.to).getTime() -
                            new Date(booking.from).getTime()) /
                          (1000 * 60 * 60 * 24)
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Booked</p>
                      <p className="font-semibold text-gray-900">
                        {formatDate(booking.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        navigate(`/listings/${booking.booked_listing}`)
                      }
                    >
                      View Listing
                    </Button>
                    {(booking.status === "pending" || booking.status === "failed") && (
                      <Button
                        variant="danger"
                        size="sm"
                        disabled={cancellingId === booking.id}
                        onClick={() => handleCancelClick(booking.id)}
                      >
                        {cancellingId === booking.id ? "Cancelling..." : "Cancel Booking"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!initialLoading && activeBookings.length === 0 && (
          <Card>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-lg text-gray-600 mb-4">
                  You haven't made any bookings yet.
                </p>
                <Button
                  variant="primary"
                  onClick={() => navigate("/")}
                >
                  Browse Listings
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};
