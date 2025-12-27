"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-[1000] bg-black/60",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      "transition-all duration-200",
      "overflow-y-scroll overflow-x-hidden",
      "min-h-screen",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  showCloseButton?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full";
  fullHeight?: boolean;
}

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(
  (
    {
      className,
      children,
      showCloseButton = true,
      size = "lg",
      fullHeight = false,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
      "2xl": "max-w-[680px]",
      "3xl": "max-w-[720px]",
      "4xl": "max-w-[800px]",
      full: "max-w-[95vw]",
    };

    return (
      <DialogPortal>
        <DialogOverlay className="flex items-start justify-center pt-[4vh] pb-[4vh]">
          <DialogPrimitive.Content
            ref={ref}
            style={{
              transformOrigin: '50% 50%',
            }}
            className={cn(
              // Positioning
              "relative",
              "z-[1001]",

              // Size
      "w-[calc(100%-1.5rem)] max-w-full",
              sizeClasses[size],
              "h-auto",

              // Appearance
      "bg-white rounded-sm shadow-[0_14px_44px_rgba(15,23,42,0.16)] border border-[#E7E7E9]",

              // Layout
              "flex flex-col overflow-x-hidden",

              // Animations
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
              "data-[state=open]:zoom-in-[0.8]",
              "data-[state=closed]:zoom-out-[1.2]",
              "duration-300 ease-out",

              className
            )}
            {...props}
          >
            {children}
            {showCloseButton && (
              <DialogPrimitive.Close
                className={cn(
                  "absolute right-6 top-6 z-50",
                  "rounded-sm p-0",
                  "text-gray-400 hover:text-gray-600",
                  "transition-colors duration-150",
                  "focus:outline-none",
                  "cursor-pointer",
                  "disabled:pointer-events-none disabled:cursor-not-allowed"
                )}
              >
                <X className="h-8 w-8" strokeWidth={1} />
                <span className="sr-only">Close</span>
              </DialogPrimitive.Close>
            )}
          </DialogPrimitive.Content>
        </DialogOverlay>
      </DialogPortal>
    );
  }
);
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "px-8 py-6 flex-shrink-0 min-w-0 max-w-full",
      className
    )}
    {...props}
  >
    {children}
  </div>
);
DialogHeader.displayName = "DialogHeader";

const DialogBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    data-slot="dialog-body"
    className={cn(
      "px-8 py-6 overflow-x-hidden overflow-y-auto pt-0 pb-0",
      "min-w-0 max-w-full",
      className
    )}
    {...props}
  />
);
DialogBody.displayName = "DialogBody";

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "px-8 py-8",
      "flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-3",
      "flex-shrink-0 w-full min-w-0 max-w-full",
      "[&>*]:w-full sm:[&>*]:w-auto",
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-[20px] font-semibold text-[#111827]",
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-gray-600 leading-relaxed", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
