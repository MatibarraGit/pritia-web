import { createProduct, updateProduct } from '@/services';
import type { Provider, CategoryType } from '@/types';

interface ProductImage {
  img_url?: string;
  img_alt?: string;
  file?: File;
}

interface ProductData {
  id: number | null;
  initialImages: string[];
  images: (string | ProductImage)[];
  name: string;
  provider: string;
  purchasePrice: number;
  price: number;
  resellersPrice: number;
  discountPercent: number;
  category: string;
  subcategory: string;
  inStock: string;
  stock: number;
  description: string;
  slug: string;
}

export async function handleSubmit(
  event: React.FormEvent<HTMLFormElement>,
  productData: ProductData,
  handleChange: (type: string, value: unknown) => void,
  selectedProvider: Provider[],
  selectedCategory: CategoryType[],
  selectedSubcategory: Array<{ id: number; name: string }>,
  setError: (error: string) => void,
  setMessage: (message: string) => void,
  open: () => void
) {
  event.preventDefault();
  const form = Object.fromEntries(new FormData(event.currentTarget));

  // Validaciones
  if (productData.images.length < 1) {
    setError('Debe haber al menos 1 imagen');
    open();
    return;
  } else if (selectedProvider.length === 0) {
    setError('Debes seleccionar un proveedor');
    open();
    return;
  } else if (productData.purchasePrice < 1000) {
    setError('Ingrese un precio de compra mayor que 1000');
    open();
    return;
  } else if (productData.price < 1000) {
    setError('Ingrese un precio mayor que 1000');
    open();
    return;
  } else if (productData.resellersPrice < 1000) {
    setError('Ingrese un precio para revendedores mayor que 1000');
    open();
    return;
  } else if (selectedCategory.length === 0) {
    setError('Debes seleccionar una categoría');
    open();
    return;
  } else if (selectedSubcategory.length === 0) {
    setError('Debes seleccionar una subcategoría');
    open();
    return;
  } else if (!productData.inStock) {
    setError('Indique la disponibilidad del producto');
    open();
    return;
  } else if (!productData.stock && !form.stock) {
    setError('Indique el stock en inventario del producto');
    open();
    return;
  }

  const formData = new FormData();

  // Adjuntar archivos reales bajo la misma clave 'images'
  for (const img of productData.images) {
    if (typeof img !== 'string' && img?.file) {
      // Usa el nombre como alt/file.name en el servidor
      formData.append('images', img.file, img.img_alt || img.file.name);
    } else if (typeof img === 'string' && img.startsWith('http')) {
      formData.append('images', img);
    }
  }

  // Adjuntar initialImages como JSON string
  if (productData.initialImages.length > 0) {
    productData.initialImages.forEach((img) => {
      formData.append('initialImages', img);
    });
  }

  formData.append('name', form.name as string);
  formData.append('provider', selectedProvider[0].provider_id.toString());
  formData.append('purchasePrice', form.purchasePrice as string);
  formData.append('price', form.price as string);
  formData.append('resellersPrice', form.resellersPrice as string);
  formData.append('discountPercent', form.discountPercent as string);
  formData.append('category', selectedCategory[0].category_id.toString());
  formData.append('subcategory', selectedSubcategory[0].id.toString());
  formData.append('inStock', productData.inStock);
  formData.append('stock', form.stock as string);
  formData.append('description', (form.description as string) || '');

  // Petición a la base de datos
  const result = productData?.slug && productData.id
    ? await updateProduct(productData.id, formData)
    : await createProduct(formData);

  if (!result?.successMessage) {
    setMessage('');
    setError(result?.errorMessage ?? 'Ocurrió un error al procesar el producto');
    open();
    return;
  } else {
    // Si todo sale bien
    setError('');
    if (result.slug) {
      handleChange('slug', result.slug);
    }
    setMessage(result.successMessage);
    open();
  }
}