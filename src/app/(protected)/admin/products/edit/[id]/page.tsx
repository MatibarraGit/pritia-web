import NewProductPage from "../../new/page";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  return <NewProductPage id={parseInt(id)} />;
}