import { NextResponse } from "next/server";

import { requireAuthenticatedSession } from "@/libs/auth-guards";
import type { ShareTargetType } from "@/types";

/**
 * Los destinatarios se configuran por entorno (variable TO_OPTIONS) en vez de
 * vivir en el código, para no versionar números de teléfono de terceros.
 *
 * Formato esperado:
 * TO_OPTIONS='[{"name":"Jhon Doe","number":549123456789,"type":"seller"}]'
 */
function parseShareTargets(rawValue: string | undefined): ShareTargetType[] {
  if (!rawValue) return []; 

  try {
    const parsed: unknown = JSON.parse(rawValue);

    if (!Array.isArray(parsed)) {
      console.error("[share-targets] TO_OPTIONS debe ser un array JSON");
      return [];
    }

    return parsed.filter((target): target is ShareTargetType => {
      if (!target || typeof target !== "object") return false;

      const { name, number, type } = target as Record<string, unknown>;

      return (
        typeof name === "string" &&
        name.trim() !== "" &&
        typeof number === "number" &&
        Number.isFinite(number) &&
        number > 0 &&
        (type === "seller" || type === "reseller")
      );
    });
  } catch {
    console.error("[share-targets] TO_OPTIONS no es un JSON valido");
    return [];
  }
}

/**
 * El proxy deja pasar todos los GET de /api sin sesion, asi que este handler
 * valida la sesion por su cuenta: los destinatarios no son datos publicos.
 */
export async function GET() {
  const authResult = await requireAuthenticatedSession();

  if (!authResult.success) {
    return authResult.response;
  }

  return NextResponse.json(
    { shareTargets: parseShareTargets(process.env.TO_OPTIONS) },
    {
      headers: {
        "Cache-Control": "private, max-age=3600, stale-while-revalidate=86400",
      },
    }
  );
}
