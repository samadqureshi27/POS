import React from "react";
import { GeneralSettings } from '@/lib/types';
import ButtonPage from "@/components/ui/button";

interface OrderTimerCardProps {
    settings: GeneralSettings;
    onSettingChange: (key: keyof GeneralSettings, value: any) => void;
}

const OrderTimerCard: React.FC<OrderTimerCardProps> = ({ settings, onSettingChange }) => {
    return (
        <div className="bg-white rounded-sm p-8 shadow-sm border border-gray-200 min-h-[450px]">
            <div className="flex items-center gap-2 mb-8">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12,6 12,12 16,14"></polyline>
                </svg>
                <h2 className="text-xl font-semibold">Order Timer Settings</h2>
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <label className="block text-sm font-medium text-gray-500">
                            Enable Order Timer
                        </label>
                        <p className="text-xs text-gray-500">
                            Show color-coded timer on orders
                        </p>
                    </div>
                    <ButtonPage
                        checked={settings.orderTimerEnabled}
                        onChange={(isActive) => onSettingChange("orderTimerEnabled", isActive)}
                    />
                </div>

                {settings.orderTimerEnabled && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-2">
                                <span className="inline-flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    Green Phase (minutes)
                                </span>
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="60"
                                value={settings.greenThresholdMinutes}
                                onChange={(e) => onSettingChange("greenThresholdMinutes", parseInt(e.target.value))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent"
                                placeholder="Minutes for green status"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Timer shows green from 0 to this time
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-2">
                                <span className="inline-flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    Yellow Phase (minutes)
                                </span>
                            </label>
                            <input
                                type="number"
                                min={settings.greenThresholdMinutes + 1}
                                max="120"
                                value={settings.yellowThresholdMinutes}
                                onChange={(e) => onSettingChange("yellowThresholdMinutes", parseInt(e.target.value))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent"
                                placeholder="Minutes for yellow status"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Timer shows yellow from {settings.greenThresholdMinutes} to this time
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-2">
                                <span className="inline-flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    Red Phase (starts at minutes)
                                </span>
                            </label>
                            <input
                                type="number"
                                min={settings.yellowThresholdMinutes + 1}
                                max="180"
                                value={settings.redThresholdMinutes}
                                onChange={(e) => onSettingChange("redThresholdMinutes", parseInt(e.target.value))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent"
                                placeholder="Minutes when red starts"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Timer shows red after {settings.yellowThresholdMinutes} minutes
                            </p>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <label className="block text-sm font-medium text-gray-500">
                                    Reset Timer on Complete
                                </label>
                                <p className="text-xs text-gray-500">
                                    Auto reset when order is completed
                                </p>
                            </div>
                            <ButtonPage
                                checked={settings.timerResetOnComplete}
                                onChange={(isActive) => onSettingChange("timerResetOnComplete", isActive)}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default OrderTimerCard;