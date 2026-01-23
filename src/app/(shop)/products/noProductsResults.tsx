import Image from "next/image";
import { Button } from "@/components/ui";

export const NoProductsResults = ({ category }: { category?: string }) => {
  return (
    <div className="w-full mx-auto flex items-center flex-col relative bg-white min-h-content text-center">
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
          , intentá con otra categoría o consultanos por el producto que buscás a nuestro WhatsApp.
        </p>
      ) : (
        <p>
          Parece que no hay productos todavía, volvé a intentarlo más tarde o probá
        </p>
      )}


      <div className="mt-4 flex flex-col gap-2">
        {category && (
          // TODO: Agregar el ícono y color de WhatsApp 
          <Button href={`https://wa.me/+5491131738925`} variant="primary" >
            Consultar por WhatsApp
          </Button>
        )}

        <Button href="/" variant={category ? "outline" : "primary"} >
          Volver al Inicio
        </Button>
      </div>
    </div>
  );
};

