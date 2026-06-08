"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { ImagePlus, Link as LinkIcon, Trash2, Upload, X } from "lucide-react";

import { EditableCell } from "@/components";
import { Button, Checkbox, Input, Label, Popover, PopoverContent, PopoverTrigger } from "@/components/ui";
import { cn } from "@/libs/utils";
import type { ColumnConfig, EditableCellValue, EditableProductImage, OptionsCache, ProductType } from "@/types";
import {
  formatCellValue,
  formatPrice,
  getEditableProductImageSrc,
  getSelectOptions,
  isOwnCloudinaryImageUrl,
  PRODUCT_IMAGE_ACCEPTED_TYPES,
  PRODUCT_IMAGE_MAX_FILE_SIZE,
} from "@/utils";

interface ProductTableCellProps {
  product: ProductType;
  column: ColumnConfig;
  options: OptionsCache;
  isActive: boolean;
  isEditMode: boolean;
  onActivate: () => void;
  onCancel: () => void;
  onChange: (value: EditableCellValue, column?: ColumnConfig) => void;
  onLiveChange?: (value: EditableCellValue) => void;
}

export function ProductTableCell({
  product,
  column,
  options,
  isActive,
  isEditMode,
  onActivate,
  onCancel,
  onChange,
  onLiveChange,
}: ProductTableCellProps) {
  const value = product[column.key];

  const [currencyPopoverOpen, setCurrencyPopoverOpen] = useState(false);
  const [purchaseSurcharge, setPurchaseSurcharge] = useState<0 | 3 | 5>(0);
  const [originalPrice, setOriginalPrice] = useState(product.purchasePrice);

  const priceWithDiscount =
    product.discountPercent !== 0 && product.originalPrice !== undefined
      ? product.originalPrice * (1 - product.discountPercent / 100)
      : undefined;

  if (column.key === "images") {
    return (
      <ProductImagesTableCell
        product={product}
        isActive={isActive}
        onActivate={onActivate}
        onCancel={onCancel}
        onChange={onChange}
      />
    );
  }

  if (column.key === "purchasePrice") {
    const isDisabled = !isEditMode;
    const changePurchasePrice = onLiveChange ?? onChange;
    const baseSurcharge = product.providers?.includes("Women")
      ? 5
      : ["Montecarlo Hogar", "Electroben", "New Red", "MYE Hogar", "Toto Home", "OnElectronic", "Electro Stagliano"].some((provider) =>
          product.providers?.includes(provider)
        )
        ? 3
        : 0;

    const applyPurchaseSurcharge = (percent: 0 | 3 | 5) => {
      const base = originalPrice;

      if (percent === 0) {
        setPurchaseSurcharge(0);
        changePurchasePrice(base);
        return;
      }

      setPurchaseSurcharge(percent);
      changePurchasePrice(Math.ceil((base * (1 + percent / 100)) / 500) * 500);
    };

    function onChangeLocal(nextValue: EditableCellValue) {
      const valueNumber = Number(nextValue);
      onChange(valueNumber);
      setOriginalPrice(valueNumber);
      setPurchaseSurcharge(0);
    }

    function onActivateLocal() {
      onChange(originalPrice);
      onActivate();
    }

    return (
      <Popover open={currencyPopoverOpen} onOpenChange={setCurrencyPopoverOpen}>
        <PopoverTrigger asChild>
          <span
            className="block w-full"
            onMouseEnter={() => !isActive && !isDisabled && setCurrencyPopoverOpen(true)}
            onMouseLeave={() => !isActive && !isDisabled && setCurrencyPopoverOpen(false)}
            onFocus={() => !isActive && !isDisabled && setCurrencyPopoverOpen(true)}
            onBlur={() => !isActive && !isDisabled && setCurrencyPopoverOpen(false)}
          >
            <div className="w-full">
              <EditableCell
                key={`${product.id}-${column.key}-${String(value ?? "")}`}
                active={isActive}
                disabled={isDisabled}
                displayValue={formatCellValue(product, column.key)}
                type={column.type}
                value={product.purchasePrice}
                options={getSelectOptions(product, column.key, options)}
                onActivate={onActivateLocal}
                onCancel={onCancel}
                onChange={onChangeLocal}
              />
            </div>
          </span>
        </PopoverTrigger>
        <PopoverContent
          side="top"
          align="center"
          className="w-auto bg-white px-3 py-2 text-sm"
          onMouseEnter={() => setCurrencyPopoverOpen(true)}
          onMouseLeave={() => setCurrencyPopoverOpen(false)}
        >
          Precio sin recargo{" "}
          {purchaseSurcharge === 0
            ? formatPrice(Math.ceil((originalPrice * (1 - baseSurcharge / 100)) / 500) * 500)
            : formatPrice(originalPrice)}
          {!isActive && !isDisabled && (
            <div
              className="mt-2 flex items-center gap-4 px-1 pb-1 text-xs text-gray-700"
              onMouseDown={(event) => event.preventDefault()}
            >
              <div className="flex items-center gap-2">
                <Checkbox
                  id={`purchase-surcharge-3-${product.id}`}
                  checked={purchaseSurcharge === 3}
                  onCheckedChange={(checked) => applyPurchaseSurcharge(checked === true ? 3 : 0)}
                />
                <Label htmlFor={`purchase-surcharge-3-${product.id}`} className="text-xs font-normal">
                  Agregar 3%
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id={`purchase-surcharge-5-${product.id}`}
                  checked={purchaseSurcharge === 5}
                  onCheckedChange={(checked) => applyPurchaseSurcharge(checked === true ? 5 : 0)}
                />
                <Label htmlFor={`purchase-surcharge-5-${product.id}`} className="text-xs font-normal">
                  Agregar 5%
                </Label>
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>
    );
  }

// Verifica si es la columna de precio de venta
  if (column.key === "price") {
    const isDisabled = !isEditMode;

    function onChangeLocal(nextValue: EditableCellValue) {
      const valueNumber = Number(nextValue);
      onChange(valueNumber, {
        key: "originalPrice",
        label: "P/Venta",
        type: "currency",
        width: "minmax(130px, 0.8fr)",
      });
    }

    const classNames = `mx-auto absolute bottom-4 left-0 right-0 ${!isActive ? "text-sm line-through text-gray-500" : ""}`;

    return (
      <div className="w-full">
        {product.originalPrice !== undefined ? (
          <div className="relative w-full">
            <EditableCell
              key={`${product.id}-${column.key}-${String(value ?? "")}`}
              active={isActive}
              disabled={isDisabled}
              displayValue={formatCellValue(product, "originalPrice")}
              type={column.type}
              value={product.originalPrice}
              options={getSelectOptions(product, column.key, options)}
              onActivate={onActivate}
              onCancel={onCancel}
              onChange={onChangeLocal}
              className={classNames}
            />

            <span>{priceWithDiscount !== undefined ? formatPrice(priceWithDiscount) : null}</span>
          </div>
        ) : (
          <EditableCell
            key={`${product.id}-${column.key}-${String(value ?? "")}`}
            active={isActive}
            disabled={isDisabled}
            displayValue={formatCellValue(product, column.key)}
            type={column.type}
            value={value as EditableCellValue | null | undefined}
            options={getSelectOptions(product, column.key, options)}
            onActivate={onActivate}
            onCancel={onCancel}
            onChange={onChange}
          />
        )}
      </div>
    );
  }

  const className = cn(
    column.key === "discountPercent" && product.discountPercent !== 0
      ? "bg-green-50 text-green-700 px-1.5 py-0.5 rounded border border-green-200"
      : "",
    column.key === "description" && "max-w-80",
    column.key === "description" &&
      (isActive
        ? "w-80 min-h-36 text-left"
        : "overflow-hidden text-ellipsis whitespace-nowrap text-left")
  );
  
  // Si no es la columna de imágenes, muestra el valor de la columna
  return (
    <EditableCell
      key={`${product.id}-${column.key}-${String(value ?? "")}`}
      active={isActive}
      disabled={!isEditMode}
      displayValue={formatCellValue(product, column.key)}
      type={column.type}
      value={column.key === "providers" ? product.providers || [] : (value as EditableCellValue | null | undefined)}
      options={getSelectOptions(product, column.key, options)}
      onActivate={onActivate}
      onCancel={onCancel}
      onChange={onChange}
      className={className}
    />
  );
}

interface ProductImagesTableCellProps {
  product: ProductType;
  isActive: boolean;
  onActivate: () => void;
  onCancel: () => void;
  onChange: (value: EditableCellValue) => void;
}

function ProductImagesTableCell({
  product,
  isActive,
  onActivate,
  onCancel,
  onChange,
}: ProductImagesTableCellProps) {
  const images: EditableProductImage[] = product.images || [];
  const cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const [areImagesExpanded, setAreImagesExpanded] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageError, setImageError] = useState("");
  const imagesPopoverRef = useRef<HTMLDivElement>(null);
  const imagesWrapperRef = useRef<HTMLDivElement>(null);
  const imageFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!areImagesExpanded) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (imagesPopoverRef.current?.contains(event.target as Node)) return;
      if (imagesWrapperRef.current?.contains(event.target as Node)) return;
      setAreImagesExpanded(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [areImagesExpanded]);

  const updateImages = (nextImages: EditableProductImage[]) => {
    if (nextImages.length === 0) {
      setImageError("Debe haber al menos 1 imagen");
      return;
    }

    setImageError("");
    onChange(nextImages);
  };

  const handleDeleteImage = (index: number) => {
    updateImages(images.filter((_, imageIndex) => imageIndex !== index));
  };

  const handleAddCloudinaryUrl = () => {
    const trimmedUrl = imageUrl.trim();

    if (!isOwnCloudinaryImageUrl(trimmedUrl, cloudinaryCloudName)) {
      setImageError("La URL debe ser de Cloudinary de esta cuenta");
      return;
    }

    if (images.some((image) => typeof image === "string" && image === trimmedUrl)) {
      setImageError("Esa imagen ya esta cargada");
      return;
    }

    updateImages([...images, trimmedUrl]);
    setImageUrl("");
  };

  const handleAddFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const validFiles = files.filter(
      (file) => file.size <= PRODUCT_IMAGE_MAX_FILE_SIZE && PRODUCT_IMAGE_ACCEPTED_TYPES.includes(file.type)
    );
    const invalidFileError = validFiles.length !== files.length
      ? "Solo se aceptan imagenes jpg, png o webp de hasta 5mb"
      : "";

    if (invalidFileError) setImageError(invalidFileError);

    if (validFiles.length > 0) {
      const fileImages: EditableProductImage[] = validFiles.map((file) => ({
        kind: "file",
        file,
        previewUrl: URL.createObjectURL(file),
        name: file.name,
      }));

      updateImages([...images, ...fileImages]);
    }

    if (invalidFileError) setImageError(invalidFileError);

    event.target.value = "";
  };

  return (
    <div ref={imagesWrapperRef} className="relative w-full">
      <div className="relative h-16 rounded border border-gray-100 bg-gray-50">
        {images.length > 0 ? (
          <img
            src={getEditableProductImageSrc(images[0])}
            alt={product.name}
            className={`h-full w-full object-contain ${images.length > 1 ? " cursor-pointer" : ""}`}
            onClick={onActivate}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
            Sin img.
          </div>
        )}

        {images.length > 1 && (
          <div className="pointer-events-none absolute bottom-1 right-0 rounded-full bg-gray-900 px-2 py-0.5 text-xs font-semibold leading-none text-white shadow-sm transition hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1">
            {images.length}
          </div>
        )}
      </div>

      {areImagesExpanded && !isActive && (
        <div
          ref={imagesPopoverRef}
          data-images-expanded={areImagesExpanded ? "true" : undefined}
          className="absolute z-40 w-72 rounded-lg border border-gray-200 bg-white p-2 shadow-xl"
          style={{ left: 0, top: 0 }}
        >
          <div className="grid grid-cols-2 gap-2">
            {images.map((image, index) => (
              <div
                key={`${getEditableProductImageSrc(image)}-${index}`}
                className="h-20 rounded border border-gray-100 bg-gray-50"
              >
                <img src={getEditableProductImageSrc(image)} alt={product.name} className="h-full w-full object-contain" />
              </div>
            ))}
          </div>
        </div>
      )}

      {isActive && (
        <div
          data-images-expanded="true"
          className="absolute left-0 top-0 z-50 w-96 rounded-lg border border-gray-200 bg-white p-3 text-left shadow-xl"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase text-gray-500">Imagenes</span>
            <Button type="button" variant="ghost" size="xs" onClick={onCancel} aria-label="Cerrar editor de imagenes">
              <X size={14} />
            </Button>
          </div>

          <div className="grid max-h-56 grid-cols-2 gap-2 overflow-y-auto">
            {images.map((image, index) => (
              <div key={`${getEditableProductImageSrc(image)}-${index}`} className="group relative h-24 rounded border border-gray-100 bg-gray-50">
                <img src={getEditableProductImageSrc(image)} alt={product.name} className="h-full w-full object-contain" />
                <button
                  type="button"
                  aria-label="Eliminar imagen"
                  onClick={() => handleDeleteImage(index)}
                  className="absolute right-1 top-1 rounded-full bg-white p-1 text-danger shadow-sm transition hover:bg-red-50"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-3 flex gap-2">
            <div className="relative min-w-0 flex-1">
              <Input
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleAddCloudinaryUrl();
                  }
                  if (event.key === "Escape") onCancel();
                }}
                placeholder="URL de Cloudinary"
                className="h-8 pr-8 text-xs"
              />
              <LinkIcon
                size={14}
                className="pointer-events-none absolute right-2 top-1/2 text-gray-400"
                style={{ transform: "translateY(-50%)" }}
              />
            </div>
            <Button type="button" size="xs" onClick={handleAddCloudinaryUrl}>
              <ImagePlus size={14} />
              URL
            </Button>
          </div>

          <input
            ref={imageFileInputRef}
            type="file"
            accept={PRODUCT_IMAGE_ACCEPTED_TYPES.join(",")}
            multiple
            onChange={handleAddFiles}
            className="hidden"
          />

          <div className="mt-2 flex items-center justify-between gap-2">
            <Button type="button" variant="outline" size="xs" onClick={() => imageFileInputRef.current?.click()}>
              <Upload size={14} />
              Archivo
            </Button>
            <span className="text-xs text-gray-400">{images.length} imagen(es)</span>
          </div>

          {imageError && <p className="mt-2 text-xs text-danger">{imageError}</p>}
        </div>
      )}
    </div>
  );
}
