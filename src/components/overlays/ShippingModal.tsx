"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ShippingInfo } from "@/components/data-display/ShippingInfo";

interface ShippingModalProps {
  trigger?: React.ReactNode;
}

export const ShippingModal = ({ trigger }: ShippingModalProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <button
            type="button"
            className="text-sm font-medium hover:text-gray-200 cursor-pointer"
          >
            Envíos
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="w-11/12 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Información de Envíos</DialogTitle>
        </DialogHeader>
        <ShippingInfo />
      </DialogContent>
    </Dialog>
  );
};

