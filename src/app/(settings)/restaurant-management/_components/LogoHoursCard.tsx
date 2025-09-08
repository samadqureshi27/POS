// components/LogoHoursCard.tsx
import React from 'react';
import { Image } from 'lucide-react';
import { LogoUpload } from './LogoUpload';
import { OperatingHours } from './OperatingHours';
import { RestaurantData } from '../../../../types/types';

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
        <div className="bg-white rounded-sm p-8 shadow-sm border border-gray-200 min-h-[600px] flex flex-col">
            <div className="flex items-center gap-2 mb-8">
                <Image className="text-black" size={24} />
                <h2 className="text-xl font-semibold">Logo & Hours</h2>
            </div>

            <div className="space-y-6 flex-grow">
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
            </div>
        </div>
    );
};