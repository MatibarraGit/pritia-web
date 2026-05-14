import ProductsPage from "./productsPage";

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ seccion?: string }> }) {
  const params = await searchParams;
  const section = params.seccion;
  let title = '';

  if (!!section) {
    title = section;
  } else {
    title = 'Todos los productos';
  }

  const titleDecoded = title.charAt(0).toUpperCase() + title.slice(1);

  return { 
    title: titleDecoded,
    description: ""

  };
}

export default function ProductsPageForMetadata() {
  return <ProductsPage />;
}

