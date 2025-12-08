import Image from "next/image";
import { NavigationMenu } from "@/layout/NavigationMenu";
import { Button } from "@/components/ui";

export const NoProductsResults = ({ category }: { category?: string }) => {
  return (
    <div className="w-full mx-auto flex flex-col relative bg-white items-center min-h-content">
      <Image
        src={"/img/product-not-found.png"}
        alt="No se encontraron resultados"
        width={400}
        height={250}
        className="object-contain"
      />

      {category ? (
        <p>
          No se encontraron productos para la categoría
          <strong>{` "${category}"`}</strong>
          , intentá con otra categoría o introducila en la sección de búsqueda.
        </p>
      ) : (
        <p>
          Parece que no hay productos todavía, volvé a intentarlo más tarde o probá
        </p>
      )}


      <div className="mt-4 flex flex-col gap-2">
        <Button href={`/search/${category}`} variant="primary" >
          {`Buscar "${category}"`}
        </Button>

        <Button href="/" variant="outline" >
          Volver al Inicio
        </Button>
      </div>
    </div>
  );
};

