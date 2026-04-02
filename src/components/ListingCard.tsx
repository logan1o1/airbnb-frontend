import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "./ui/Card";
import type { Listing } from "../types";

interface ListingCardProps {
  listing: Listing;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const navigate = useNavigate();

  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => navigate(`/listings/${listing.id}`)}
    >
      {/* Image */}
      <div className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden mb-4">
        {listing.pictures && listing.pictures.length > 0 ? (
          <img
            src={listing.pictures[0]}
            alt={listing.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No image
          </div>
        )}
      </div>

      {/* Info */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {listing.name}
        </h3>

        <p className="text-sm text-gray-600">{listing.location}</p>

        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-lg font-bold text-gray-900">
            ₹{listing.price}
            <span className="text-sm text-gray-600 font-normal">/night</span>
          </span>
          <button className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600">
            View
          </button>
        </div>
      </div>
    </Card>
  );
};
