import React from "react";

import {TabNavigationProps} from "@/lib/types/menum";

const TabNavigation: React.FC<TabNavigationProps> = ({ 
  activeTab, 
  setActiveTab, 
  formData 
}) => {
  const tabs = ["Menu Items", "Details", "Options", "Meal", "Specials", "Price"];

  return (
    <div className="flex w-full items-center justify-center border-b border-gray-200 mt-2 overflow-x-auto pl-1">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          disabled={tab === "Price" && formData.Displaycat !== "Var"}
          className={`flex-1 min-w-[60px] px-2 py-3 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
            tab === "Price" && formData.Displaycat !== "Var"
              ? "text-gray-300 cursor-not-allowed"
              : activeTab === tab
              ? "border-b-2 border-black text-black"
              : "text-gray-500 hover:text-black hover:bg-gray-50"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;