export function getFilterName(filter: string) {
  switch (filter) {
    case "provider":
      return "Proveedor";

    case "category":
      return "Categoría";

    case "inStock":
      return "Stock";

    case "orderStatus":
      return "Estado de Orden";

    case "paymentStatus":
      return "Estado de Pago";
      
    default:
      break;
  }
}