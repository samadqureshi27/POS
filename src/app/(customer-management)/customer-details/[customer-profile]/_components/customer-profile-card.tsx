// components/CustomerProfileCard.tsx
import React from 'react';
import { CustomerItem } from '@/lib/types/customerProfile';
import { ProfilePicture } from './ProfilePicture';
import { StarRating } from './StarRating';

interface CustomerProfileCardProps {
    customer: CustomerItem;
}

export const CustomerProfileCard: React.FC<CustomerProfileCardProps> = ({
    customer
}) => {
    return (
        <div className="bg-white rounded-sm border border-gray-300 p-6 shadow-sm h-[294px]">
            <div className="flex items-center gap-4 mb-6">
                <ProfilePicture name={customer.Name} size="large" />
                <div>
                    <h3 className="text-xl font-semibold">{customer.Name}</h3>
                    <p className="text-gray-500 text-sm">{customer.Email}</p>
                    <div className="flex items-center gap-2 mt-2">
                        <StarRating rating={customer.Feedback_Rating} />
                    </div>
                </div>
            </div>

            <div className="space-y-4 text-base">
                <div className="flex justify-between">
                    <span className="text-gray-500">ID:</span>
                    <span>#{String(customer.Customer_ID).padStart(3, "0")}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Contact:</span>
                    <span>{customer.Contact}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Address:</span>
                    <span className="text-right">{customer.Address}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Since:</span>
                    <span>{customer.Registration_Date}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-500">Card Status:</span>
                    <span
                        className={`py-1 rounded-full text-xs font-medium ${customer.Card_Status === "Active"
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                    >
                        {customer.Card_Status}
                    </span>
                </div>
            </div>
        </div>
    );
};