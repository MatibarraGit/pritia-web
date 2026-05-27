"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";

import { Input, Popover, PopoverContent, PopoverTrigger, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea } from "@/components/ui";
import { cn } from "@/libs/utils";
import type { ColumnType, EditableCellValue } from "@/types";
import { splitProviderNames, toDateTimeInputValue } from "@/utils";

interface EditableCellProps {
  className?: string;
  active: boolean;
  disabled?: boolean;
  displayValue: string;
  type: ColumnType;
  value: EditableCellValue | null | undefined;
  options?: Array<{ value: string; label: string }>;
  onActivate: () => void;
  onChange: (value: EditableCellValue) => void;
  onCancel: () => void;
}

export function EditableCell({
  className,
  active,
  disabled,
  displayValue,
  type,
  value,
  options,
  onActivate,
  onChange,
  onCancel,
}: EditableCellProps) {
  const [editValue, setEditValue] = useState(type === "datetime" ? toDateTimeInputValue(value) : String(value ?? ""));
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  const commitValue = () => {
    if (type === "currency" || type === "number" || type === "percentage") {
      onChange(Number(editValue) || 0);
      return;
    }

    onChange(editValue);
  };

  if (type === "datetime" && !active) {
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={onActivate}
        className={cn("w-full rounded px-2 py-1 text-sm text-gray-700", !disabled && "cursor-pointer hover:bg-gray-100")}
      >
        {displayValue}
      </button>
    );
  }

  if (type === "boolean") {
    return active ? (
      <Select
        open={active}
        value={String(value)}
        onOpenChange={(open) => {
          if (!open) onCancel();
        }}
        onValueChange={(nextValue) => onChange(nextValue === "true")}
      >
        <SelectTrigger className="h-8">
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
        onClick={onActivate}
        className={cn(
          "rounded-full border px-3 py-1 text-xs font-medium",
          value ? "border-yellow-200 bg-yellow-100 text-yellow-800" : "border-red-200 bg-red-100 text-red-800",
          !disabled && "cursor-pointer"
        )}
      >
        {displayValue}
      </button>
    );
  }

  if (type === "select") {
    return active ? (
      <Select
        open={active}
        value={String(value || "")}
        onOpenChange={(open) => {
          if (!open) onCancel();
        }}
        onValueChange={onChange}
      >
        <SelectTrigger className="h-8">
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
        onClick={onActivate}
        className={cn("w-full rounded px-2 py-1 text-sm text-gray-700", !disabled && "cursor-pointer hover:bg-gray-100")}
      >
        {displayValue}
      </button>
    );
  }

  if (type === "multiselect") {
    const selectedValues = Array.isArray(value) ? value : splitProviderNames(String(value || ""));

    return (
      <Popover
        open={active}
        onOpenChange={(open) => {
          if (!open) onCancel();
        }}
      >
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            onClick={onActivate}
            className={cn("w-full rounded px-2 py-1 text-sm text-gray-700", !disabled && "cursor-pointer hover:bg-gray-100")}
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
                  onClick={() => onChange(nextValues)}
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
    );
  }

  if (active) {
    if (type === "textarea") {
      return (
        <div className="w-full relative bottom-8">
          <Textarea
            ref={textareaRef}
            value={editValue}
            onChange={(event) => setEditValue(event.target.value)}
            onBlur={commitValue}
            onKeyDown={(event) => {
              if ((event.ctrlKey || event.metaKey) && event.key === "Enter") commitValue();
              if (event.key === "Escape") onCancel();
            }}
            className={cn("max-w-80 min-h-36 resize-y bg-white text-left absolute", className)}
          />
        </div>
      );
    }

    return (
      <Input
        ref={inputRef}
        type={type === "text" ? "text" : type === "datetime" ? "datetime-local" : "number"}
        value={editValue}
        onChange={(event) => setEditValue(event.target.value)}
        onBlur={commitValue}
        onKeyDown={(event) => {
          if (event.key === "Enter") commitValue();
          if (event.key === "Escape") onCancel();
        }}
        min={type === "percentage" ? 0 : type === "number" ? 0 : undefined}
        max={type === "percentage" ? 100 : undefined}
        className={"h-8 bg-white" + (className ? ` ${className}` : "")}
        step={type === "currency" ? 100 : undefined}
      />
    );
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onActivate}
      className={cn("w-full rounded px-2 py-1 text-sm text-gray-700", !disabled && "cursor-pointer hover:bg-gray-100", className)}
    >
      {displayValue}
    </button>
  );
}
