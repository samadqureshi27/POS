// components/OperatingHours.tsx
import React from 'react';
import { Clock } from 'lucide-react';
import { SimpleInput } from './SimpleInput';

import { getOperatingStatus } from '@/lib/util/timeUtils';


interface OperatingHoursProps {
    openingTime: string;
    closingTime: string;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const OperatingHours: React.FC<OperatingHoursProps> = ({
    openingTime,
    closingTime,
    onInputChange,
}) => {
    const operatingStatus = getOperatingStatus(openingTime, closingTime);

    return (
        <div className="pt-4">
            <div className="flex items-center gap-2 mb-4">
                <Clock className="text-black" size={20} />
                <h3 className="font-medium text-gray-900">
                    Operating Hours
                </h3>
                {operatingStatus && (
                    <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${operatingStatus.color} ml-auto`}
                    >
                        {operatingStatus.status}
                    </span>
                )}
            </div>

            <div className="space-y-4">
                <SimpleInput
                    label="Opening Time"
                    type="time"
                    name="openingTime"
                    value={openingTime}
                    onChange={onInputChange}
                />

                <SimpleInput
                    label="Closing Time"
                    type="time"
                    name="closingTime"
                    value={closingTime}
                    onChange={onInputChange}
                />

                {openingTime && closingTime && (
                    <div className="bg-gray-50 rounded-sm p-3 border">
                        <p className="text-xs font-medium text-gray-700 mb-1">
                            Daily Hours
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                            {openingTime} - {closingTime}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};