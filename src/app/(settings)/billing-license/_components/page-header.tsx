import React from "react";
import { RefreshCw } from "lucide-react";

interface PageHeaderProps {
    handleRecheck: () => void;
    rechecking: boolean;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ handleRecheck, rechecking }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 items-center mb-8">
            <h1 className="text-3xl font-semibold text-gray-900 mb-5">
                Billing & License
            </h1>
            <div className="flex justify-center items-center w-full md:justify-end">
                <div className="flex gap-3 w-full md:w-[40%] lg:w-[30%]">
                    <button
                        onClick={handleRecheck}
                        disabled={rechecking}
                        className="flex w-[100%] items-center justify-center gap-2 px-6 py-2 bg-[#2C2C2C] text-white rounded-sm hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {rechecking ? (
                            <>
                                <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full"></div>
                                Rechecking...
                            </>
                        ) : (
                            <>
                                <RefreshCw size={16} />
                                Recheck License
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};