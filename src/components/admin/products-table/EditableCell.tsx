"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Clock } from "lucide-react";

import { Input, Popover, PopoverContent, PopoverTrigger, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea } from "@/components/ui";
import { cn } from "@/libs/utils";
import type { ColumnType, EditableCellValue } from "@/types";
import { splitProviderNames, toDateTimeInputValue } from "@/utils";
import { formatPrice2 } from "@/utils/formatPrice";

interface EditableCellProps {
  className?: string;
  active?: boolean;
  disabled?: boolean;
  displayValue: string;
  type: ColumnType;
  value: EditableCellValue | null | undefined;
  options?: Array<{ value: string; label: string }>;
  onActivate?: () => void;
  onChange: (value: EditableCellValue) => void;
  onCancel?: () => void;
  label?: string;
  isDirty?: boolean;
  mobileMode?: boolean;
}

export function EditableCell({
  className,
  active: externalActive,
  disabled,
  displayValue,
  type,
  value,
  options,
  onActivate,
  onChange,
  onCancel,
  label,
  isDirty,
  mobileMode = false,
}: EditableCellProps) {
  const [internalActive, setInternalActive] = useState(false);
  const active = externalActive !== undefined ? externalActive : internalActive;
  const [editValue, setEditValue] = useState(type === "datetime" ? toDateTimeInputValue(value) : String(value ?? ""));
  const [hasChanged, setHasChanged] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleActivate = () => {
    setHasChanged(false);
    if (onActivate) {
      onActivate();
    } else {
      setInternalActive(true);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      setInternalActive(false);
    }
  };

  useEffect(() => {
    if (active && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
    if (active && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [active]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!active) {
      setEditValue(type === "datetime" ? toDateTimeInputValue(value) : String(value ?? ""));
    }
  }, [value, type, active]);

  const commitValue = () => {
    if (!hasChanged) {
      handleCancel();
      return;
    }

    if (type === "currency" || type === "number" || type === "percentage") {
      const parsed = Number(editValue.replace(/[^\d.-]/g, ""));
      onChange(Number.isFinite(parsed) ? parsed : 0);
      return;
    }

    onChange(editValue);
    if (onCancel === undefined) {
      setInternalActive(false);
    }
  };

  const actualDisplayValue = mobileMode && (type === "currency" || type === "number") ? formatPrice2(Number(value)) : displayValue;

  if (type === "datetime" && !active) {
    return (
      <div className={cn("flex flex-col gap-1", className)}>
        {label && (
          <div className="flex items-center gap-2">
            <span className={cn("font-semibold uppercase tracking-wider text-muted-foreground", mobileMode ? "text-[10px]" : "text-xs")}>
              {label}
            </span>
            {isDirty && (
              <span className="inline-flex items-center rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-medium text-amber-800 dark:bg-amber-500/20 dark:text-amber-300">
                Pendiente
              </span>
            )}
          </div>
        )}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={disabled}
            onClick={handleActivate}
            className={cn(
              "w-full rounded text-sm text-gray-700",
              !disabled && "cursor-pointer hover:bg-gray-100",
              mobileMode ? "min-h-[44px] border border-input bg-background px-3 py-2 text-left text-foreground transition-colors hover:bg-accent" : "px-2 py-1",
              isDirty && mobileMode && "border-amber-400 bg-amber-50 dark:bg-amber-500/5"
            )}
          >
            {actualDisplayValue}
          </button>

          <button
            type="button"
            onClick={() => onChange(new Date().toISOString())}
            className="h-[44px] w-[44px] flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent transition-colors"
            title="Establecer fecha actual"
          >
            <Clock className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  if (type === "boolean") {
    return (
      <div className={cn("flex flex-col gap-1", className)}>
        {label && (
          <div className="flex items-center gap-2">
            <span className={cn("font-semibold uppercase tracking-wider text-muted-foreground", mobileMode ? "text-[10px]" : "text-xs")}>
              {label}
            </span>
            {isDirty && (
              <span className="inline-flex items-center rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-medium text-amber-800 dark:bg-amber-500/20 dark:text-amber-300">
                Pendiente
              </span>
            )}
          </div>
        )}
        {active ? (
          <Select
            open={active}
            value={String(value)}
            onOpenChange={(open) => {
              if (!open) {
                if (!hasChanged) {
                  handleCancel();
                }
              }
            }}
            onValueChange={(nextValue) => {
              setHasChanged(true);
              onChange(nextValue === "true");
            }}
          >
            <SelectTrigger className={mobileMode ? "min-h-[44px]" : "h-8"}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Disponible</SelectItem>
              <SelectItem value="false">Agotado</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <button
            type="button"
            disabled={disabled}
            onClick={handleActivate}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium",
              value ? "border-yellow-200 bg-yellow-100 text-yellow-800" : "border-red-200 bg-red-100 text-red-800",
              !disabled && "cursor-pointer"
            )}
          >
            {displayValue}
          </button>
        )}
      </div>
    );
  }

  if (type === "select") {
    return (
      <div className={cn("flex flex-col gap-1", className)}>
        {label && (
          <div className="flex items-center gap-2">
            <span className={cn("font-semibold uppercase tracking-wider text-muted-foreground", mobileMode ? "text-[10px]" : "text-xs")}>
              {label}
            </span>
            {isDirty && (
              <span className="inline-flex items-center rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-medium text-amber-800 dark:bg-amber-500/20 dark:text-amber-300">
                Pendiente
              </span>
            )}
          </div>
        )}
        {active ? (
          <Select
            open={active}
            value={String(value || "")}
            onOpenChange={(open) => {
              if (!open) {
                if (!hasChanged) {
                  handleCancel();
                }
              }
            }}
            onValueChange={(value) => {
              setHasChanged(true);
              onChange(value);
            }}
          >
            <SelectTrigger className={mobileMode ? "min-h-[44px]" : "h-8"}>
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              {(options || []).map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <button
            type="button"
            disabled={disabled}
            onClick={handleActivate}
            className={cn(
              "w-full rounded text-sm text-gray-700",
              !disabled && "cursor-pointer hover:bg-gray-100",
              mobileMode ? "min-h-[44px] border border-input bg-background px-3 py-2 text-left text-foreground transition-colors hover:bg-accent" : "px-2 py-1",
              isDirty && mobileMode && "border-amber-400 bg-amber-50 dark:bg-amber-500/5"
            )}
          >
            {displayValue}
          </button>
        )}
      </div>
    );
  }

  if (type === "multiselect") {
    const selectedValues = Array.isArray(value) ? value : splitProviderNames(String(value || ""));

    return (
      <div className={cn("flex flex-col gap-1", className)}>
        {label && (
          <div className="flex items-center gap-2">
            <span className={cn("font-semibold uppercase tracking-wider text-muted-foreground", mobileMode ? "text-[10px]" : "text-xs")}>
              {label}
            </span>
            {isDirty && (
              <span className="inline-flex items-center rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-medium text-amber-800 dark:bg-amber-500/20 dark:text-amber-300">
                Pendiente
              </span>
            )}
          </div>
        )}
        <Popover
          open={active}
          onOpenChange={(open) => {
            if (!open) {
              if (!hasChanged) {
                handleCancel();
              }
            }
          }}
        >
          <PopoverTrigger asChild>
            <button
              type="button"
              disabled={disabled}
              onClick={handleActivate}
              className={cn(
                "w-full rounded text-sm text-gray-700",
                !disabled && "cursor-pointer hover:bg-gray-100",
                mobileMode ? "min-h-[44px] border border-input bg-background px-3 py-2 text-left text-foreground transition-colors hover:bg-accent" : "px-2 py-1",
                isDirty && mobileMode && "border-amber-400 bg-amber-50 dark:bg-amber-500/5"
              )}
            >
              {displayValue}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-72 max-h-80 overflow-y-auto bg-white p-2">
            <div className="flex flex-col gap-1">
              {(options || []).map((option) => {
                const isSelected = selectedValues.includes(option.value);
                const nextValues = isSelected
                  ? selectedValues.filter((selectedValue) => selectedValue !== option.value)
                  : [...selectedValues, option.value];

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setHasChanged(true);
                      onChange(nextValues);
                    }}
                    className={cn(
                      "flex items-center justify-between rounded-md px-3 py-2 text-left text-sm transition hover:bg-gray-100",
                      isSelected && "bg-blue-50 text-blue-700"
                    )}
                  >
                    <span>{option.label}</span>
                    {isSelected && <Check size={16} />}
                  </button>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  if (active) {
    if (type === "textarea") {
      return (
        <div className={cn("w-full relative bottom-8")}>
          <Textarea
            ref={textareaRef}
            value={editValue}
            onChange={(event) => {
              setEditValue(event.target.value);
              setHasChanged(true);
            }}
            onBlur={commitValue}
            onKeyDown={(event) => {
              
              if (!mobileMode && (event.ctrlKey || event.metaKey) && event.key === "Enter") commitValue();
              if (event.key === "Escape") handleCancel();
            }}
            rows={mobileMode ? 3 : undefined}
            // className={cn(
            //   "bg-white text-left",
            //   mobileMode ? "w-full rounded-md border border-primary px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" : "max-w-80 min-h-36 resize-y absolute",
            //   className
            // )}
            className={cn("max-w-80 min-h-36 resize-y bg-white text-left absolute", className)}
          />
        </div>
      );
    }

    return (
      <Input
        ref={inputRef}
        type={type === "text" ? "text" : type === "datetime" ? "datetime-local" : "number"}
        inputMode={type === "number" || type === "currency" ? "decimal" : "text"}
        value={editValue}
        onChange={(event) => {
          setEditValue(event.target.value);
          setHasChanged(true);
        }}
        onBlur={commitValue}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            if (mobileMode) {
              event.preventDefault();
            }
            commitValue();
          }
          if (event.key === "Escape") handleCancel();
        }}
        min={type === "percentage" ? 0 : type === "number" ? 0 : undefined}
        max={type === "percentage" ? 100 : undefined}
        className={cn(
          "bg-white",
          mobileMode ? "min-h-[44px] w-full rounded-md border border-primary px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" : "h-8",
          className
        )}
        step={type === "currency" ? 100 : undefined}
      />
    );
  }

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {label && (
        <div className="flex items-center gap-2">
          <span className={cn("font-semibold uppercase tracking-wider text-muted-foreground", mobileMode ? "text-[10px]" : "text-xs")}>
            {label}
          </span>
          {isDirty && (
            <span className="inline-flex items-center rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-medium text-amber-800 dark:bg-amber-500/20 dark:text-amber-300">
              Pendiente
            </span>
          )}
        </div>
      )}
      <button
        type="button"
        disabled={disabled}
        onClick={handleActivate}
        className={cn(
          "w-full rounded text-sm text-gray-700",
          !disabled && "cursor-pointer hover:bg-gray-100",
          mobileMode ? "min-h-[44px] border border-input bg-background px-3 py-2 text-left text-foreground transition-colors hover:bg-accent" : "px-2 py-1",
          isDirty && mobileMode && "border-amber-400 bg-amber-50 dark:bg-amber-500/5"
        )}
      >
        {actualDisplayValue || (mobileMode && <span className="italic text-muted-foreground">Vacío</span>)}
      </button>
    </div>
  );
}
