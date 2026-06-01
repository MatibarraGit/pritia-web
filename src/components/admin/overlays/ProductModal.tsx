/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle, AlertTriangle, Plus, Copy, Eye, ArrowLeft, Send, X, Trash2 } from "lucide-react";

import { selectItemsContext, toastContext } from "@/contexts";
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import { shareProducts } from "@/services/products";
import { cn } from "@/libs/utils";
import { ACTION_TYPES, TO_OPTIONS } from "@/utils";
import type { SelectedItemsType } from "@/types";

interface ProductModalProps {
  type: string;
  error?: string;
  message?: string;
  slug?: string;
  isBulkDelete?: boolean;
  setError?: (error: string) => void;
  openModal?: () => void;
  closeModal: () => void;
  onBulkDeleteProducts?: (productIds: number[]) => Promise<void>;
  setIsBulkProcessingProducts?: (state: boolean) => void;
}

interface SelectedProductsGridProps {
  products: SelectedItemsType[];
  onRemove?: (product: SelectedItemsType) => void;
}

export const ProductModal = ({
  type,
  error = "",
  message = "",
  slug = "",
  isBulkDelete = false,
  setError = () => {},
  openModal = () => {},
  closeModal = () => {},
  onBulkDeleteProducts = async () => {},
  setIsBulkProcessingProducts = () => {}
}: ProductModalProps) => {
  /** Tipo de destinatario en el formulario manual (Select controlado). */
  const [shareRecipientType, setShareRecipientType] = useState("seller");
  const { selectedItems, deleteItemToSelection } = selectItemsContext();
  const showToast = toastContext((state) => state.showToast);

  // Clear the error when the "Entendido" button is clicked in the error modal
  function closeErrorModal() {
    setTimeout(() => {
      setError("")
    }, 300)
    closeModal()
  }

  if (error !== "") {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-full">
            <AlertTriangle size={32} className="text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Error</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={closeErrorModal}>
            Entendido
          </Button>
        </div>
      </div>
    );
  }

  if (type === ACTION_TYPES.CREATE || type === ACTION_TYPES.UPDATE) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-full">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">¡Producto publicado!</h2>
            <p className="text-gray-600">
              {message || "Has modificado el producto exitosamente. ¿Qué te gustaría hacer ahora?"}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Button
            className="w-full items-center gap-2"
            href="/admin/products/new"
          >
            <Plus size={20} />
            Publicar nuevo producto
          </Button>

          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => closeModal()}
          >
            <Copy size={20} />
            Mantener datos del producto
          </Button>

          <div className="border-t my-2"></div>

          <Link href={`/producto/${slug}`} className="block">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Eye size={20} />
              Ver página del producto
            </Button>
          </Link>

          <Link href="/admin/products" className="block">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <ArrowLeft size={20} />
              Volver a la página de productos
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (type === ACTION_TYPES.SHARE) {
    const onConfirmShare = async (number: number, type: string) => {
      try {
        setIsBulkProcessingProducts(true)
        closeModal()
        for (const item of selectedItems) {
          item.price = type === "seller" ? item.sellPrice : item.resellersPrice;
          if (item.price === 0 || item.price === undefined) {
            showToast("Todos los productos deben tener precio", "error");
            closeModal();
            setIsBulkProcessingProducts(false)
            return;
          }
        }

        const { successMessage, errorMessage } = await shareProducts(selectedItems, number);
        if (errorMessage && errorMessage !== "") showToast(errorMessage, "error");
        else if (successMessage && successMessage !== "") showToast(successMessage, "success");
      } finally {
        closeModal();
        setIsBulkProcessingProducts(false)
      }
    };

    // Función del formulario para compartir manualmente
    const handleShareManually = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const numberRaw = String(formData.get("number") ?? "").trim();
      const recipientType = String(formData.get("type") ?? "").trim();

      if (!recipientType) {
        showToast("Selecciona un tipo de destinatario", "error");
        return;
      }

      const toNumber = Number(549 + numberRaw.replace(/\D/g, ""));
      if (!Number.isFinite(toNumber) || toNumber <= 0) {
        showToast("Introduce un número de teléfono válido", "error");
        return;
      }

      void onConfirmShare(toNumber, recipientType);
    };

    return (
      <div>
        <SelectedProductsGrid
          products={selectedItems}
          onRemove={deleteItemToSelection}
        />

        <div className="mt-8 flex flex-col gap-4">
          <h3 className="w-full text-base font-semibold leading-none">
            Compartir a
          </h3>

          <Tabs defaultValue="presets" className="w-full gap-4">
            <TabsList className="grid h-auto w-full grid-cols-2 p-1 sm:inline-flex sm:w-fit sm:grid-cols-none bg-gray-200">
              <TabsTrigger value="presets" className="gap-1.5">
                Predeterminados
              </TabsTrigger>
              <TabsTrigger value="manual" className="gap-1.5">
                Manual
              </TabsTrigger>
            </TabsList>

            <TabsContent value="presets" className="mt-0 flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-4">
                {TO_OPTIONS.map((to) => (
                  <Button
                    key={to.number}
                    variant={to.type === "seller" ? "primary" : "outline"}
                    size="lg"
                    type="button"
                    onClick={() => void onConfirmShare(to.number, to.type)}
                    className="md:w-auto"
                  >
                    <Send className="h-4 w-4" />
                    {to.name}
                  </Button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="manual" className="mt-0 flex flex-col gap-4">
              <form
                className="flex flex-col gap-4"
                onSubmit={handleShareManually}
              >
                <div className="flex gap-4">
                  <input type="hidden" name="type" value={shareRecipientType} />

                  <Select
                    value={shareRecipientType}
                    onValueChange={setShareRecipientType}
                  >
                    <SelectTrigger
                      id="share-recipient-type"
                      className="w-full"
                    >
                      <SelectValue placeholder="Tipo de destinatario" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="seller">Cliente</SelectItem>
                      <SelectItem value="reseller">Revendedor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-4">
                  <label className="w-fit text-nowrap" htmlFor="share-manual-phone">
                    +54 9
                  </label>
                  <Input
                    id="share-manual-phone"
                    placeholder="Número de teléfono"
                    type="tel"
                    name="number"
                    required
                  />
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  type="submit"
                  className="md:w-auto"
                >
                  <Send className="h-4 w-4" />
                  Compartir
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  if (type === ACTION_TYPES.DELETE && isBulkDelete) {
    const handleDeleteSelectedProducts = async () => {
      if (selectedItems.length === 0) {
        showToast("No hay productos seleccionados", "error");
        return;
      }

      closeModal();
      setError("");

      try {
        await onBulkDeleteProducts(selectedItems.map((product) => product.id));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error desconocido al eliminar los productos");
        openModal();
      }
    };

    return (
      <div className={`space-y-4 relative`}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-full">
            <AlertTriangle size={32} className="text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Confirmar eliminación permanente</h2>
            <p className="text-gray-600">
              Esta acción eliminará {selectedItems.length} producto{selectedItems.length !== 1 ? "s" : ""} por completo del sistema.
            </p>
          </div>
        </div>

        <SelectedProductsGrid products={selectedItems} />

        <div className="rounded-md border border-red-200 bg-red-50 p-3">
          <p className="text-sm font-medium text-red-800">
            Advertencia importante:
          </p>
          <p className="mt-1 text-sm text-red-700">
            Al eliminar estos productos, se borrarán todos los registros relacionados. Esta acción no se puede deshacer.
          </p>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => closeModal()}>
            Cerrar
          </Button>
          <Button variant="destructive" onClick={() => void handleDeleteSelectedProducts()} disabled={selectedItems.length === 0}>
            <Trash2 className="h-4 w-4" />
            Eliminar seleccionados
          </Button>
        </div>
      </div>
    );
  }

  return null;
};

function SelectedProductsGrid({
  products,
  onRemove,
}: SelectedProductsGridProps) {
  return (
    <div className="relative max-h-120 mt-2 grid grid-cols-[repeat(auto-fit,75px)] gap-3 overflow-y-auto">
      {products.map((product) => (
        <div
          key={product.id}
          className="group max-w-[75px] cursor-pointer"
        >
          <div className="min-h-[100px] relative overflow-hidden rounded-lg border border-border/50 transition-all duration-200 group-hover:border-primary/30 group-hover:shadow-md">
            {onRemove && (
              <Button
                className="w-4 h-4 absolute top-0 right-0 z-10 p-3 rounded-full bg-danger/50 transition-all duration-200 hover:bg-danger/70"
                onClick={() => onRemove(product)}
              >
                <X />
              </Button>
            )}

            <div className="grid grid-cols-2 gap-1.5">
              {product.images.map((image) => (
                <img
                  key={image}
                  src={image}
                  alt={product.name}
                  className={cn("object-cover transition-transform duration-200 group-hover:scale-105", product.images.length === 1 ? "col-span-2" : "col-span-1")}
                />
              ))}
            </div>
          </div>

          <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-tight">
            {product.name}
          </p>
        </div>
      ))}
    </div>
  );
}
