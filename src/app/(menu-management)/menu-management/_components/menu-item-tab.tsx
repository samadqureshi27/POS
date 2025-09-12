import React from "react";
import ImageUpload from "./image-upload";
import ButtonPage from "@/components/layout/ui/button";
import {MenuItemTabProps,MenuItem} from "@/lib/types/menum";

const MenuItemTab: React.FC<MenuItemTabProps> = ({
    formData,
    updateFormData,
    handleFormFieldChange,
    handleStatusChange,
    preview,
    setPreview,
    fileInputRef,
}) => {
    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Menu Item Name
                </label>
                <input
                    type="text"
                    value={formData.Name}
                    onChange={(e) => handleFormFieldChange("Name", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
                    placeholder="Sweet / Spicy Sausage Wrap"
                    required
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                    </label>
                    <input
                        type="text"
                        value={formData.Category}
                        onChange={(e) => handleFormFieldChange("Category", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
                        placeholder="Enter category"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Display Type
                    </label>
                    <select
                        value={formData.Displaycat}
                        onChange={(e) => handleFormFieldChange("Displaycat", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
                    >
                        <option value="Var">Var</option>
                        <option value="Qty">Qty</option>
                        <option value="Weight">Weight</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                </label>
                <input
                    type="number"
                    value={formData.Price || ""}
                    disabled={formData.Displaycat === "Var"}
                    onChange={(e) => handleFormFieldChange("Price", Number(e.target.value) || 0)}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] ${formData.Displaycat === "Var"
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : ""
                        }`}
                    placeholder="0.00"
                />
            </div>

            <ImageUpload
                preview={preview}
                setPreview={setPreview}
                fileInputRef={fileInputRef}
            />

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                </label>
                <textarea
                    value={formData.Description}
                    onChange={(e) => handleFormFieldChange("Description", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
                    rows={3}
                    placeholder="Enter description"
                />
            </div>

            <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                    Status
                </label>
                <ButtonPage
                    checked={formData.Status === "Active"}
                    onChange={(checked) => handleStatusChange("Status", checked)}
                />
            </div>
        </div>
    );
};

export default MenuItemTab;