import { HeartOff } from 'lucide-react';

export const NoLovedProducts = () => {
  return (
    <section className="w-4/5 max-w-[500px] mt-[30px] mx-auto text-center text-lg">
      <HeartOff size={150} className="text-primary" />
      <h2 className="mt-4">Sin productos favoritos</h2>
      <p className="max-w-lg text-center mt-2 mx-auto">
        Aún no agregaste productos a tu lista de favoritos. Explorá el catálogo y marcá con el
        corazón aquellos que te interesen para verlos acá.
      </p>
    </section>
  );
};

