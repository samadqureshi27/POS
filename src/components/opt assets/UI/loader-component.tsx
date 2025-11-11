"use client";
import React from 'react';
import LoadingSpinner from './loading-spinner';

interface LoaderComponentProps {
    message?: string;
}

const LoaderComponent: React.FC<LoaderComponentProps> = ({ message = "Loading..." }) => {
    return (
        <div className="flex justify-center items-center min-h-screen bg-background">
            <div className="text-center">
                <LoadingSpinner size="lg" color="primary" />
                <p className="mt-4 text-muted-foreground">{message}</p>
            </div>
        </div>
    );
};

export default LoaderComponent;