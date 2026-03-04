import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/utils";

interface ProductPricingProps {
  price: number;
  originalPrice?: number;
  discountPercent: number;
  inStock: boolean;
}

export function ProductPricing({
  price,
  originalPrice,
  discountPercent,
  inStock
}: ProductPricingProps) {
  return (
    <div className="-mt-3">
      {discountPercent > 0 && (
        <div className="flex items-center gap-2">
          <Badge className="bg-primary text-white">
            {discountPercent}% OFF
          </Badge>
        </div>
      )}

      {originalPrice && (
        <div className="flex items-center gap-2">
          <span className="text-sm line-through text-gray-500">
            {formatPrice(originalPrice)}
          </span>
        </div>
      )}

      <div className="flex items-center gap-2">
        <span className="text-2xl md:text-3xl font-subheading" style={{ color: "#000" }}>
          {formatPrice(price)}
        </span>

        {inStock ? (
          <div className="px-3 py-1 text-sm text-white rounded-full bg-green-600">
            <span className="mr-2">✓</span>
            <span className="font-medium">En stock</span>
          </div>
        ) : (
          <div className="px-3 py-1 text-sm text-white rounded-full bg-red-600">
            <span className="mr-2">✗</span>
            <span className="font-medium">Sin stock</span>
          </div>
        )}
      </div>
    </div>
  );
}

