import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { ListingCard } from "../components/ListingCard";
import { SearchFilters } from "../components/SearchFilters";
import { Button } from "../components/ui/Button";
import { useListings } from "../hooks/useListings";
import { useApiError } from "../hooks/useApiError";
import type { Listing } from "../types";

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { listings, loading, error, getListings } = useListings();
  const { error: apiError } = useApiError();
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);

  useEffect(() => {
    getListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setFilteredListings(listings);
  }, [listings]);

  const handleSearch = (filters: {
    location?: string;
    minPrice?: number;
    maxPrice?: number;
  }) => {
    let filtered = [...listings];

    if (filters.location) {
      filtered = filtered.filter((l) =>
        l.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    if (filters.minPrice) {
      filtered = filtered.filter((l) => l.price >= filters.minPrice!);
    }

    if (filters.maxPrice) {
      filtered = filtered.filter((l) => l.price <= filters.maxPrice!);
    }

    setFilteredListings(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Explore Stays
            </h1>
            <p className="text-lg text-gray-600">
              Discover amazing places to stay around the world
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => navigate("/listings/new")}
          >
            + Create Listing
          </Button>
        </div>

        {/* Search & Filters */}
        <SearchFilters onSearch={handleSearch} />

        {/* Error State */}
        {(error || apiError) && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">
              {error || apiError || "An error occurred"}
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-gray-200 rounded-lg h-96"
              />
            ))}
          </div>
        )}

        {/* Listings Grid */}
        {!loading && filteredListings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredListings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">
              No listings found. Try adjusting your filters.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};
