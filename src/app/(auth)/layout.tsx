import "../(shop)/globals.css";

import { type ReactNode } from "react";

export const metadata = {
  title: "Autenticación",
  description: "",
};

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <html lang="es">
      <head></head>
      <body 
        className="font-body bg-[#F2F7FB] antialiased"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
