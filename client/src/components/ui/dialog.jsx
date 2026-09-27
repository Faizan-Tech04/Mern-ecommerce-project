import * as React from "react";

import * as DialogPrimitive from "@radix-ui/react-dialog";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";


// ==========================================
// Dialog Root
// ==========================================

function Dialog({
  ...props
}) {
  return (
    <DialogPrimitive.Root
      data-slot="dialog"
      {...props}
    />
  );
}


// ==========================================
// Dialog Trigger
// ==========================================

function DialogTrigger({
  ...props
}) {
  return (
    <DialogPrimitive.Trigger
      data-slot="dialog-trigger"
      {...props}
    />
  );
}


// ==========================================
// Dialog Portal
// ==========================================

function DialogPortal({
  ...props
}) {
  return (
    <DialogPrimitive.Portal
      data-slot="dialog-portal"
      {...props}
    />
  );
}


// ==========================================
// Dialog Close
// ==========================================

function DialogClose({
  ...props
}) {
  return (
    <DialogPrimitive.Close
      data-slot="dialog-close"
      {...props}
    />
  );
}


// ==========================================
// Dialog Overlay
// ==========================================

function DialogOverlay({
  className,
  ...props
}) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px]",
        "data-[state=open]:animate-in",
        "data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0",
        "data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  );
}


// ==========================================
// Dialog Content
// ==========================================

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}) {
  return (
    <DialogPortal>

      {/* Overlay */}

      <DialogOverlay />


      {/* Content */}

      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "fixed left-1/2 top-1/2 z-50",
          "grid w-[calc(100%-2rem)]",
          "max-h-[85vh] max-w-lg",
          "-translate-x-1/2 -translate-y-1/2",
          "overflow-y-auto",
          "gap-4 rounded-xl border",
          "bg-background p-5 shadow-xl",
          "outline-none",
          "duration-200",
          "data-[state=open]:animate-in",
          "data-[state=closed]:animate-out",
          "data-[state=open]:fade-in-0",
          "data-[state=closed]:fade-out-0",
          "data-[state=open]:zoom-in-95",
          "data-[state=closed]:zoom-out-95",
          "sm:p-6",
          className
        )}
        {...props}
      >

        {children}


        {/* Close Button */}

        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            asChild
          >

            <Button
              variant="ghost"
              size="icon-sm"
              className="absolute right-3 top-3 rounded-sm opacity-70 hover:opacity-100"
            >

              <XIcon />

              <span className="sr-only">
                Close
              </span>

            </Button>

          </DialogPrimitive.Close>
        )}

      </DialogPrimitive.Content>

    </DialogPortal>
  );
}


// ==========================================
// Dialog Header
// ==========================================

function DialogHeader({
  className,
  ...props
}) {
  return (
    <div
      data-slot="dialog-header"
      className={cn(
        "flex flex-col gap-2 text-center sm:text-left",
        className
      )}
      {...props}
    />
  );
}


// ==========================================
// Dialog Footer
// ==========================================

function DialogFooter({
  className,
  ...props
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2",
        "sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  );
}


// ==========================================
// Dialog Title
// ==========================================

function DialogTitle({
  className,
  ...props
}) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "text-lg font-semibold leading-none",
        className
      )}
      {...props}
    />
  );
}


// ==========================================
// Dialog Description
// ==========================================

function DialogDescription({
  className,
  ...props
}) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-sm text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}


// ==========================================
// Exports
// ==========================================

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};