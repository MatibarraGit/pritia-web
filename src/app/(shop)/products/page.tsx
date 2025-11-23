import ProductsPage from "./productsPage";

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ topic?: string; category?: string }> }) {
  const params = await searchParams;
  const topic = params.topic;
  const category = params.category;
  let title = '';

  if (!!topic) {
    title = decodeURIComponent(topic);
  } else if (!!category) {
    title = decodeURIComponent(category);
  } else {
    title = 'Todos los productos';
  }

  const titleDecoded = title.charAt(0).toUpperCase() + title.slice(1);

  return { title: titleDecoded };
}

export default function ProductsPageForMetadata() {
  return <ProductsPage />;
}

