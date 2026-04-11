import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchMyListings, deleteListing } from "../slices/listingsSlice";
import type { AppDispatch, RootState } from "../store";
import type { Listing } from "../types";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components";
import { Navbar } from "../components/Navbar";
import { useToast } from "../contexts/ToastContext";

export const MyListingsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { listings, loading, error } = useSelector((state: RootState) => state.listings);
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchMyListings());
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    const result = await dispatch(deleteListing(id));
    if (deleteListing.fulfilled.match(result)) {
      showToast("Listing deleted successfully", "success");
      setDeleteModalId(null);
    } else {
      const errorMsg = typeof result.payload === "string" ? result.payload : "Failed to delete listing";
      showToast(errorMsg, "error");
    }
  };

  const handleEdit = (listing: Listing) => {
    navigate(`/listings/${listing.id}/edit`);
  };

  if (loading && listings.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading your listings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Listings</h1>
            <p className="text-lg text-gray-600">Manage your properties</p>
          </div>
          <Button variant="primary" onClick={() => navigate("/listings/new")}>
            + Add New Listing
          </Button>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {listings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-lg text-gray-600 mb-4">You haven't created any listings yet.</p>
            <Button variant="primary" onClick={() => navigate("/listings/new")}>
              Create Your First Listing
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <Card key={listing.id} className="overflow-hidden">
                <div className="aspect-video bg-gray-200 relative">
                  {listing.pictures && listing.pictures.length > 0 ? (
                    <img
                      src={listing.pictures[0]}
                      alt={listing.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {listing.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">{listing.location}</p>
                  <p className="text-blue-600 font-semibold mb-4">
                    ₹{listing.price.toLocaleString()}/night
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      onClick={() => handleEdit(listing)}
                      className="flex-1"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => setDeleteModalId(listing.id)}
                      className="flex-1"
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {deleteModalId && (
          <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm"
            onClick={() => setDeleteModalId(null)}
          >
            <div
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Delete Listing</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this listing? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <Button
                  variant="danger"
                  onClick={() => handleDelete(deleteModalId)}
                  className="flex-1"
                >
                  Delete
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setDeleteModalId(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
