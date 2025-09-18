// components/tables/TopCustomersTable.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CustomerItem } from '@/lib/types/analytics';
import { StarRating } from '@/components/ui/StarRating';

interface TopCustomersTableProps {
  customers: CustomerItem[];
}

export const TopCustomersTable: React.FC<TopCustomersTableProps> = ({ customers }) => {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Top Customers</CardTitle>
        <CardDescription>By total orders</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {customers.map((customer) => (
            <div key={customer.Customer_ID} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {customer.Name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{customer.Name}</p>
                  <p className="text-sm text-muted-foreground">{customer.Email}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{customer.Total_Orders} orders</p>
                <StarRating rating={customer.Feedback_Rating} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

