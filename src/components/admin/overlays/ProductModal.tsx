/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle, AlertTriangle, Plus, Copy, Eye, ArrowLeft, Send, X } from "lucide-react";

import { selectItemsContext, toastContext } from "@/contexts";
import { MyLoader } from "@/components";
import { Button } from "@/components/ui";
import { shareProducts } from "@/services/products";
import { ACTION_TYPES, TO_OPTIONS } from "@/utils";

interface ProductModalProps {
  type: string;
  error?: string;
  message?: string;
  slug?: string;
  close: () => void;
  handleConfirmProductAction?: () => Promise<void>;
}

export const ProductModal = ({ 
  type, 
  error = "", 
  message = "", 
  slug = "", 
  close = () => {},
  handleConfirmProductAction = async () => {},
}: ProductModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

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
          <Button onClick={() => close()}>
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
            <h2 className="text-xl font-semibold">¡Producto Publicado!</h2>
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
            onClick={() => close()}
          >
            <Copy size={20} />
            Mantener datos del producto
          </Button>

          <div className="border-t my-2"></div>

          <Link href={`/product/${slug}`} className="block">
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
    const { selectedItems, deleteItemToSelection } = selectItemsContext();
    const { showToast } = toastContext()

    const onConfirmShare = async (number: number, type: string) => {
      try {
        setIsLoading(true);
        for (const item of selectedItems) {
          item.price = type === 'seller' ? item.sellPrice : item.resellersPrice
          if (item.price === 0 || item.price === undefined) {
            showToast("Todos los productos deben tener precio", "error");
            close()
            setIsLoading(false);
            return;
          }
        }
  
        const { successMessage, errorMessage } = await shareProducts(selectedItems, number);
        if (errorMessage && errorMessage !== "") showToast(errorMessage, "error");
        else if (successMessage && successMessage !== "") showToast(successMessage, "success");
      } finally {
        setIsLoading(false);
        close(); 
      }
    };

    return (

      <div>
          {/* Product Grid */}
            <div className="max-h-120 mt-2 grid grid-cols-[repeat(auto-fit,75px)] gap-3 overflow-y-auto">
              {isLoading && <MyLoader />}

              {selectedItems.map((product) => (
                <div
                  key={product.id}
                  className="group max-w-[75px] cursor-pointer"
                >
                  <div className="relative overflow-hidden rounded-lg border border-border/50 transition-all duration-200 group-hover:border-primary/30 group-hover:shadow-md">
                    <Button 
                      className="w-4 h-4 absolute top-0 right-0 z-10 p-3 rounded-full bg-danger/50 transition-all duration-200 hover:bg-danger/70"
                      onClick={() => deleteItemToSelection(product)}
                    >
                      <X />
                    </Button>
                    
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-[75px] w-[75px] object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-tight">
                    {product.name}
                  </p>
                </div>
              ))}
            </div>
    
            {/* Buttons */}
            <div className="mt-8 flex flex-col gap-4">
              <h3
                className="w-full"
              >Compartir a</h3>

              <div className="flex items-center gap-4 flex-wrap">
                {TO_OPTIONS.map((to) => (
                  <Button
                    key={to.number}
                    variant={to.type === 'seller' ? "primary" : "outline"}
                    size="lg"
                    onClick={() => onConfirmShare(to.number, to.type)}
                    className="md:w-auto"
                  >
                    <Send className="h-4 w-4" />
                    {to.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
    );
  }
  
  if (type === ACTION_TYPES.DISABLE) {
    const handleDisable = async () => {
      setIsLoading(true);
      await handleConfirmProductAction();
      setIsLoading(false);
    };
    
    return (
      <div className={`space-y-4 relative ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
        {isLoading && <MyLoader />}
        
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-100 rounded-full">
            <AlertTriangle size={32} className="text-yellow-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Desactivar Producto</h2>
            <p className="text-gray-600">
              El producto dejará de estar disponible para la venta, pero se mantendrá en el sistema y podrás reactivarlo más tarde.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => close()}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={() => handleDisable()}>
            Desactivar
          </Button>
        </div>
      </div>
    );
  }

  if (type === ACTION_TYPES.DELETE) {
    const handleDelete = async () => {
      setIsLoading(true);
      await handleConfirmProductAction();
      setIsLoading(false);
    };
    
    return (
      <div className={`space-y-4 relative ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
        {isLoading && <MyLoader />}
        
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-full">
            <AlertTriangle size={32} className="text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Confirmar Eliminación Permanente</h2>
            <p className="text-gray-600">
              Esta acción eliminará el producto por completo del sistema.
            </p>
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm font-medium text-red-800">
                ⚠️ Advertencia importante:
              </p>
              <p className="text-sm text-red-700 mt-1">
                Al eliminar este producto, se borrarán todos los registros relacionados en:
              </p>
              <ul className="text-sm text-red-700 mt-2 list-disc list-inside space-y-1">
                <li>Órdenes de compra</li>
                <li>Historial de ventas</li>
                <li>Otras secciones donde se utilice este producto</li>
              </ul>
              <p className="text-sm font-medium text-red-800 mt-2">
                Esta acción no se puede deshacer.
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => close()}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={() => handleDelete()}>
            Eliminar Permanentemente
          </Button>
        </div>
      </div>
    );
  }
  
  return null;
};



