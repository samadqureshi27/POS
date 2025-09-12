// components/CustomerProfileHeader.tsx
import React from 'react';
import { ArrowLeft } from "lucide-react";

interface CustomerProfileHeaderProps {
    onBackClick: () => void;
}

export const CustomerProfileHeader: React.FC<CustomerProfileHeaderProps> = ({
    onBackClick
}) => {
    return (
        <div className="flex items-center gap-4 mb-8 mt-2">
            <button
                onClick={onBackClick}
                className="p-2 hover:bg-gray-100 rounded-sm"
            >
                <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <h1 className="text-3xl font-semibold">Customer Profile</h1>
        </div>
    );
};