import type { Metadata } from "next";
import ReactDOM from "react-dom";
import { Analytics } from "@vercel/analytics/next"
import Link from "next/link";
import "./globals.css";
import { Header, NavigationMenu, Footer } from "@/layout";
import { Toast } from "@/components";

export const metadata: Metadata = {
  metadataBase: new URL("https://pritia.com.ar"),
  title: {
    default: "Pritia",
    template: "%s | Pritia",
  },
  applicationName: "Pritia",
  
  verification: {
    google: "vUwla3MNQCOpy4mbOR5N7D-vGK02_XvK1CQcgs-bq1s"
  },

  creator: "Matías Ibarra",
  authors: [ { name: 'Matías Ibarra', url: 'https://pritia.com.ar' } ], 

  icons: {
    icon: "/icon.png", // 32x32 o 48x48
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png", // 180x180
    other: [
      { rel: 'manifest', url: '/site.webmanifest' }
    ]
  },

  generator: "Next.js",
  keywords: [
    'electrodomésticos',
    'electrodomesticos',
    'tienda online',
    'ofertas',
    'herramientas',
    'ventiladores',
    'climatización',
    'climatizacion',
    'muebles',
    'línea blanca',
    'blanqueria',
    'bazar',
    'artículos varios',
    'articulos varios',
    'Pritia',
    'comprar online',
    'Argentina'
  ],

  openGraph: {
    title: "Pritia",
    description: "Tienda online de electrodomésticos, herramientas, blanquería, muebles y mucho más! Ofertas, envíos a todo el país y las mejores marcas.",
    url: "https://pritia.com.ar",
    siteName: "Pritia",
    images: [
      {
        url: "https://res.cloudinary.com/db8b2c9gb/image/upload/v1781446054/Logo%20Pritia.png",
        width: 1200,
        height: 630,
        alt: "Logo Pritia",
        type: "image/png",
      },
    ],
    locale: "es_AR",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Pritia",
    description: "Tienda online de electrodomésticos, herramientas, blanquería, muebles y mucho más! Ofertas, envíos a todo el país y las mejores marcas.",
    images: ["https://res.cloudinary.com/db8b2c9gb/image/upload/v1781446054/Logo%20Pritia.png"],
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
    }
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Precarga de las fuentes variables: el navegador las pide en paralelo al CSS
  // en vez de descubrirlas recien después de parsearlo.
  ReactDOM.preload("/fonts/montserrat-latin-wght-normal.woff2", {
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  });
  ReactDOM.preload("/fonts/mulish-latin-wght-normal.woff2", {
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  });

  return (
    <html lang="en">
      <body className="antialiased font-body" suppressHydrationWarning>
        <Analytics />

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
