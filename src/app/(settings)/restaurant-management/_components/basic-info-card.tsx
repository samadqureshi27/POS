// components/BasicInfoCard.tsx
import React from 'react';
import { Store } from 'lucide-react';
import { SimpleInput } from './SimpleInput';
import { SimpleTextarea } from './SimpleTextarea';
import { RestaurantDropdown } from './RestaurantDropdown';
import { RestaurantData } from '@/lib/types';

interface BasicInfoCardProps {
    formData: RestaurantData;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onDropdownChange: (key: keyof RestaurantData, value: string) => void;
}

export const BasicInfoCard: React.FC<BasicInfoCardProps> = ({
    formData,
    onInputChange,
    onDropdownChange,
}) => {
    const restaurantTypeOptions = [
        { value: "Dine In", label: "🍽️ Dine In" },
        { value: "Take Away", label: "🥡 Take Away" },
        { value: "Delivery Only", label: "🚚 Delivery Only" },
        { value: "All", label: "🍽️🥡🚚 All (Dine In , Take Away & Delivery)" },
    ];

    return (
        <div className="bg-white rounded-sm p-8 shadow-sm border border-gray-200 min-h-[600px] flex flex-col">
            <div className="flex items-center gap-2 mb-8">
                <Store className="text-black" size={24} />
                <h2 className="text-xl font-semibold">Basic Information</h2>
            </div>

            <div className="space-y-6 flex-grow">
                <SimpleInput
                    label="Restaurant Name"
                    required
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={onInputChange}
                    placeholder="Enter restaurant name"
                />

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Restaurant Type <span className="text-red-500">*</span>
                    </label>
                    <RestaurantDropdown
                        value={formData.type}
                        options={restaurantTypeOptions}
                        onValueChange={(value) => onDropdownChange("type", value)}
                        placeholder="Select restaurant type"
                    />
                </div>

                <SimpleTextarea
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={onInputChange}
                    placeholder="Brief description of your restaurant"
                    rows={3}
                />

                <SimpleInput
                    label="Website"
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={onInputChange}
                    placeholder="Enter your website URL"
                />
            </div>
        </div>
    );
};