import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { BookingModal } from "../components/BookingModal";
import { useListings } from "../hooks/useListings";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/ui/Button";

export const ListingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { selectedListing, loading, error, getListingById } = useListings();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      getListingById(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-96 bg-gray-200 rounded-lg" />
            <div className="h-8 bg-gray-200 rounded w-2/3" />
            <div className="h-6 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !selectedListing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Listing not found
            </h1>
            <Button
              variant="primary"
              onClick={() => navigate("/")}
            >
              Back to listings
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="text-blue-600 hover:text-blue-700 mb-6 font-medium"
        >
          ← Back to listings
        </button>

        {/* Images */}
        <div className="mb-8">
          <div className="w-full h-96 bg-gray-200 rounded-lg overflow-hidden">
            {selectedListing.pictures && selectedListing.pictures.length > 0 ? (
              <img
                src={selectedListing.pictures[0]}
                alt={selectedListing.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No image available
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* Left - Details */}
          <div className="col-span-2 space-y-6">
            {/* Title & Location */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {selectedListing.name}
              </h1>
              <p className="text-lg text-gray-600">
                {selectedListing.location}
              </p>
            </div>

            {/* Divider */}
            <hr className="my-6" />

            {/* About */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About this place
              </h2>
              <p className="text-gray-600 leading-relaxed">
                A beautiful and comfortable place to stay in {selectedListing.location}.
                Perfect for travelers looking for a memorable experience.
              </p>
            </div>

            {/* Amenities Placeholder */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Amenities
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {["WiFi", "Air Conditioning", "Kitchen", "Parking"].map(
                  (amenity) => (
                    <div key={amenity} className="flex items-center gap-2">
                      <span className="text-2xl">✓</span>
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Right - Booking Card */}
          <div>
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-gray-900">
                    ₹{selectedListing.price}
                  </span>
                  <span className="text-lg text-gray-600">/night</span>
                </div>
              </div>

              {isAuthenticated ? (
                <Button
                  variant="primary"
                  onClick={() => setIsBookingModalOpen(true)}
                  className="w-full mb-4"
                >
                  Book Now
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={() => navigate("/login")}
                  className="w-full mb-4"
                >
                  Sign in to Book
                </Button>
              )}

              <div className="space-y-3 pt-4 border-t">
                <p className="text-sm text-gray-600">
                  ✓ Free cancellation before check-in
                </p>
                <p className="text-sm text-gray-600">
                  ✓ Instant booking confirmation
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Booking Modal */}
      {selectedListing && (
        <BookingModal
          listing={selectedListing}
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
        />
      )}
    </div>
  );
};
