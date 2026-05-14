import { useRouter } from "next/navigation";
import { toSlug } from "@/utils";

export const useCategoriesMenu = ({ closeMenuOnClick, closeMenu }: { closeMenuOnClick?: boolean, closeMenu: () => void }) => {
  const router = useRouter()

  function handleCategoryClick(categoryName: string, subcategoryName?: string) {
    if (closeMenuOnClick) {
      closeMenu();
    }

    if (!subcategoryName) router.push(`/productos/${toSlug(categoryName)}`);
    else router.push(`/productos/${toSlug(categoryName)}/${toSlug(subcategoryName)}`);
  };
  
  return { handleCategoryClick }
}