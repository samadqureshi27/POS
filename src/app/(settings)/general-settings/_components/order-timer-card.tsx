import React from "react";
import { Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GeneralSettings } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from "@/components/ui/switch";

interface OrderTimerCardProps {
    settings: GeneralSettings;
    onSettingChange: (key: keyof GeneralSettings, value: any) => void;
}

const OrderTimerCard: React.FC<OrderTimerCardProps> = ({ settings, onSettingChange }) => {
    return (
        <Card className="shadow-sm max-h-[450px]">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Clock size={24} />
                    Order Timer Settings
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Label className="text-sm font-medium text-gray-500">
                            Enable Order Timer
                        </Label>
                        <p className="text-xs text-gray-500">
                            Show color-coded timer on orders
                        </p>
                    </div>
                    <Switch
                        checked={settings.orderTimerEnabled}
                        onCheckedChange={(isActive) => onSettingChange("orderTimerEnabled", isActive)}
                    />
                </div>

                {settings.orderTimerEnabled && (
                    <>
                        <div>
                            <Label className="text-sm font-medium text-gray-500">
                                <span className="inline-flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    Green Phase (minutes)
                                </span>
                            </Label>
                            <Input
                                type="number"
                                min="1"
                                max="60"
                                value={settings.greenThresholdMinutes}
                                onChange={(e) => onSettingChange("greenThresholdMinutes", parseInt(e.target.value))}
                                placeholder="Minutes for green status"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Timer shows green from 0 to this time
                            </p>
                        </div>

                        <div>
                            <Label className="text-sm font-medium text-gray-500">
                                <span className="inline-flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    Yellow Phase (minutes)
                                </span>
                            </Label>
                            <Input
                                type="number"
                                min={settings.greenThresholdMinutes + 1}
                                max="120"
                                value={settings.yellowThresholdMinutes}
                                onChange={(e) => onSettingChange("yellowThresholdMinutes", parseInt(e.target.value))}
                                placeholder="Minutes for yellow status"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Timer shows yellow from {settings.greenThresholdMinutes} to this time
                            </p>
                        </div>

                        <div>
                            <Label className="text-sm font-medium text-gray-500">
                                <span className="inline-flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    Red Phase (starts at minutes)
                                </span>
                            </Label>
                            <Input
                                type="number"
                                min={settings.yellowThresholdMinutes + 1}
                                max="180"
                                value={settings.redThresholdMinutes}
                                onChange={(e) => onSettingChange("redThresholdMinutes", parseInt(e.target.value))}
                                placeholder="Minutes when red starts"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Timer shows red after {settings.yellowThresholdMinutes} minutes
                            </p>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <Label className="text-sm font-medium text-gray-500">
                                    Reset Timer on Complete
                                </Label>
                                <p className="text-xs text-gray-500">
                                    Auto reset when order is completed
                                </p>
                            </div>
                            <Switch
                                checked={settings.timerResetOnComplete}
                                onCheckedChange={(isActive) => onSettingChange("timerResetOnComplete", isActive)}
                            />
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export default OrderTimerCard;