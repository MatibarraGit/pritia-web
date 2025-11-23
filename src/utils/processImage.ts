export async function convertImageToBuffer(file: File): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function getPublicIdFromUrl(secureUrl: string): Promise<string | null> {
  try {
    const url = new URL(secureUrl);
    const parts = url.pathname.split("/");

    // Buscamos la parte después de "upload/"
    const uploadIndex = parts.indexOf("upload");
    const afterUpload = parts.slice(uploadIndex + 1).join("/");

    // Sacamos la versión (ej: v1759509512)
    const withoutVersion = afterUpload.replace(/^v[0-9]+\/+/, "");

    // Decodificamos (esto convierte %20 → " ")
    const decoded = decodeURIComponent(withoutVersion);

    // Quitamos extensión (.jpg, .png, etc.)
    const publicId = decoded.replace(/\.[^/.]+$/, "");

    return publicId;
  } catch (err) {
    console.error("URL inválida:", err);
    return null;
  }
}

