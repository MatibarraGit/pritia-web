export function normalizeText(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD") // Separa los acentos del carácter base
    .replace(/[\u0300-\u036f]/g, "") // Elimina los tildes diacríticos	
}

