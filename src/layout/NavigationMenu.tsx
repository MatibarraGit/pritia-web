import Link from "next/link";
import { CategoriesDropdown } from "@/layout/header/CategoriesDropdown";
import { ShippingModal, SchedulesModal, ContactModal } from "@/components";

export const NavigationMenu = () => {
  return (
    <nav className="hidden h-14 sticky top-16 left-0 right-0 z-30 bg-primary text-white shadow-md md:flex">
    {/* <nav className="hidden h-14 fixed top-16 left-0 right-0 z-30 bg-primary text-white shadow-md md:flex"> */}
      <div className="container w-11/12 max-w-content mx-auto">
        <div className="flex items-center justify-between h-14">
          <ul className="hidden md:flex items-center gap-5">
            <NavigationItem href="/" label="Inicio" />
            <NavigationItem href="/productos" label="Todos los productos" />
            <CategoriesDropdown />
            <NavigationItem href="/beneficios" label="Beneficios" /> 
          </ul>
          
          {/* Additional links */}
          <div className="hidden md:flex items-center gap-5">
            <li className="list-none">
              <ShippingModal />
            </li>
            <li className="list-none">
              <SchedulesModal />
            </li>
            <li className="list-none">
              <ContactModal />
            </li>
            <NavigationItem href="/ayuda" label="Ayuda" />
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