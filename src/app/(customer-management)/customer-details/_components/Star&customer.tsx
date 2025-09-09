// components/CustomerComponents.tsx
"use client";

import React from 'react';
import { AlertCircle, CheckCircle, X, Star } from 'lucide-react';
import { getInitials } from '@/lib/utility/Customer-Details-utils';

// Toast Component
// Profile Picture Component
export const ProfilePicture = ({
    name,
    size = "small"
}: {
    name: string;
    size?: "small" | "large"
}) => {
    const sizeClasses = size === "large" ? "w-12 h-12 text-lg" : "w-10 h-10 text-base font-light";

    return (
        <div className={`${sizeClasses} bg-[#2c2c2c] rounded-full flex items-center justify-center text-white`}>
            {getInitials(name).toUpperCase()}
        </div>
    );
};

// Star Rating Component
export const StarRating = ({ rating }: { rating: number }) => {
    return (
        <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    size={14}
                    className={
                        star <= rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                    }
                />
            ))}
        </div>
    );
};

// Large Star Rating Component
export const LargeStarRating = ({ rating }: { rating: number }) => {
    return (
        <div className="flex items-center justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    size={32}
                    className={
                        star <= rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                    }
                />
            ))}
        </div>
    );
};