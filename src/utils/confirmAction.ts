import { toastContext } from "@/contexts";
import { ActionResponse } from "@/types";

interface ConfirmActionParams<T, TArgs = unknown> {
  productToAction: T | null;
  handleProductAction: (args: TArgs) => Promise<ActionResponse>;
  args: TArgs;
  close: () => void;
}

export async function confirmAction<T, TArgs = unknown>({ 
  productToAction, 
  handleProductAction, 
  args, 
  close 
}: ConfirmActionParams<T, TArgs>): Promise<ActionResponse> {
  const { showToast } = toastContext.getState();
  
  if (productToAction) {
    const result = await handleProductAction(args);

    if (result.errorMessage) {
      showToast(result?.errorMessage || "No se pudo eliminar el producto", "error");
      close();
      return { errorMessage: result.errorMessage };
    }
    
    showToast(`Producto eliminado`, "success");
    close();
    return { successMessage: result.successMessage };
  } else {
    showToast("No se encontró el producto", "error");
    close();
    return { errorMessage: "No se encontró el producto" };
  }
}

