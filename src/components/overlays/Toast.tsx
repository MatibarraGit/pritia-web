"use client";

import { toastContext } from "@/contexts";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { DialogPortal } from "@/components/ui/dialog";
import { cn } from "@/libs/utils";
import { XIcon } from "lucide-react";

export const Toast = () => {
  const { toastOpened, closeToast, toastMessage, toastType, isCartOpen } = toastContext();

  const bgColor = toastType === 'success' ? 'bg-success' : 'bg-danger';
  const rightPosition = isCartOpen ? 'right-100' : 'right-8';

  return (
    <DialogPrimitive.Root open={toastOpened} onOpenChange={closeToast} modal={false}>
      <DialogPortal>
        <DialogPrimitive.Content
          className={cn(
            "w-80 flex items-center p-4 fixed top-auto translate-x-0 translate-y-0 bottom-8 text-white border-none shadow-lg rounded-md z-50",
            bgColor,
            rightPosition,
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-bottom-2 data-[state=open]:slide-in-from-bottom-2"
          )}
        >
          <DialogPrimitive.Title className="sr-only">Toast</DialogPrimitive.Title>
          <div className="text-sm font-medium pr-6">
            {toastMessage}
          </div>
          <DialogPrimitive.Close className="absolute top-2 right-2 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:outline-hidden disabled:pointer-events-none">
            <XIcon className="size-4" />
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPortal>
    </DialogPrimitive.Root>
  );
};