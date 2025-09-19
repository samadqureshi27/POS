import React from "react";
import { CreditCard, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UpdateLicenseCardProps {
    licenseKeyInput: string;
    setLicenseKeyInput: (value: string) => void;
    handleUpdateLicense: (e: React.FormEvent) => void;
    updating: boolean;
}

export const UpdateLicenseCard: React.FC<UpdateLicenseCardProps> = ({
    licenseKeyInput,
    setLicenseKeyInput,
    handleUpdateLicense,
    updating
}) => {
    return (
        <div className="bg-white rounded-sm p-8 shadow-sm border border-gray-200 min-h-[500px]">
            <div className="flex items-center gap-2 mb-8">
                <CreditCard className="text-black" size={24} />
                <h2 className="text-xl font-semibold">Update License</h2>
            </div>

            <p className="text-sm text-gray-600 mb-8">
                To update and activate the license, enter the license key here.
            </p>

            <form onSubmit={handleUpdateLicense} className="space-y-6">
                <div>
                    <Label className="text-sm font-medium text-gray-700 mb-3">
                        License Key
                    </Label>
                    <Input
                        type="text"
                        value={licenseKeyInput}
                        onChange={(e) => setLicenseKeyInput(e.target.value)}
                        placeholder="Enter your license key (e.g., LIC-XXXX-XXXX-XXXX)"
                        className="px-4 py-3 rounded-sm"
                        disabled={updating}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                        Enter your new license key to update your plan
                    </p>
                </div>

                <Button
                    type="submit"
                    disabled={updating || !licenseKeyInput.trim()}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#2C2C2C] text-white rounded-sm hover:bg-gray-700 transition-colors"
                >
                    {updating ? (
                        <>
                            <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full"></div>
                            Updating...
                        </>
                    ) : (
                        <>
                            <Save size={16} />
                            Update License
                        </>
                    )}
                </Button>
            </form>
        </div>
    );
};