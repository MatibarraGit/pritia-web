import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers"; 
import { auth } from "./libs/auth";

export async function proxy(req: NextRequest) {
  const { nextUrl } = req;
  const { pathname } = nextUrl;

  // Si no es una ruta protegida, continuar normalmente
  if (!pathname.startsWith("/admin") && !pathname.startsWith("/api") && !pathname.startsWith("/auth")) {
    return NextResponse.next();
  }

  // Si es una ruta API y el método es GET, continuar normalmente
  // Si es la petición para iniciar sesión, continuar normalmente
  if (
    (pathname.startsWith("/api") && req.method === "GET") ||
    (pathname === "/api/auth/sign-in/email" && req.method === "POST")
  ) {
    return NextResponse.next();
  }

  // Solo consultar sesión si la ruta la requiere
  const session = await auth.api.getSession({
    headers: await headers()
  })
  const isLoggedIn = !!session?.user && !!session?.session;

  // Si está autenticado y la ruta es /auth, redirigir al inicio
  if (!isLoggedIn && pathname.startsWith("/auth")) {
    return NextResponse.next();
  } else if (isLoggedIn && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/", nextUrl.origin));
  }

  if (!isLoggedIn) {
    // Manejar API no autenticada
    if (pathname.startsWith("/api")) {
      return NextResponse.json(
        { error: "No tenés autorización para acceder a esta API" },
        { status: 401 }
      );
    } else {
      // Manejar páginas no autenticadas
      const callBackURL = encodeURIComponent(nextUrl.pathname);
      return NextResponse.redirect(new URL(`/auth/sign-in?callbackUrl=${callBackURL}`, nextUrl.origin));
    }
  }

  // Si está autenticado, permitir acceso
  return NextResponse.next();
};

export const config = {
  // Regex sacada de la documentación de Clerk para que el middleware no esté pendiente de ciertos archivos que no lo necesitan
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(trpc)(.*)"],
};
