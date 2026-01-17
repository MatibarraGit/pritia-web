import { Metadata } from "next";
import SearchPage from "./searchPage";

interface SearchPageParams {
  params: Promise<{
    search: string;
  }>;
}

export async function generateMetadata({ params }: SearchPageParams): Promise<Metadata> {
  const { search } = await params;
  const decodedSearch = decodeURIComponent(search);
  const title = decodedSearch.charAt(0).toUpperCase() + decodedSearch.slice(1).toLowerCase();

  return {
    title,
    description: `Resultados de búsqueda para: ${decodedSearch}`,
  };
}

export default async function SearchPageForMetadata({ params }: SearchPageParams) {
  const { search } = await params;
  const decodedSearch = decodeURIComponent(search);

  return <SearchPage search={decodedSearch} />;
}