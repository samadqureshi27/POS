// components/LogoUpload.tsx
import React from 'react';
import { Upload, Camera, Trash2 } from 'lucide-react';
import { useFileUpload } from '../../../../lib/hooks/useFileUpload';

interface LogoUploadProps {
    previewUrl: string | null;
    onLogoChange: (file: File) => void;
    onRemoveLogo: () => void;
}

export const LogoUpload: React.FC<LogoUploadProps> = ({
    previewUrl,
    onLogoChange,
    onRemoveLogo,
}) => {
    const {
        dragActive,
        fileInputRef,
        handleDrag,
        handleDrop,
        handleClickUpload,
        handleFileInputChange,
    } = useFileUpload(onLogoChange);

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Restaurant Logo
            </label>
            <div
                className={`relative border-2 border-dashed rounded-sm p-6 bg-gray-50 flex flex-col justify-center items-center hover:bg-gray-100 transition-all duration-300 cursor-pointer ${dragActive
                        ? "border-gray-500 bg-blue-50"
                        : "border-gray-300"
                    }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={handleClickUpload}
            >
                {previewUrl ? (
                    <div className="relative group">
                        <img
                            src={previewUrl}
                            alt="Restaurant Logo"
                            className="max-h-32 max-w-full object-contain mb-4 rounded-sm shadow-md"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleClickUpload();
                                }}
                                className="bg-white text-gray-900 rounded-sm p-2 hover:bg-gray-100 transition-colors"
                                title="Change logo"
                            >
                                <Camera size={16} />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRemoveLogo();
                                }}
                                className="bg-red-500 text-white rounded-sm p-2 hover:bg-red-600 transition-colors"
                                title="Remove logo"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                        <p className="text-sm text-gray-600 text-center mt-2">
                            Click to change logo
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="p-3 bg-white rounded-full shadow-sm mb-4">
                            <Upload className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-gray-700 text-center text-sm font-medium mb-2">
                            Drag and drop your logo here
                        </p>
                        <p className="text-xs text-gray-500 mb-4">
                            or click to browse files
                        </p>
                        <div className="px-4 py-2 bg-[#2C2C2C] text-white hover:bg-gray-700 text-xs font-medium rounded-sm transition-colors">
                            Upload Logo
                        </div>
                    </>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                />
            </div>
            <p className="text-xs text-gray-500 text-center">
                Supported formats: JPG, PNG, GIF (Max 5MB)
            </p>
        </div>
    );
};