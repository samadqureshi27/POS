"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ChipOption = {
  id: string;
  label: string;
  subLabel?: string;
};

interface ChipMultiSelectProps {
  value: string[];
  options: ChipOption[];
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
  onChange: (next: string[]) => void;
  className?: string;
}

export function ChipMultiSelect({
  value,
  options,
  placeholder = "Nothing selected",
  loading = false,
  disabled = false,
  onChange,
  className,
}: ChipMultiSelectProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [openAbove, setOpenAbove] = useState(false);

  const selectedOptions = useMemo(
    () => value.map((id) => options.find((o) => o.id === id)).filter(Boolean) as ChipOption[],
    [value, options]
  );

  const remainingOptions = useMemo(
    () => options.filter((o) => !value.includes(o.id)),
    [options, value]
  );

  useEffect(() => {
    if (!open) return;
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    setOpenAbove(spaceBelow < 260 && spaceAbove > spaceBelow);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      // Check if click is outside both trigger and dropdown container
      if (containerRef.current && !containerRef.current.contains(target)) {
        setOpen(false);
      }
    };
    
    // Use a small delay to avoid closing immediately when opening
    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handler);
    }, 0);
    
    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handler);
    };
  }, [open]);

  const toggleOption = (id: string) => {
    if (disabled) return;
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
    }
    setOpen(false);
  };

  const clearAll = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (disabled) return;
    onChange([]);
  };

  const openMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled || loading || remainingOptions.length === 0) return;
    setOpen(true);
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div
        ref={triggerRef}
        className={cn(
          "min-h-14 w-full rounded-sm border border-[#d5d5dd] bg-white px-5 py-4 text-sm",
          "flex flex-wrap items-center gap-3 transition-colors shadow-none",
          disabled && "opacity-60 cursor-not-allowed"
        )}
      >
        {loading ? (
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading...</span>
          </div>
        ) : selectedOptions.length > 0 ? (
          <>
            {selectedOptions.map((opt) => (
              <span
                key={opt.id}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white text-[#1f2937] rounded-sm text-sm font-medium border border-black"
              >
                {opt.label}
                <button
                  type="button"
                  className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-sm bg-white text-[#1f1f1f] transition-colors duration-150 hover:bg-[#f43f5e] hover:text-white cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleOption(opt.id);
                  }}
                >
                  <X className="h-3 w-3 stroke-[1.5]" />
                </button>
              </span>
            ))}
            {remainingOptions.length > 0 && (
              <button
                type="button"
                className="w-8 h-8 rounded-sm bg-[#f0f1f4] hover:bg-black hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                onClick={openMenu}
              >
                <Plus className="h-4 w-4 stroke-[1.25]" />
              </button>
            )}
            <button
              type="button"
              className="w-8 h-8 rounded-sm bg-[#f0f1f4] hover:bg-[#f43f5e] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              onClick={clearAll}
            >
              <X className="h-4 w-4 stroke-[1.25]" />
            </button>
          </>
        ) : (
          <>
            <span className="text-gray-400">{placeholder}</span>
            {remainingOptions.length > 0 && (
              <button
                type="button"
                className="w-8 h-8 rounded-sm bg-[#f0f1f4] hover:bg-black hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                onClick={openMenu}
              >
                <Plus className="h-4 w-4 stroke-[1.25]" />
              </button>
            )}
          </>
        )}
      </div>

      {open && (
        <div
          className={cn(
            "absolute z-50 w-full",
            openAbove ? "bottom-full mb-3" : "top-full mt-3"
          )}
        >
          <div className="relative">
            <div
              className={cn(
                "absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 z-10",
                openAbove 
                  ? "-bottom-1.5 border-r border-b border-[#dcdfe3]" 
                  : "-top-1.5 border-l border-t border-[#dcdfe3]"
              )}
            />
            <div className="bg-white border border-[#dcdfe3] rounded-sm shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] p-3 space-y-3 max-h-80 overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {remainingOptions.length === 0 ? (
                <div className="px-3 py-2 text-sm text-gray-500">No options available</div>
              ) : (
                remainingOptions.map((opt) => (
                  <div
                    key={opt.id}
                    className="flex items-center justify-between rounded-sm border border-black px-3 py-1.5 text-sm text-[#111827] hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleOption(opt.id);
                    }}
                  >
                    <div className="flex flex-col">
                      <span>{opt.label}</span>
                      {opt.subLabel && (
                        <span className="text-xs text-gray-500">{opt.subLabel}</span>
                      )}
                    </div>
                    <button
                      type="button"
                      className="ml-3 inline-flex items-center justify-center w-6 h-6 rounded-sm bg-white text-[#111827] transition-colors duration-150 hover:bg-[#22c55e] hover:text-white cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleOption(opt.id);
                      }}
                    >
                      <Plus className="h-3 w-3 stroke-[1]" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

