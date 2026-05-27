import type { BatchedChanges } from "@/hooks";
import type { EditableProductField, OptionsCache, ProductColumnKey, ProductInlinePatchPayload, ProductType } from "@/types";
import { formatDate, formatPrice } from "@/utils";

export function applyProductChange(product: ProductType, field: EditableProductField, value: string | number | boolean | string[], options: OptionsCache) {
  const nextProduct = { ...product, [field]: value } as ProductType;

  if (field === "category") {
    const category = options.categories.find((item) => item.category_name === value);
    const subcategoryIsValid = category?.subcategories.some((subcategory) => subcategory.name === product.subcategory);
    if (!subcategoryIsValid) {
      nextProduct.subcategory = "";
    }
  }

  return nextProduct;
}

export function buildPatchPayload(
  product: ProductType,
  fields: BatchedChanges<EditableProductField>[number],
  options: OptionsCache
): Partial<ProductInlinePatchPayload> {
  const payload: Partial<ProductInlinePatchPayload> = {};

  for (const [field, change] of Object.entries(fields) as Array<[EditableProductField, { value: unknown }]>) {
    switch (field) {
      case "providers": {
        const providerNames = Array.isArray(change.value) ? change.value : splitProviderNames(String(change.value || ""));
        payload.providerIds = options.providers
          .filter((item) => providerNames.includes(item.provider_name))
          .map((item) => item.provider_id);
        break;
      }
      case "category": {
        const category = options.categories.find((item) => item.category_name === change.value);
        if (category) payload.categoryId = category.category_id;
        break;
      }
      case "subcategory": {
        const category = options.categories.find((item) => item.category_name === product.category);
        const subcategory = category?.subcategories.find((item) => item.name === change.value);
        payload.subcategoryId = subcategory?.id || null;
        break;
      }
      case "inStock":
        payload.inStock = Boolean(change.value);
        break;
      case "name":
        payload.name = String(change.value);
        break;
      case "description":
        payload.description = String(change.value || "");
        break;
      case "createdAt":
        payload.createdAt = String(change.value);
        break;
      case "updatedAt":
        payload.updatedAt = change.value ? String(change.value) : null;
        break;
      case "purchasePrice":
      case "price":
      case "resellersPrice":
      case "discountPercent":
      case "stock":
        payload[field] = Number(change.value);
        break;
    }
  }

  return payload;
}

let optionsCache: OptionsCache | null = null;
let optionsPromise: Promise<OptionsCache> | null = null;

export async function fetchProductTableOptions(): Promise<OptionsCache> {
  if (optionsCache) return optionsCache;
  if (!optionsPromise) {
    optionsPromise = Promise.all([
      fetch("/api/providers", { cache: "force-cache" }).then((res) => res.json()),
      fetch("/api/categories", { cache: "force-cache" }).then((res) => res.json()),
    ]).then(([providers, categories]) => {
      optionsCache = {
        providers: Array.isArray(providers) ? providers : [],
        categories: Array.isArray(categories) ? categories : [],
      };
      return optionsCache;
    });
  }

  return optionsPromise;
}

export function formatCellValue(product: ProductType, key: ProductColumnKey) {
  const value = product[key];

  if (key === "inStock") return value ? "Disponible" : "Agotado";
  if (key === "providers") return Array.isArray(value) && value.length > 0 ? value.join(", ") : "-";
  if (key === "purchasePrice" || key === "price" || key === "resellersPrice" || key === "originalPrice") return formatPrice(Number(value) || 0);
  if (key === "discountPercent") return `${Number(value) || 0}%`;
  if (key === "createdAt" || key === "updatedAt") return value ? formatDate(String(value)).fechaMostrar : "-";

  return String(value || "-");
}

export function getSelectOptions(product: ProductType, key: ProductColumnKey, options: OptionsCache) {
  if (key === "providers") {
    return options.providers.map((provider) => ({
      value: provider.provider_name,
      label: provider.provider_name,
    }));
  }

  if (key === "category") {
    return options.categories.map((category) => ({
      value: category.category_name,
      label: category.category_name,
    }));
  }

  if (key === "subcategory") {
    const category = options.categories.find((item) => item.category_name === product.category);
    return (category?.subcategories || [])
      .filter((subcategory) => subcategory.id && subcategory.name)
      .map((subcategory) => ({
        value: subcategory.name,
        label: subcategory.name,
      }));
  }

  return [];
}

export function splitProviderNames(value?: string) {
  if (!value) return [];
  return value
    .split(",")
    .map((provider) => provider.trim())
    .filter(Boolean);
}

export function toDateTimeInputValue(value: unknown) {
  if (!value) return "";
  const date = new Date(String(value));
  if (isNaN(date.getTime())) return "";

  const timezoneOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
}