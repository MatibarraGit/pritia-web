"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle, AlertTriangle, Plus, Copy, Eye, ArrowLeft } from "lucide-react";
import { MyLoader } from "@/components";
import { Button } from "@/components/ui";
import { ACTION_TYPES } from "@/utils";

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



