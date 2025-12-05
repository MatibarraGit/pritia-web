"use client";

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen p-4 pt-[100px] grid items-start justify-items-center bg-background">
      <div className="w-11/12 max-w-content mx-auto grid gap-8 md:flex md:justify-center md:items-center md:gap-5">
        <div className="grid place-items-center">
          <img
            src="/img/productNotFound.png"
            alt="Producto no encontrado"
            width={300}
            height={300}
            className="w-[250px] h-auto opacity-90 md:w-[300px]"
          />
        </div>
        <div className="grid gap-4 text-center md:text-left">
          <h1 className="w-full m-0 text-2xl text-gray-800 md:text-3xl">
            ¡Oops! Producto no encontrado
          </h1>
          <p className="m-0 text-base leading-6 text-gray-500 md:text-lg">
            Lo sentimos, el producto que estás buscando no tiene existencias o fue removido.
          </p>
          <Link 
            href="/" 
            className="inline-block px-6 py-3 font-medium justify-self-center md:justify-self-start rounded-md bg-primary text-white hover:bg-primary-hover active:translate-y-0.5 transition-colors duration-300"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
