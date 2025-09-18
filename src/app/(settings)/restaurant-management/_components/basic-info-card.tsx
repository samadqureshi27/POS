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
        <Card className="shadow-sm min-h-[600px] flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Store size={24} />
                    Basic Information
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 flex-grow">

                <div>
                    <Label htmlFor="restaurant-name">
                        Restaurant Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="restaurant-name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={onInputChange}
                        placeholder="Enter restaurant name"
                        required
                    />
                </div>

                <div>
                    <Label>
                        Restaurant Type <span className="text-destructive">*</span>
                    </Label>
                    <RestaurantDropdown
                        value={formData.type}
                        options={restaurantTypeOptions}
                        onValueChange={(value) => onDropdownChange("type", value)}
                        placeholder="Select restaurant type"
                    />
                </div>

                <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={onInputChange}
                        placeholder="Brief description of your restaurant"
                        rows={3}
                    />
                </div>

                <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                        id="website"
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={onInputChange}
                        placeholder="Enter your website URL"
                    />
                </div>
            </CardContent>
        </Card>
    );
};