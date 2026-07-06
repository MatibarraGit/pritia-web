import type { BatchedChanges } from "@/hooks/admin-products-table/use-batched-changes";
import type { SortConfig } from "@/hooks/use-order-context";
import type {
  EditableCellValue,
  EditableProductField,
  EditableProductImage,
  EditableProductImageFile,
  OptionsCache,
  ProductColumnKey,
  ProductInlinePatchPayload,
  ProductType,
} from "@/types";
import { ACTION_TYPES } from "./constants";
import { formatDate } from "./formatDate";
import { formatPrice } from "./formatPrice";

export const EMPTY_PRODUCT_TABLE_OPTIONS: OptionsCache = {
  providers: [],
  categories: [],
};

export const PRODUCT_IMAGE_MAX_FILE_SIZE = 5 * 1024 * 1024;
export const PRODUCT_IMAGE_ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export function isEditableProductImageFile(value: unknown): value is EditableProductImageFile {
  return (
    typeof value === "object" &&
    value !== null &&
    "kind" in value &&
    (value as { kind?: unknown }).kind === "file" &&
    "file" in value &&
    typeof File !== "undefined" &&
    (value as { file?: unknown }).file instanceof File
  );
}

export function getEditableProductImageSrc(image: EditableProductImage) {
  return typeof image === "string" ? image : image.previewUrl;
}

export function isOwnCloudinaryImageUrl(value: string, cloudName?: string | null) {
  if (!cloudName) return false;

  try {
    const url = new URL(value);
    const expectedPrefix = `/${cloudName}/image/upload/`;

    return url.protocol === "https:" && url.hostname === "res.cloudinary.com" && url.pathname.startsWith(expectedPrefix);
  } catch {
    return false;
  }
}

function normalizeEditableImages(value: unknown): EditableProductImage[] {
  if (!Array.isArray(value)) return [];

  return value.filter((image): image is EditableProductImage => (
    typeof image === "string" || isEditableProductImageFile(image)
  ));
}

export function applyProductChange(product: ProductType, field: EditableProductField, value: EditableCellValue, options?: OptionsCache) {
  const nextProduct = { ...product, [field]: value } as ProductType;

  if (field === "category" && options) {
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
  options?: OptionsCache
): Partial<ProductInlinePatchPayload> | FormData {
  const payload: Partial<ProductInlinePatchPayload> = {};
  let imageItems: EditableProductImage[] | null = null;

  for (const [field, change] of Object.entries(fields) as Array<[EditableProductField, { value: unknown }]>) {
    switch (field) {
      case "images":
        imageItems = normalizeEditableImages(change.value);
        break;
      case "providers": {
        const providerNames = Array.isArray(change.value) ? change.value : splitProviderNames(String(change.value || ""));
        payload.providerIds = options?.providers
          .filter((item) => providerNames.includes(item.provider_name))
          .map((item) => item.provider_id);
        break;
      }
      case "category": {
        const category = options?.categories.find((item) => item.category_name === change.value);
        if (category) payload.categoryId = category.category_id;
        break;
      }
      case "subcategory": {
        const category = options?.categories.find((item) => item.category_name === product.category);
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

  if (imageItems) {
    const formData = new FormData();
    formData.append("patch", JSON.stringify(payload));

    imageItems.forEach((image) => {
      if (typeof image === "string") {
        formData.append("images", image);
        return;
      }

      formData.append("images", image.file, image.name || image.file.name);
    });

    return formData;
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

export function getProductTableActionTitle(actionType: string) {
  if (actionType === ACTION_TYPES.DELETE) return "Eliminar productos seleccionados";
  if (actionType === ACTION_TYPES.SHARE) return "Compartir productos";

  return "";
}

export const PRODUCT_TABLE_SORT_CONFIG = {
  inStock: { type: "string" },
  name: { type: "string" },
  description: { type: "string" },
  providers: { type: "string" },
  purchasePrice: { type: "number" },
  price: { type: "number" },
  originalPrice: { type: "number" },
  resellersPrice: { type: "number" },
  discountPercent: { type: "number" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
  stock: { type: "number" },
  category: { type: "string" },
  subcategory: { type: "string" },
} satisfies SortConfig;

export function getProductTableSortColumn(property?: string | null): ProductColumnKey | null {
  if (!property || !(property in PRODUCT_TABLE_SORT_CONFIG)) return null;

  return property as ProductColumnKey;
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