// components/CustomerProfileCard.tsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CustomerItem } from '@/lib/types/customer-profile';
import { ProfilePicture } from './profile-picture';
import { StarRating } from './star-rating';

interface CustomerProfileCardProps {
    customer: CustomerItem;
}

export const CustomerProfileCard: React.FC<CustomerProfileCardProps> = ({
    customer
}) => {
    return (
        <Card className="shadow-sm h-[294px]">
            <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                    <ProfilePicture name={customer.Name} size="large" />
                    <div>
                        <h3 className="text-xl font-semibold">{customer.Name}</h3>
                        <p className="text-muted-foreground text-sm">{customer.Email}</p>
                        <div className="flex items-center gap-2 mt-2">
                            <StarRating rating={customer.Feedback_Rating} />
                        </div>
                    </div>
                </div>

                <div className="space-y-4 text-base">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">ID:</span>
                        <span>#{String(customer.Customer_ID).padStart(3, "0")}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Contact:</span>
                        <span>{customer.Contact}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Address:</span>
                        <span className="text-right">{customer.Address}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Since:</span>
                        <span>{customer.Registration_Date}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Card Status:</span>
                        <Badge variant={customer.Card_Status === "Active" ? "default" : "destructive"}>
                            {customer.Card_Status}
                        </Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};