// components/CustomerFeedbackCard.tsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { StarRating } from './star-rating';

interface CustomerFeedbackCardProps {
    rating: number;
}

export const CustomerFeedbackCard: React.FC<CustomerFeedbackCardProps> = ({
    rating
}) => {
    return (
        <Card className="shadow-sm">
            <CardContent className="p-6 flex items-center justify-start h-[140px]">
                <div className="text-start">
                    <div className="mb-3">
                        <StarRating rating={rating} size="large" />
                    </div>
                    <p className="text-base text-muted-foreground">Customer Feedback</p>
                </div>
            </CardContent>
        </Card>
    );
};