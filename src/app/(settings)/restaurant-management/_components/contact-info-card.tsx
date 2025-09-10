// components/ContactInfoCard.tsx
import React from 'react';
import { Phone } from 'lucide-react';
import { SimpleInput } from './SimpleInput';
import { SimpleTextarea } from './SimpleTextarea';
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
        <div className="bg-white rounded-sm p-8 shadow-sm border border-gray-200 min-h-[600px] flex flex-col">
            <div className="flex items-center gap-2 mb-8">
                <Phone className="text-black" size={24} />
                <h2 className="text-xl font-semibold">Contact Information</h2>
            </div>

            <div className="space-y-6 flex-grow">
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
            </div>
        </div>
    );
};