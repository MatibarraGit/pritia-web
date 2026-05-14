import type { Metadata } from "next";
import Link from "next/link";
import { Geist } from "next/font/google";
import "./globals.css";
import { Header, NavigationMenu, Footer } from "@/layout";
import { Toast } from "@/components";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Pritia",
    default: "Pritia",
  },
  description: "Vení a descrubrir los más de 600 productos que tenemos para vos!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased font-body`} suppressHydrationWarning>
        {/* Aviso de Beneficios por compra */}
        <Link 
          href="/beneficios"
          className="absolute top-0 left-0 w-full h-10 flex items-center justify-center text-white font-subheading text-center text-sm md:text-md"
          style={{
            background: "linear-gradient(145deg, #F0A412 0%, #FED90F 90%)"
          }}
        >
          ⚡ Conseguí un reintegro en tu próxima compra ⚡
        </Link>

        <Header />
        <NavigationMenu />
        <main className="w-full mt-14 bg-background md:mt-0">{children}</main>
        {/* <main className="w-full mt-30 bg-background">{children}</main> */}
        <Footer />
        <Toast />
      </body>
    </html>
  );
}
