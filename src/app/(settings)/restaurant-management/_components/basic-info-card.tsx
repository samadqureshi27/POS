// components/BasicInfoCard.tsx
import React from 'react';
import { Store } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RestaurantDropdown } from './restaurant-dropdown';
import { RestaurantData } from '@/lib/types';

interface BasicInfoCardProps {
    formData: RestaurantData;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onDropdownChange: (key: keyof RestaurantData, value: string) => void;
}

// Default restaurant data
const defaultRestaurantData: Partial<RestaurantData> = {
    name: "Bella Vista Italian Kitchen",
    type: "All",
    description: "Authentic Italian cuisine with fresh ingredients and traditional recipes passed down through generations. We offer a warm, family-friendly atmosphere perfect for any occasion.",
    website: "https://bellavista-kitchen.com",
    contact: "+1 (555) 123-4567",
    email: "info@bellavista-kitchen.com",
    address: "123 Main Street, Downtown, NY 10001",
    openingTime: "09:00",
    closingTime: "22:00"
};

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

    // Use default data when formData fields are empty or undefined
    const getFieldValue = (fieldName: keyof typeof defaultRestaurantData) => {
        return formData[fieldName] || defaultRestaurantData[fieldName] || '';
    };

    return (
        <Card className="shadow-sm min-h-[600px] flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Store size={24} />
                    Basic Information
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 flex-grow">

                <div>
                    <Label className="mb-2" htmlFor="restaurant-name">
                        Restaurant Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="restaurant-name"
                        type="text"
                        name="name"
                        value={getFieldValue('name')}
                        onChange={onInputChange}
                        placeholder="Enter restaurant name"
                        required
                    />
                </div>

                <div>
                    <Label className="mb-2" htmlFor="owner-name">
                        Owner Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="owner-name"
                        type="text"
                        name="contact"
                        value="Marco Giuseppe"
                        onChange={onInputChange}
                        placeholder="Enter owner name"
                        required
                    />
                </div>

                <div>
                    <Label className="mb-2">
                        Restaurant Type <span className="text-destructive">*</span>
                    </Label>
                    <RestaurantDropdown
                        value={getFieldValue('type')}
                        options={restaurantTypeOptions}
                        onValueChange={(value) => onDropdownChange("type", value)}
                        placeholder="Select restaurant type"
                    />
                </div>

                

                <div>
                    <Label className="mb-2" htmlFor="website">Website</Label>
                    <Input
                        id="website"
                        type="url"
                        name="website"
                        value={getFieldValue('website')}
                        onChange={onInputChange}
                        placeholder="Enter your website URL"
                    />
                </div>
            </CardContent>
        </Card>
    );
};