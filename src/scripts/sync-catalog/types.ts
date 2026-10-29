export interface SourceProduct {
  providerProductId: string;
  name: string;
  costPesos: number;
  inStock: boolean;
  description: string;
  imageUrls: string[];
}

export interface ExistingProduct {
  providerProductId: string;
  costPesos: number | null;
  pricePesos: number | null;
  inStock: boolean;
  description: string;
  deleted: boolean;
  images: string[];
}

export interface PlannedRow {
  providerProductId: string;
  name: string;
  costPesos: number;
  pricePesos: number;
  inStock: boolean;
  description: string;
  imageUrls: string[];
}

export interface PriceChange {
  providerProductId: string;
  oldPrice: number | null;
  newPrice: number;
}

export interface SyncStats {
  inserted: number;
  updated: number;
  unchanged: number;
  reactivated: number;
  markedOutOfStock: number; // presentes pero agotados
  markedAbsent: number; // ausentes en la fuente
  priceChanges: number;
  skippedDeleted?: number;
}

export interface SyncPlan {
  inserts: PlannedRow[];
  updates: PlannedRow[];
  markOutOfStockIds: string[];
  priceChanges: PriceChange[];
  skippedInserts: { providerProductId: string; reason: string }[];
  stats: SyncStats;
}

export type Group = { product: SourceProduct; memberIds: string[] };

export class SyncAbortError extends Error {
  reasons: string[];
  constructor(reasons: string[]) {
    super(reasons.join(" | "));
    this.name = "SyncAbortError";
    this.reasons = reasons;
  }
}