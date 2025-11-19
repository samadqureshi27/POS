// components/ContactInfoCard.tsx
import React from 'react';
import { Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleInput } from './simple-input';
import { SimpleTextarea } from './simple-textarea';
import { RestaurantData } from '@/lib/types';

interface ContactInfoCardProps {
    formData: RestaurantData;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

// Default contact data - export it so parent can use it
export const defaultContactData: Partial<RestaurantData> = {
    contact: "+1 (555) 987-6543",
    email: "contact@bellavista-kitchen.com",
    address: "456 Culinary Boulevard, Food District, Downtown, NY 10002"
};

export const ContactInfoCard: React.FC<ContactInfoCardProps> = ({
    formData,
    onInputChange,
}) => {
    // Use default data when formData fields are empty or undefined
    const getFieldValue = (fieldName: keyof typeof defaultContactData) => {
        const value = formData[fieldName] || defaultContactData[fieldName] || '';
        // Ensure we return a string, not a File object
        return typeof value === 'string' ? value : '';
    };

    return (
        <Card className="shadow-sm min-h-[600px] flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Phone size={24} />
                    Contact Information
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 flex-grow">
                <SimpleInput
                    label="Contact Number"
                    required
                    type="tel"
                    name="contact"
                    value={getFieldValue('contact')}
                    onChange={onInputChange}
                    placeholder="Enter contact number"
                />

                <SimpleInput
                    label="Email Address"
                    required
                    type="email"
                    name="email"
                    value={getFieldValue('email')}
                    onChange={onInputChange}
                    placeholder="Enter email address"
                />

                <SimpleTextarea
                    label="Address"
                    required
                    name="address"
                    value={getFieldValue('address')}
                    onChange={onInputChange}
                    placeholder="Enter your address"
                    rows={3}
                />
            </CardContent>
        </Card>
    );
};