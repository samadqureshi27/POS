import React from "react";
import { Save } from "lucide-react";

interface ActionButtonsProps {
  hasChanges: boolean;
  saving: boolean;
  resetting: boolean;
  onSave: () => void;
  onReset: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  hasChanges,
  saving,
  resetting,
  onSave,
  onReset
}) => {
  return (
    <div className="flex justify-center items-center w-full md:justify-end">
      <div className="flex gap-3 w-full lg:w-[60%]">
        <button
          onClick={onReset}
          disabled={resetting}
          className="flex w-[50%] items-center gap-2 px-6 py-2 border border-gray-300 rounded-sm hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {resetting ? (
            <>
              <div className="animate-spin h-4 w-4 border-b-2 border-gray-600 rounded-full"></div>
              Resetting...
            </>
          ) : (
            "Reset to Defaults"
          )}
        </button>
        <button
          onClick={onSave}
          disabled={!hasChanges || saving}
          className={`flex w-[50%] items-center gap-2 px-6 py-2 rounded-sm transition-colors ${
            hasChanges && !saving
              ? "bg-[#2C2C2C] text-white hover:bg-gray-700"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {saving ? (
            <>
              <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full"></div>
              Saving...
            </>
          ) : (
            <>
              <Save size={16} />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ActionButtons;
