import { Button } from "@/components/ui";
import { ProductCard } from "@/components";
import { ProductType } from "@/types";

export const DailyHighlights = ({ products }: { products: ProductType[] }) => {

  return (
    <section className="w-11/12 max-w-content mx-auto py-8 md:py-12">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div
          className="w-full rounded-xl overflow-hidden relative"
          style={{
            background: "linear-gradient(145deg, #0098CE 0%, #FED90F 90%)",
          }}
        >
          <div className="p-8 flex flex-col h-full justify-between">
            <div>
              <h2 className="text-4xl font-subheading text-white mb-2">
                Destacados Del Día
              </h2>
              <p className="text-white/90 mb-6">
                Ofertas especiales por tiempo limitado
              </p>
            </div>
            <Button className="bg-white hover:bg-white/80 text-black w-fit shadow-md">
              CONOCELOS
            </Button>
          </div>
        </div>

        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};