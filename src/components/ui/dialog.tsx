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
      "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      "transition-all duration-300",
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
      "2xl": "max-w-2xl",
      "3xl": "max-w-3xl",
      "4xl": "max-w-4xl",
      full: "max-w-[95vw]",
    };

    const heightClass = fullHeight ? "h-[90vh]" : "max-h-[85vh]";

    return (
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          ref={ref}
          className={cn(
            // Positioning - PERFECT CENTER
            "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
            "z-50",

            // Size
            "w-[calc(100%-2rem)]",
            sizeClasses[size],
            heightClass,

            // Appearance - PREMIUM DESIGN
            "bg-white rounded-2xl shadow-2xl border border-gray-200/80",
            "overflow-hidden",

            // Layout
            "flex flex-col",

            // Animations - CLAUDE-STYLE SMOOTH
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            // Fade in/out
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            // Slide from center (slightly down) to center on open
            "data-[state=open]:slide-in-from-top-4",
            // Slide to center (slightly down) on close
            "data-[state=closed]:slide-out-to-top-4",
            // Subtle scale
            "data-[state=open]:zoom-in-[0.98] data-[state=closed]:zoom-out-[0.98]",
            // Smooth timing
            "duration-200 ease-in-out",

            className
          )}
          {...props}
        >
          {children}
          {showCloseButton && (
            <DialogPrimitive.Close
              className={cn(
                "absolute right-5 top-5 z-50",
                "rounded-full p-2",
                "bg-gray-100/80 hover:bg-gray-200",
                "text-gray-600 hover:text-gray-900",
                "transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2",
                "disabled:pointer-events-none",
                "group"
              )}
            >
              <X className="h-4 w-4 transition-transform group-hover:rotate-90 duration-200" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          )}
        </DialogPrimitive.Content>
      </DialogPortal>
    );
  }
);
DialogContent.displayName = DialogPrimitive.Content.displayName;

interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  subtitle?: string;
}

const DialogHeader = ({
  className,
  children,
  icon,
  subtitle,
  ...props
}: DialogHeaderProps) => (
  <div
    className={cn(
      "px-6 py-5 border-b border-gray-200/80 bg-gradient-to-b from-gray-50/50 to-white",
      "flex-shrink-0",
      "flex flex-col items-center text-center",
      className
    )}
    {...props}
  >
    {icon || subtitle ? (
      <div className="flex flex-col items-center gap-2 w-full">
        {icon && (
          <div className="flex-shrink-0 text-gray-700">{icon}</div>
        )}
        <div className="w-full">
          {children}
          {subtitle && (
            <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    ) : (
      children
    )}
  </div>
);
DialogHeader.displayName = "DialogHeader";

const DialogBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex-1 overflow-y-auto px-6 py-5",
      "min-h-0",
      // Custom scrollbar styling
      "scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent",
      "hover:scrollbar-thumb-gray-400",
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
      "px-6 py-4 border-t border-gray-200/80",
      "bg-gradient-to-t from-gray-50/50 to-white",
      "flex items-center justify-between gap-3",
      "flex-shrink-0",
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
      "text-xl font-bold text-gray-900 leading-tight",
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
