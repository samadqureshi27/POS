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

export const ContactInfoCard: React.FC<ContactInfoCardProps> = ({
    formData,
    onInputChange,
}) => {
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
                    value={formData.contact}
                    onChange={onInputChange}
                    placeholder="Enter contact number"
                />

                <SimpleInput
                    label="Email Address"
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={onInputChange}
                    placeholder="Enter email address"
                />

                <SimpleTextarea
                    label="Address"
                    required
                    name="address"
                    value={formData.address}
                    onChange={onInputChange}
                    placeholder="Enter your address"
                    rows={3}
                />
            </CardContent>
        </Card>
    );
};