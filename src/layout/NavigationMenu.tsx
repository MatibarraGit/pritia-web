import Link from "next/link";
import { CategoriesDropdown } from "@/components/layout/header/CategoriesDropdown";

// TODO: Agregar todos los links de navegación
export const NavigationMenu = () => {
  return (
    <nav className="hidden h-14 fixed top-16 left-0 right-0 z-30 bg-primary text-white shadow-md md:flex">
      <div className="container w-11/12 max-width-screen mx-auto">
        <div className="flex items-center justify-between h-14">
          <ul className="hidden md:flex items-center gap-5 -ml-4">
            <NavigationItem href="/" label="Inicio" />
            <NavigationItem href="/products" label="Todos los productos" />
            <CategoriesDropdown />
          </ul>
          
          {/* Additional links */}
          <div className="hidden md:flex space-x-4">
            <NavigationItem href="/" label="Promociones" />
            <NavigationItem href="/" label="Ayuda" />
            <NavigationItem href="/" label="Contacto" />
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavigationItem = ({ href, label }: { href: string; label: string }) => {
  return (
    <li className="list-none">
      <Link href={href} className="text-sm font-medium hover:text-gray-200">
        {label}
      </Link>
    </li>
  );
}