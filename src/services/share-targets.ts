import type { ShareTargetType } from "@/types";

export const EMPTY_SHARE_TARGETS: ShareTargetType[] = [];

/**
 * GET - Destinatarios predeterminados para compartir productos.
 *
 * Se consume desde el navegador (el endpoint valida la sesion con la cookie que el fetch envia por ser same-origin), asi los numeros nunca entran al bundle publico.
 */
export async function fetchShareTargets(): Promise<ShareTargetType[]> {
  try {
    const response = await fetch("/api/share-targets");

    if (!response.ok) return EMPTY_SHARE_TARGETS;

    const data: unknown = await response.json();
    const shareTargets = (data as { shareTargets?: unknown })?.shareTargets;

    return Array.isArray(shareTargets) ? (shareTargets as ShareTargetType[]) : EMPTY_SHARE_TARGETS;
  } catch (error) {
    console.error("[fetchShareTargets]", error);
    return EMPTY_SHARE_TARGETS;
  }
}