"use client";
// components/ui/StarRating.tsx
import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  size?: number;
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  size = 14, 
  className 
}) => {
  return (
    <div className={cn("flex items-center", className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={cn(
            "transition-colors",
            star <= rating
              ? "text-yellow-400 fill-yellow-400"
              : "text-muted-foreground/30"
          )}
        />
      ))}
    </div>
  );
};