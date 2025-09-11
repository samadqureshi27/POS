// components/StarRating.tsx
import React from 'react';
import { Star } from "lucide-react";

interface StarRatingProps {
    rating: number;
    size?: 'small' | 'large';
}

export const StarRating: React.FC<StarRatingProps> = ({
    rating,
    size = 'small'
}) => {
    const starSize = size === 'large' ? 32 : 14;

    return (
        <div className={`flex items-center ${size === 'large' ? 'justify-center' : ''}`}>
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    size={starSize}
                    className={
                        star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                    }
                />
            ))}
        </div>
    );
};