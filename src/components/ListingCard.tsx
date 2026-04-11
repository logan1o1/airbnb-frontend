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
      className="h-80 flex flex-col overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => navigate(`/listings/${listing.id}`)}
    >
      {/* Image */}
      <div className="w-full h-36 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
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
      <div className="flex-1 flex flex-col justify-between py-3 overflow-hidden">
        <div>
          <h3 className="text-base font-semibold text-gray-900 truncate" title={listing.name}>
            {listing.name}
          </h3>

          <p className="text-sm text-gray-600 truncate mt-1" title={listing.location}>
            {listing.location}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t mt-2">
          <span className="text-base font-bold text-gray-900">
            ₹{listing.price}
            <span className="text-sm text-gray-600 font-normal">/night</span>
          </span>
        </div>
      </div>
    </Card>
  );
};
