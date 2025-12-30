import { JSX } from "react";
import { LucideIcon } from "lucide-react";

export type AuthFormData = {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  confirmPassword?: string;
} 

export type ProductType = {
  id: number;
  images: string[];
  name: string;
  provider?: string;
  purchasePrice: number;
  price: number;
  originalPrice?: number;
  resellersPrice?: number;
  discountPercent: number;
  category: string;
  subcategory: string;
  inStock: boolean;
  stock: number;
  description: string;
  slug: string;
  updatedAt?: string;
  createdAt?: string;
  totalQuantitySold?: number;
}

export type ProductResponseType = {
  product_id: number;
  images: string[];
  product_name: string;
  provider_name?: string;
  purchase_price: number;
  sell_price: number;
  resellers_price?: number;
  discount_percent: number;
  category_name: string;
  subcategory_name: string;
  in_stock: boolean;
  stock: number;
  product_description: string;
  product_slug: string;
  updated_at?: string;
  created_at?: string;
  total_quantity_sold?: number;
}

export type CategoryType = {
  category_id: number;
  category_name: string;
  subcategories: {
    id: number;
    name: string;
  }[];
}

// export type CategoryType = {
//   id: number;
//   name: string;
//   image?: string;
// };

export type CartItemType = {
  id: number;
  image: string;
  name: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  slug: string;
};

export type Sale = {
  id: number;
  sale_date: Date;
  sale_total: number;
}

export type SaleItem = {
  id: number;
  sale_id: number;
  product_id: number;
  unit_purchase_price: number;
  unit_sale_price: number;
  quantity: number;
}

export type UserType = {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: Date;
}

export type Provider = {
  provider_id: number;
  provider_name: string;
}

export type VisitorEmailType = {
  id: number;
  email: string;
  created_at: Date;
}

export type FanType = {
  id: number;
  title: string;
  description: string;
  image: string;
  buttonText: string;
};

export type ServiceType = {
  id: number;
  icon: LucideIcon | JSX.Element;
  title: string;
  description: string;
};

export type SelectedItemsType = {
  id: number;
  name: string;
  image: string;
  description: string;
  sellPrice?: number;
  resellersPrice?: number;
  price?: number;
}

export type ActionResponse = {
  successMessage?: string | undefined;
  errorMessage?: string | undefined;
}