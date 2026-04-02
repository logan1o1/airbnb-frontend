import React, { useState } from "react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";

interface SearchFiltersProps {
  onSearch: (filters: {
    location?: string;
    minPrice?: number;
    maxPrice?: number;
  }) => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({ onSearch }) => {
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleSearch = () => {
    onSearch({
      location: location || undefined,
      minPrice: minPrice ? parseInt(minPrice) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
    });
  };

  const handleReset = () => {
    setLocation("");
    setMinPrice("");
    setMaxPrice("");
    onSearch({});
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Filters</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <Input
            type="text"
            placeholder="Search location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Min Price
          </label>
          <Input
            type="number"
            placeholder="Min ₹"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Price
          </label>
          <Input
            type="number"
            placeholder="Max ₹"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>

        <div className="flex items-end gap-2">
          <Button
            variant="primary"
            onClick={handleSearch}
            className="flex-1"
          >
            Search
          </Button>
          <Button
            variant="secondary"
            onClick={handleReset}
            className="flex-1"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};
