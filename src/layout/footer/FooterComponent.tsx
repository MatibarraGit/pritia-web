import Image from "next/image";
import Link from "next/link";
import { ShippingModal, SchedulesModal, ContactModal } from "@/components";

export const FooterComponent = () => {
  return (
    <section className="w-full font-body bg-background">
      <div className="w-full max-w-content mx-auto px-2">
        <div className="flex flex-col md:flex-row md:justify-between md:gap-8">
          <div className="flex flex-col mt-8 md:mt-0 md:h-full md:my-auto">
            <Image
              src="/logo2.png"
              alt="logo"
              width={180}
              height={180}
              className="w-45 h-45 aspect-square"
            />
            <h1 className="absolute opacity-0">[Nombre del negocio]</h1>
          </div>

          <div className="flex flex-col md:flex-row md:gap-8 md:flex-[0_0_65%] md:w-fit md:mt-5">
            <div className="mt-6 md:mt-0 md:mb-3">
              <h3 className="mb-3 text-base font-subheading">Información General</h3>
              <ul className="p-0 list-none">
                <li className="max-w-62 mb-2 text-sm text-gray-600">
                  <Link href="/" className="text-gray-600 no-underline hover:text-primary transition-colors">
                    Inicio
                  </Link>
                </li>
                {/* <li className="max-w-62 mb-2 text-sm text-gray-600">
                  <Link href="#" className="text-gray-600 no-underline">
                    ¿Quiénes somos?
                  </Link>
                </li> */}
                <li className="max-w-62 mb-2 text-sm text-gray-600">
                  <ShippingModal
                    trigger={
                      <button
                        type="button"
                        className="text-gray-600 no-underline hover:text-primary transition-colors text-left"
                      >
                        Envíos
                      </button>
                    }
                  />
                </li>
                <li className="max-w-62 mb-2 text-sm text-gray-600">
                  <Link href="/help" className="text-gray-600 no-underline hover:text-primary transition-colors">
                    Ayuda
                  </Link>
                </li>
                {/* <li className="max-w-62 mb-2 text-sm text-gray-600">
                  <Link href="#" className="text-gray-600 no-underline">
                    Términos y Condiciones
                  </Link>
                </li> */}
                {/* <li className="max-w-62 mb-2 text-sm text-gray-600">
                  <Link href="#" className="text-gray-600 no-underline">
                    Políticas de Privacidad
                  </Link>
                </li> */}
              </ul>
            </div>

            <div className="mt-6 md:mt-0 md:mb-3">
              <h3 className="mb-3 text-base font-subheading">Todo en un solo lugar</h3>
              <ul className="p-0 list-none">
                <li className="max-w-62 mb-2 text-sm text-gray-600">
                  ✔ Miles de productos originales
                </li>
                <li className="max-w-62 mb-2 text-sm text-gray-600">
                  ✔ Garantías de hasta 12 meses
                </li>
                <li className="max-w-62 mb-2 text-sm text-gray-600">
                  ✔ Envíos a todo el país
                </li>
                <li className="max-w-62 mb-2 text-sm text-gray-600">
                  ✔ Nuevos productos cada semana
                </li>
              </ul>
            </div>

            <div className="mt-6 md:mt-0 md:mb-3">
              <ContactModal
                trigger={
                  <h3 className="mb-3 text-base font-subheading cursor-pointer hover:text-primary transition-colors">
                    Contacto
                  </h3>
                }
              />
              <ul className="p-0 list-none">
                <li className="max-w-62 mb-2 text-sm text-gray-600">
                  <SchedulesModal
                    trigger={
                      <button
                        type="button"
                        className="text-gray-600 no-underline hover:text-primary transition-colors text-left"
                      >
                        Horarios
                      </button>
                    }
                  />
                </li>
                <li className="max-w-62 mb-2 text-sm text-gray-600">
                  <a
                    href="https://wa.me/+5491131738925"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 no-underline hover:text-primary transition-colors"
                  >
                    WhatsApp
                  </a>
                </li>
                <li className="max-w-62 mb-2 text-sm text-gray-600">
                  <a
                    href="https://web.facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 no-underline hover:text-primary transition-colors"
                  >
                    Facebook
                  </a>
                </li>
                <li className="max-w-62 mb-2 text-sm text-gray-600">
                  <a
                    href="https://www.instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 no-underline hover:text-primary transition-colors"
                  >
                    Instagram
                  </a>
                </li>
                <li className="max-w-62 mb-2 text-sm text-gray-600">
                  <a
                    href="mailto:"
                    className="text-gray-600 no-underline hover:text-primary transition-colors"
                  >
                    Correo
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 flex flex-col items-center border-t border-gray-300">
          <p className="mb-4 text-xs md:text-sm text-gray-600">
            Copyright &copy; [Nombre del negocio] - Desarrollado por Matías Ibarra. Derechos reservados.
          </p>
        </div>
      </div>
    </section>
  );
};

