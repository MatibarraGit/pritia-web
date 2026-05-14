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


      <div className="w-10/12 max-w-72 my-6 flex flex-col gap-3">
        <Button 
          className="w-full flex items-center gap-2.5 bg-green-600 border-green-600 text-white hover:bg-green-600/90"
          href={`https://wa.me/+5491131738925`}
          variant="outline"
        >
          <div className="flex items-center justify-center shrink-0">
            <Image src="/icons/whatsapp-white.svg" alt="WhatsApp" width={24} height={24} />
          </div>
          Consultar por WhatsApp 
        </Button>

        <Button variant="outline" href='/' className="w-full mx-auto text-center">
          Volver al Inicio
        </Button>
      </div>
    </div>
  );
};

