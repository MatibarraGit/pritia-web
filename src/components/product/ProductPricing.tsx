import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/utils";

interface ProductPricingProps {
  price: number;
  originalPrice?: number;
  discountPercent: number;
  inStock: boolean;
  stock: number;
}

export function ProductPricing({
  price,
  originalPrice,
  discountPercent,
  inStock,
  stock,
}: ProductPricingProps) {
  return (
    <div className="space-y-2">
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

      <div className="text-2xl md:text-3xl font-subheading" style={{ color: "#000" }}>
        {formatPrice(price)}
      </div>

      {inStock ? (
        <div className="mt-4 text-sm text-green-600">
          <span className="font-medium">✓ En stock</span>
          {stock > 0 && (
            <span className="ml-2 text-gray-600">
              ({stock} disponibles)
            </span>
          )}
        </div>
      ) : (
        <div className="text-sm text-red-600">
          <span className="font-medium">✗ Sin stock</span>
        </div>
      )}
    </div>
  );
}

