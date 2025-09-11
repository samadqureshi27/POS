// components/CustomerFeedbackCard.tsx
import React from 'react';
import { StarRating } from './star-rating';

interface CustomerFeedbackCardProps {
    rating: number;
}

export const CustomerFeedbackCard: React.FC<CustomerFeedbackCardProps> = ({
    rating
}) => {
    return (
        <div className="bg-white rounded-sm border border-gray-300 p-6 shadow-sm flex items-center justify-start h-[140px]">
            <div className="text-start">
                <div className="mb-3">
                    <StarRating rating={rating} size="large" />
                </div>
                <p className="text-base text-gray-500">Customer Feedback</p>
            </div>
        </div>
    );
};