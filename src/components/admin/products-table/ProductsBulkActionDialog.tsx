"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProductModal } from "@/components";
import { ACTION_TYPES } from "@/utils";

interface ProductsBulkActionDialogProps {
  open: boolean;
  actionType: string;
  title: string;
  openModal: () => void;
  closeModal: () => void;
  onBulkDeleteProducts: (productIds: number[]) => Promise<void>;
  setIsBulkProcessingProducts: (state: boolean) => void;
}

export function ProductsBulkActionDialog({
  open,
  actionType,
  title,
  openModal,
  closeModal,
  onBulkDeleteProducts,
  setIsBulkProcessingProducts
}: ProductsBulkActionDialogProps) {
  const [error, setError] = useState("")

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && closeModal()}>
      <DialogContent
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            event.stopPropagation();
          }
        }}
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <ProductModal
          key={`${actionType}-${open ? "open" : "closed"}`}
          error={error}
          setError={setError}
          type={actionType}
          isBulkDelete={actionType === ACTION_TYPES.DELETE}
          onBulkDeleteProducts={onBulkDeleteProducts}
          setIsBulkProcessingProducts={setIsBulkProcessingProducts}
          openModal={openModal}
          closeModal={closeModal}
        />
      </DialogContent>
    </Dialog>
  );
}
