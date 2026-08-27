const CLOUDINARY_HOST = "res.cloudinary.com";
const UPLOAD_SEGMENT = "/image/upload/";

type CldOptions = {
  /** Ancho máximo en px del archivo que se descarga (c_limit: nunca agranda) */
  width?: number;
  /** q_auto por defecto; usar "auto:eco" para grillas, "auto:good" para el detalle */
  quality?: string;
};

/**
 * Inyecta transformaciones de Cloudinary en una URL de entrega.
 *
 * f_auto  -> sirve AVIF/WebP según el navegador (en vez del JPG original)
 * q_auto  -> comprime según el contenido de la imagen
 * c_limit -> redimensiona sólo si la original es más grande que `width`
 *
 * Es idempotente: si la URL ya trae transformaciones no las duplica.
 * Si no es una URL de Cloudinary (ej: "/img/image-icon.webp") la devuelve intacta.
 */
export function cldUrl(src: string, { width, quality = "auto" }: CldOptions = {}): string {
  if (!src || !src.includes(CLOUDINARY_HOST) || !src.includes(UPLOAD_SEGMENT)) return src;

  const [prefix, rest] = src.split(UPLOAD_SEGMENT);

  // Si ya hay un bloque de transformaciones (no empieza con la versión ni con el public_id)
  if (/^[a-z]{1,3}_[^/]*\//.test(rest)) return src;

  const transforms = ["f_auto", `q_${quality}`];
  if (width) transforms.push("c_limit", `w_${width}`);

  return `${prefix}${UPLOAD_SEGMENT}${transforms.join(",")}/${rest}`;
}

/**
 * srcset para pantallas 1x/2x. El navegador baja una sola de las dos variantes.
 */
export function cldSrcSet(src: string, width: number, quality?: string): string | undefined {
  if (!src.includes(CLOUDINARY_HOST)) return undefined;

  return [
    `${cldUrl(src, { width, quality })} 1x`,
    `${cldUrl(src, { width: width * 2, quality })} 2x`,
  ].join(", ");
}

/**
 * Loader para <Image> de next/image: evita pasar por /_next/image
 * (Cloudinary ya es un CDN con transformaciones y cache inmutable).
 */
export function cloudinaryLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  if (!src.includes(CLOUDINARY_HOST)) return src;
  return cldUrl(src, { width, quality: quality ? String(quality) : "auto" });
}
