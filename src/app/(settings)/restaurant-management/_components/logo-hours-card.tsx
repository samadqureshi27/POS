// components/LogoHoursCard.tsx
import React from 'react';
import { Image } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogoUpload } from './logo-upload';
import { OperatingHours } from './operating-hours';
import { RestaurantData } from '@/lib/types';

interface LogoHoursCardProps {
    formData: RestaurantData;
    previewUrl: string | null;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onLogoChange: (file: File) => void;
    onRemoveLogo: () => void;
}

export const LogoHoursCard: React.FC<LogoHoursCardProps> = ({
    formData,
    previewUrl,
    onInputChange,
    onLogoChange,
    onRemoveLogo,
}) => {
    return (
        <Card className="shadow-sm min-h-[600px] flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Image size={24} />
                    Logo & Hours
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 flex-grow">
                <LogoUpload
                    previewUrl={previewUrl}
                    onLogoChange={onLogoChange}
                    onRemoveLogo={onRemoveLogo}
                />

                <OperatingHours
                    openingTime={formData.openingTime}
                    closingTime={formData.closingTime}
                    onInputChange={onInputChange}
                />
            </CardContent>
        </Card>
    );
};