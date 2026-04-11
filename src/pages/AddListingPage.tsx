import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createListingWithImage } from "../slices/listingsSlice";
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

export const AddListingPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { loading, error } = useSelector((state: RootState) => state.listings);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    price: "",
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

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
      
      // Create preview URLs for all files
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

    // Debug: check how many files we're trying to upload
    console.log("Selected files count:", selectedFiles.length);
    console.log("Files:", selectedFiles.map(f => f.name));

    // Create FormData for multipart upload
    const data = new FormData();
    data.append("name", formData.name.trim());
    data.append("location", formData.location.trim());
    data.append("price", formData.price);
    
    // Append each file as pictures - use indexed approach for Rails
    selectedFiles.forEach((file, index) => {
      data.append(`pictures[${index}]`, file);
    });

    console.log("FormData pictures entries:", data.getAll("pictures"));

    const result = await dispatch(createListingWithImage(data));

    if (createListingWithImage.fulfilled.match(result)) {
      showToast("Listing created successfully!", "success");
      navigate("/");
    } else if (createListingWithImage.rejected.match(result)) {
      const errorMsg = typeof result.payload === "string" ? result.payload : "Failed to create listing";
      showToast(errorMsg, "error");
    }
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>Create New Listing</CardTitle>
            <CardDescription>
              Add your property to start hosting
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
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
                  required
                />
                {validationErrors.price && (
                  <FormError>{validationErrors.price}</FormError>
                )}
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="pictures">Pictures (select multiple)</FormLabel>
                <input
                  id="pictures"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  disabled={loading}
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
                    {selectedFiles.length} file(s) selected
                  </p>
                )}
              </FormGroup>

              {error && <FormError>{error}</FormError>}

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={loading}
                  variant="primary"
                >
                  {loading ? "Creating..." : "Create Listing"}
                </Button>
                
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate(-1)}
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