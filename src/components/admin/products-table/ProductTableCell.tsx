"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";

import { Checkbox, Label, Popover, PopoverContent, PopoverTrigger } from "@/components/ui";
import { EditableCell } from "@/components";
import { cn } from "@/libs/utils";
import type { ColumnConfig, EditableCellValue, OptionsCache, ProductType } from "@/types";
import { formatCellValue, formatPrice, getSelectOptions } from "@/utils";

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

  // Estados para el popover de la columna de imágenes
  const [areImagesExpanded, setAreImagesExpanded] = useState(false);
  const imagesPopoverRef = useRef<HTMLDivElement>(null);
  const imagesWrapperRef = useRef<HTMLDivElement>(null);

  // Efecto para que se cierre el popover de las imágenes al hacer click fuera
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

  // Estados para el popover de la columna de precio de compra
  const [currencyPopoverOpen, setCurrencyPopoverOpen] = useState(false);
  const [purchaseSurcharge, setPurchaseSurcharge] = useState<0 | 3 | 5>(0);
  const [originalPrice, setOriginalPrice] = useState(product.purchasePrice);

  const priceWithDiscount =
    product.discountPercent !== 0 && product.originalPrice !== undefined
      ? product.originalPrice * (1 - product.discountPercent / 100)
      : undefined;

  // Verifica si es la columna de imágenes
  if (column.key === "images") {
    const images = product.images || [];

    if (images.length === 0) {
      return <span className="text-xs text-gray-400">Sin img.</span>;
    }

    return (
      <div ref={imagesWrapperRef} className="relative w-full">
        <div className="relative h-16 rounded border border-gray-100 bg-gray-50">
          <img 
            src={images[0]} 
            alt={product.name} 
            className={`h-full w-full object-contain ${images.length > 1 ? " cursor-pointer" : ""}`}
            onClick={images.length > 1 
              ? () => setAreImagesExpanded((current) => !current)
              : () => {}
            }
          />
          {images.length > 1 && (
            <div
              className="absolute bottom-1 right-1 rounded-full bg-gray-900 px-2 py-0.5 text-xs font-semibold leading-none text-white shadow-sm transition hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 pointer-events-none"
            >
              {images.length}
            </div>
          )}
        </div>
        
        {/* Si se hace click en la imagen se abre un popover con las imágenes */}
        {areImagesExpanded &&
          <div
            ref={imagesPopoverRef}
            data-images-expanded={areImagesExpanded ? "true" : undefined}
            className="absolute z-40 w-72 rounded-lg border border-gray-200 bg-white p-2 shadow-xl"
            style={{ left: 0, top: 0 }}
          >
            <div className="grid grid-cols-2 gap-2">
              {images.map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className="h-20  rounded border border-gray-100 bg-gray-50"
                >
                  <img src={image} alt={product.name} className="h-full w-full object-contain" />
                </div>
              ))}
            </div>
          </div>
          }
      </div>
    );
  }

  // Verifica si es la columna de precio de compra
  if (column.key === "purchasePrice") {
    const isDisabled = !isEditMode || !column.editable;
    const changePurchasePrice = onLiveChange ?? onChange;
    const baseSurcharge = 
      product.providers!.includes('Women') ? 5 
      : ['Montecarlo Hogar', 'Electroben', 'New Red', 'MYE Hogar', 'Toto Home', 'OnElectronic', 'Electro Stagliano'].some(p => product.providers?.includes(p)) ? 3  
      : 0;

    const handlePurchaseCancel = () => {
      onCancel();
    };

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

    function onChangeLocal(value: EditableCellValue) {
      const valueNumber = Number(value);
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
            className="w-full block"
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
                onCancel={handlePurchaseCancel}
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
          Precio sin recargo {purchaseSurcharge === 0 ?
            formatPrice(Math.ceil((originalPrice * (1 - baseSurcharge / 100)) / 500) * 500) :
            formatPrice(originalPrice)
          } 
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
    const isDisabled = !isEditMode || !column.editable;

    function onChangeLocal(value: EditableCellValue) {
      const valueNumber = Number(value);
      onChange(valueNumber, { key: "originalPrice", label: "P/Venta", type: "currency", editable: true, width: "minmax(130px, 0.8fr)" }); 
    }
    
    const classNames = `mx-auto absolute bottom-4 left-0 right-0 ${!isActive ? "text-sm line-through text-gray-500" : ""}`;

    return (
      <div className="w-full">
        {product.originalPrice !== undefined ? (
          <div className="w-full relative">
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

            <span className="">
              {priceWithDiscount !== undefined ? formatPrice(priceWithDiscount) : null}
            </span>
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

  const classname = cn(
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
      disabled={!isEditMode || !column.editable}
      displayValue={formatCellValue(product, column.key)}
      type={column.type}
      value={column.key === "providers" ? product.providers || [] : (value as EditableCellValue | null | undefined)}
      options={getSelectOptions(product, column.key, options)}
      onActivate={onActivate}
      onCancel={onCancel}
      onChange={onChange}
      className={classname}
    />
  );
}
