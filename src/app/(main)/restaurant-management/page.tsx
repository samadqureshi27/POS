// app/(main)/restaurant-profile/page.tsx
"use client";

import React, { useState, ChangeEvent, useRef } from "react";
import { Image as ImageIcon } from "lucide-react";

// Fake API
const fakeApi = {
  saveRestaurantProfile: async (data: Omit<RestaurantData, "logo">) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.setItem("restaurantProfile", JSON.stringify(data));
        resolve(true);
      }, 1000);
    });
  },
};

interface RestaurantData {
  name: string;
  type: string;
  contact: string;
  email: string;
  address: string;
  logo: File | null;
}

export default function RestaurantProfile() {
  const [formData, setFormData] = useState<RestaurantData>({
    name: "",
    type: "",
    contact: "",
    email: "",
    address: "",
    logo: null,
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && file.type.startsWith("image/")) {
      setFormData((prev) => ({ ...prev, logo: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setFormData((prev) => ({ ...prev, logo: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const handleReset = () => {
    setFormData({
      name: "",
      type: "",
      contact: "",
      email: "",
      address: "",
      logo: null,
    });
    setPreviewUrl(null);
  };

  const handleSubmit = async () => {
    const { name, type, contact, email, address, logo } = formData;

    // Validation check
    if (!name || !type || !contact || !email || !address || !logo) {
      alert("❌ Please fill in all fields and upload a logo before saving.");
      return;
    }

    // Simulated API Save
    const dataToSave = { ...formData, logo: undefined }; // exclude logo file
    await fakeApi.saveRestaurantProfile(dataToSave);
    alert("✅ Restaurant profile saved (via fake API)!");
  };

  return (
    <div className="min-h-screen pl-30 bg-gray-50 px-10 py-8">
      <h1 className="text-3xl font-bold mb-6">Restaurant Profile</h1>

      <div className="flex flex-wrap gap-8">
        {/* Left Form Fields */}
        <div className="flex-1 min-w-[300px] max-w-lg space-y-3">
          <p className="text-xl">NAME</p>
          <input
            name="name"
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md"
          />
          <p className="text-xl">Type</p>
          <div className="relative w-full">
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full px-4 py-2 pr-10 border rounded-md appearance-none"
            >
              <option value="">Select Type</option>
              <option value="Dine In">Dine In</option>
              <option value="Take Away">Take Away</option>
              <option value="Both">Both</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M19 9l-7 7-7-7"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <p className="text-xl">Contact</p>
          <input
            name="contact"
            type="text"
            placeholder="Contact Info"
            value={formData.contact}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md"
          />
          <p className="text-xl">Email</p>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md"
          />
          <p className="text-xl">Address</p>
          <input
            name="address"
            type="text"
            placeholder="Address"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        {/* Right File Upload */}
        <div className="flex-1 min-w-[300px] pr-20">
          <label className="block text-xl font-semibold mb-2 text-gray-700">
            Logo
          </label>
          <div
            className="relative border-2 border-dashed border-gray-300 rounded-lg p-8 h-[355px] bg-white flex flex-col justify-center items-center hover:bg-gray-50 transition"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            {previewUrl ? (
              <>
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-40 object-contain mb-4"
                />
                <button
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, logo: null }));
                    setPreviewUrl(null);
                  }}
                  className="absolute top-3 right-3 text-gray-500 text-2xl hover:text-gray-800"
                  title="Remove image"
                >
                  ×
                </button>
              </>
            ) : (
              <>
                <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
                <p className="text-gray-500 text-base text-center">
                  Drag and drop your logo here
                </p>
                <button
                  type="button"
                  onClick={handleClickUpload}
                  className="mt-3 px-4 py-2 bg-[#D1AB35] text-white rounded hover:bg-yellow-600"
                >
                  Click to Upload
                </button>
              </>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="hidden"
              title="Upload Logo"
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-8 pl-283 py-20 flex gap-9">
        <button
          onClick={handleReset}
          className="px-15 py-3 rounded-md bg-white shadow-md hover:shadow-lg hover:bg-gray-100"
        >
          Reset
        </button>
        <button
          onClick={handleSubmit}
          className="px-15 py-3 bg-[#D1AB35] text-white shadow-md hover:shadow-lg rounded-md hover:bg-yellow-600"
        >
          Save
        </button>
      </div>
    </div>
  );
}
