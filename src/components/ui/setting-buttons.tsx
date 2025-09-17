"use client";
import React from "react";
import { Save, RotateCcw } from "lucide-react";
import { Button } from "./button";
import LoadingSpinner from "./loading-spinner";

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
        <Button
          onClick={onReset}
          disabled={resetting}
          variant="outline"
          className="flex w-[50%] items-center gap-2"
        >
          {resetting ? (
            <>
              <LoadingSpinner size="sm" color="gray" />
              Resetting...
            </>
          ) : (
            <>
              <RotateCcw size={16} />
              Reset to Defaults
            </>
          )}
        </Button>
        <Button
          onClick={onSave}
          disabled={!hasChanges || saving}
          variant={hasChanges && !saving ? "default" : "secondary"}
          className="flex w-[50%] items-center gap-2"
        >
          {saving ? (
            <>
              <LoadingSpinner size="sm" color="white" />
              Saving...
            </>
          ) : (
            <>
              <Save size={16} />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ActionButtons;
