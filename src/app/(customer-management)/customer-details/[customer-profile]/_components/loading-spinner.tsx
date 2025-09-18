// @deprecated - Use GlobalSkeleton instead
// This component is kept for backward compatibility but should not be used in new code
import React from 'react';
import { GlobalSkeleton } from '@/components/ui/global-skeleton';

interface LoadingSpinnerProps {
    customerId: number | null;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ customerId }) => {
    return (
        <GlobalSkeleton 
            type="simple" 
            showHeader={true} 
            contentRows={4}
            containerClassName="min-h-screen"
        />
    );
};