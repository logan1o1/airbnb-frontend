import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchListingById, updateListing } from "../slices/listingsSlice";
import type { AppDispatch, RootState } from "../store";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Form,
  FormGroup,
  FormLabel,
  Input,
  FormError,
  Button,
} from "../components";
import { useToast } from "../contexts/ToastContext";

export const EditListingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { selectedListing, loading, error } = useSelector((state: RootState) => state.listings);

  const [formData, setFormData] = useState({
    name: selectedListing?.name || "",
    location: selectedListing?.location || "",
    price: selectedListing?.price.toString() || "",
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>(selectedListing?.pictures || []);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchListingById(id));
    }
  }, [id, dispatch]);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!formData.location.trim()) {
      errors.location = "Location is required";
    }

    if (!formData.price) {
      errors.price = "Price is required";
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      errors.price = "Price must be a positive number";
    }

    return errors;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFiles(Array.from(files));
      
      const urls = Array.from(files).map((file) => URL.createObjectURL(file));
      setPreviewUrls(urls);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    setIsSubmitting(true);

    const data = new FormData();
    data.append("name", formData.name.trim());
    data.append("location", formData.location.trim());
    data.append("price", formData.price);
    
    selectedFiles.forEach((file, index) => {
      data.append(`pictures[${index}]`, file);
    });

    if (id) {
      const result = await dispatch(updateListing({ id, formData: data }));
  
      if (updateListing.fulfilled.match(result)) {
        showToast("Listing updated successfully!", "success");
        navigate("/listings");
      } else {
        const errorMsg = typeof result.payload === "string" ? result.payload : "Failed to update listing";
        showToast(errorMsg, "error");
      }
    }

    setIsSubmitting(false);
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  if (loading && !selectedListing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading listing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <button
          onClick={() => navigate("/listings")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to My Listings
        </button>
        <Card>
          <CardHeader>
            <CardTitle>Edit Listing</CardTitle>
            <CardDescription>
              Update your property details
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <FormLabel htmlFor="name">Property Name</FormLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="Cozy Apartment in Downtown"
                  value={formData.name}
                  onChange={handleChange("name")}
                  disabled={loading || isSubmitting}
                  required
                />
                {validationErrors.name && (
                  <FormError>{validationErrors.name}</FormError>
                )}
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="location">Location</FormLabel>
                <Input
                  id="location"
                  type="text"
                  placeholder="New York, NY"
                  value={formData.location}
                  onChange={handleChange("location")}
                  disabled={loading || isSubmitting}
                  required
                />
                {validationErrors.location && (
                  <FormError>{validationErrors.location}</FormError>
                )}
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="price">Price (per night in ₹)</FormLabel>
                <Input
                  id="price"
                  type="number"
                  placeholder="5000"
                  value={formData.price}
                  onChange={handleChange("price")}
                  disabled={loading || isSubmitting}
                  required
                />
                {validationErrors.price && (
                  <FormError>{validationErrors.price}</FormError>
                )}
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="pictures">Add More Pictures</FormLabel>
                <input
                  id="pictures"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  disabled={loading || isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {previewUrls.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {selectedFiles.length > 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    {selectedFiles.length} new file(s) selected
                  </p>
                )}
              </FormGroup>

              {error && <FormError>{error}</FormError>}

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={loading || isSubmitting}
                  variant="primary"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
                
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate("/listings")}
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
