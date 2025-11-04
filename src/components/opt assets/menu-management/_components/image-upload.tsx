import React from "react";
import { X, ImageIcon } from "lucide-react";
import {ImageUploadProps} from "@/lib/types/menum";


const ImageUpload: React.FC<ImageUploadProps> = ({ 
  preview, 
  setPreview, 
  fileInputRef 
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Image
    </label>
    <div className="border-2 border-dashed border-gray-300 rounded-sm p-6 sm:p-8 text-center">
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="max-w-full max-h-32 sm:max-h-40 mx-auto rounded"
          />
          <button
            onClick={() => setPreview(null)}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <ImageIcon className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
          <div className="text-sm text-gray-600">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-blue-600 hover:text-blue-500"
            >
              Upload a file
            </button>
            <span className="hidden sm:inline"> or drag and drop</span>
          </div>
          <p className="text-xs text-gray-500">
            PNG, JPG, GIF up to 10MB
          </p>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) =>
              setPreview(e.target?.result as string);
            reader.readAsDataURL(file);
          }
        }}
        className="hidden"
      />
    </div>
  </div>
);

export default ImageUpload;