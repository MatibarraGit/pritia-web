import { ProductCard, Pagination } from "@/components";
import { ProductType } from "@/types";

interface ListProductsProps {
  products: ProductType[];
  totalPages?: number;
}

export const ListProducts = ({ products, totalPages }: ListProductsProps) => {
  return (
    <div className="h-full pb-8 flex flex-col gap-10 md:mt-0">
      <div
        className="h-fit grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] grid-auto-rows-[400px] gap-3 relative
          sm:grid-auto-rows-[350px]
          md:grow md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] md:grid-auto-rows-[370px]"
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {totalPages && totalPages > 1 && (
        <div className="h-fit self-center">
          <Pagination totalPages={totalPages} />
        </div>
      )}
    </div>
  );
};

