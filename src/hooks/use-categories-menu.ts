import { useRouter } from "next/navigation";

export const useCategoriesMenu = ({ closeMenuOnClick, closeMenu }: { closeMenuOnClick?: boolean, closeMenu: () => void }) => {
  const router = useRouter()

  function handleCategoryClick(categoryName: string, subcategoryName?: string) {
    if (closeMenuOnClick) {
      closeMenu();
    }

    if (!subcategoryName) router.push(`/products?category=${encodeURIComponent(categoryName)}`);
    else router.push(`/products?category=${encodeURIComponent(categoryName)}&subcategory=${encodeURIComponent(subcategoryName)}`);
  };
  
  return { handleCategoryClick }
}