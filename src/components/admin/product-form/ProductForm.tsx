"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { X, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  RadioGroup,
  RadioGroupItem,
  Button,
  Input,
} from "@/components/ui";
import { ProductModal, DragImage } from "@/components";
import { productDataContext } from "@/contexts";
import { useAsyncData } from "@/hooks";
import { ACTION_TYPES, EMPTY_PRODUCT_TABLE_OPTIONS, fetchProductTableOptions, formatPrice } from "@/utils";
import { handleSubmit } from "./handleSubmit";

interface ProductImage {
  img_url?: string;
  img_alt?: string;
  file?: File;
}

export function ProductForm() {
  const { productData, handleChange, handleDeleteImage } = productDataContext();
  const { data: options } = useAsyncData({
    cacheKey: "product-table-options",
    fetchFunction: fetchProductTableOptions,
    initialData: EMPTY_PRODUCT_TABLE_OPTIONS,
  });
  const { providers, categories } = options;

  const [opened, setOpened] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  // Preparar datos de proveedores
  const providerNames = providers?.map((provider) => provider.provider_name) || [];
  const selectedProvider = providers?.filter(
    (provider) => provider.provider_name === productData.provider
  ) || [];

  // Preparar datos de categorías
  const categoryNames = categories?.map((category) => category.category_name) || [];
  const selectedCategory = categories?.filter(
    (category) => category.category_name === productData.category
  ) || [];

  // Preparar subcategorías
  const categoryData = categories?.filter(
    (category) => category.category_name === productData.category
  ) || [];
  const subcategoriesNames = categoryData
    ?.map((category) =>
      category.subcategories?.map((subcategory) => subcategory.name)
    )
    .flat() || [];
  const selectedSubcategory = categoryData
    ?.map((category) =>
      category.subcategories.filter(
        (subcategory) => subcategory.name === productData.subcategory
      )
    )
    .flat() || [];

  // Calcular valores de descuento
  const basePrice = productData.price || 0;
  const discountValue = Math.floor(basePrice * (productData.discountPercent / 100));
  const totalValue = Math.floor(basePrice - discountValue);

  const formSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    startTransition(async () => {
      await handleSubmit(
        event,
        productData,
        handleChange,
        selectedProvider,
        selectedCategory,
        selectedSubcategory,
        setError,
        setMessage,
        () => setOpened(true)
      );
    });
  };

  const closeDialog = () => {
    if (error) {
      setOpened(false);
    }
  };

  return (
    <section className="w-full space-y-6 bg-white rounded-lg p-4">
      <form onSubmit={formSubmit} className="space-y-6">
        <Dialog open={opened} onOpenChange={closeDialog}>
          <DialogContent>
            <DialogTitle className="hidden">
              {error ? "Error" : "Mensaje"}
            </DialogTitle>
            <ProductModal
              type={ACTION_TYPES.CREATE}
              error={error}
              message={message}
              slug={productData.slug}
              closeModal={() => setOpened(false)}
            />
          </DialogContent>
        </Dialog>

        <DragImage handleChange={handleChange} />

        {productData.images && productData.images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {productData.images.map((image, index) => {
              const imageUrl =
                typeof image === "string"
                  ? image
                  : (image as ProductImage).img_url || "";
              return (
                <div key={index} className="relative group">
                  <div className="relative aspect-square rounded-lg border overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={productData.name || "Imagen del producto"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(index)}
                    className="absolute top-0 right-0 bg-destructive text-white rounded-full p-1"
                  >
                    <X className="h-5 w-5 bg-red-400/70 rounded-full p-0.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <div className="space-y-4">
          {/* NOMBRE */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Nombre del Producto
            </label>
            <Input
              type="text"
              id="name"
              name="name"
              value={productData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </div>

          {/* PROVEEDOR */}
          <div className="space-y-2">
            <label htmlFor="provider" className="text-sm font-medium">
              Proveedor
            </label>
            <Select
              key={`provider-${productData.id || 'new'}-${productData.provider || ''}-${providerNames.length}`}
              value={productData.provider || undefined}
              onValueChange={(value) => handleChange("provider", value)}
              disabled={providerNames.length === 0}
            >
              <SelectTrigger id="provider" name="provider" className="w-full">
                <SelectValue placeholder="Seleccionar proveedor" />
              </SelectTrigger>
              <SelectContent>
                {providerNames.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* PRECIO DE COMPRA */}
          <div className="space-y-2">
            <label htmlFor="purchasePrice" className="text-sm font-medium">
              Precio de Compra
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                type="number"
                id="purchasePrice"
                name="purchasePrice"
                value={productData.purchasePrice || 0}
                onChange={(e) => handleChange("purchasePrice", e.target.value)}
                min={1000}
                step={100}
                className="pl-8"
                required
              />
            </div>
          </div>

          {/* PRECIO DE VENTA */}
          <div className="space-y-2">
            <label htmlFor="price" className="text-sm font-medium">
              Precio de Venta
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                type="number"
                id="price"
                name="price"
                value={productData.price || 0}
                onChange={(e) => handleChange("price", e.target.value)}
                min={1000}
                step={100}
                className="pl-8"
                required
              />
            </div>
          </div>

          {/* PRECIO REVENDEDORES */}
          <div className="space-y-2">
            <label htmlFor="resellersPrice" className="text-sm font-medium">
              Precio Revendedores
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                type="number"
                id="resellersPrice"
                name="resellersPrice"
                value={productData.resellersPrice || 0}
                onChange={(e) => handleChange("resellersPrice", e.target.value)}
                min={1000}
                step={100}
                className="pl-8"
                required
              />
            </div>
          </div>

          {/* DESCUENTO */}
          <div className="space-y-2">
            <label htmlFor="discountPercent" className="text-sm font-medium">
              Descuento
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg border">
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">Porcentaje</span>
                <Input
                  type="number"
                  id="discountPercent"
                  name="discountPercent"
                  value={productData.discountPercent || 0}
                  onChange={(e) => handleChange("discountPercent", e.target.value)}
                  min={0}
                  max={100}
                  step={1}
                  required
                />
              </div>
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">Valor</span>
                <div className="text-lg font-semibold">{formatPrice(discountValue)}</div>
              </div>
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">Precio Final</span>
                <div className="text-lg font-semibold">{formatPrice(totalValue)}</div>
              </div>
            </div>
          </div>

          {/* CATEGORÍA */}
          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">
              Categoría
            </label>
            <Select
              key={`category-${productData.id || 'new'}-${productData.category || ''}-${categoryNames.length}`}
              value={productData.category || undefined}
              onValueChange={(value) => {
                handleChange("category", value);
                handleChange("subcategory", "");
              }}
              disabled={categoryNames.length === 0}
            >
              <SelectTrigger id="category" name="category" className="w-full">
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                {categoryNames.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* SUBCATEGORÍA */}
          <div className="space-y-2">
            <label htmlFor="subcategory" className="text-sm font-medium">
              Subcategoría
            </label>
            <Select
              key={`subcategory-${productData.id || 'new'}-${productData.category || ''}-${productData.subcategory || ''}-${subcategoriesNames.length}`}
              value={productData.subcategory || undefined}
              onValueChange={(value) => handleChange("subcategory", value)}
              disabled={subcategoriesNames.length === 0}
            >
              <SelectTrigger id="subcategory" name="subcategory" className="w-full">
                <SelectValue placeholder="Seleccionar subcategoría" />
              </SelectTrigger>
              <SelectContent>
                {subcategoriesNames.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* DISPONIBILIDAD */}
          <div className="space-y-2">
            <label htmlFor="inStock" className="text-sm font-medium">
              Disponibilidad
            </label>
            <RadioGroup
              value={productData.inStock}
              onValueChange={(value) => handleChange("inStock", value)}
              className="flex gap-4"
            >
              <RadioGroupItem value="Disponible" id="disponible">
                Disponible
              </RadioGroupItem>
              <RadioGroupItem value="Agotado" id="agotado">
                Agotado
              </RadioGroupItem>
            </RadioGroup>
          </div>

          {/* STOCK */}
          <div className="space-y-2">
            <label htmlFor="stock" className="text-sm font-medium">
              Stock en Inventario
            </label>
            <Input
              type="number"
              id="stock"
              name="stock"
              value={productData.stock || 0}
              onChange={(e) => handleChange("stock", e.target.value)}
              min={0}
              step={1}
              required
            />
          </div>

          {/* DESCRIPCIÓN */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Descripción
            </label>
            <Textarea
              id="description"
              name="description"
              value={productData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          {/* FECHA DE ACTUALIZACIÓN */}
          <div className="space-y-2">
            <label htmlFor="updatedAt" className="text-sm font-medium">
              Fecha de Actualización
            </label>
            <Input
              type="datetime-local"
              id="updatedAt"
              name="updatedAt"
              value={productData.updatedAt || ""}
              onChange={(e) => handleChange("updatedAt", e.target.value)}
            />
          </div>
        </div>

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Procesando...
            </>
          ) : productData.id ? (
            "Guardar"
          ) : (
            "Publicar"
          )}
        </Button>
      </form>
    </section>
  );
}




