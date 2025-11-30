import Link from "next/link";
import { CategoriesDropdown } from "@/layout/header/CategoriesDropdown";
import { ShippingModal, SchedulesModal, ContactModal } from "@/components";

// TODO: Agregar todos los links de navegación
export const NavigationMenu = () => {
  return (
    <nav className="hidden h-14 fixed top-16 left-0 right-0 z-30 bg-primary text-white shadow-md md:flex">
      <div className="container w-11/12 max-w-content mx-auto">
        <div className="flex items-center justify-between h-14">
          <ul className="hidden md:flex items-center gap-5">
            <NavigationItem href="/" label="Inicio" />
            <NavigationItem href="/products" label="Todos los productos" />
            <CategoriesDropdown />
          </ul>
          
          {/* Additional links */}
          <div className="hidden md:flex items-center gap-5">
            <NavigationItem href="/" label="Promociones" />
            <li className="list-none">
              <ShippingModal />
            </li>
            <li className="list-none">
              <SchedulesModal />
            </li>
            <li className="list-none">
              <ContactModal />
            </li>
            <NavigationItem href="/help" label="Ayuda" />
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