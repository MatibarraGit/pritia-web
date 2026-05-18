import { create } from 'zustand';
import { getProductById } from '@/services';

interface ProductImage {
  img_url?: string;
  img_alt?: string;
  file?: File;
}

interface ProductDataState {
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
  updatedAt: string;
}

interface ProductDataActions {
  productData: ProductDataState;
  isProductLoading: boolean;
  setIsProductLoading: (isLoading: boolean) => void;
  handleChange: (type: string, value: unknown) => void;
  handleDeleteImage: (index: number) => void;
  loadProductById: (id: number) => Promise<void>;
  resetProductData: () => void;
}

export const productDataContext = create<ProductDataActions>((set) => ({
  productData: {
    id: null,
    initialImages: [],
    images: [],
    name: "",
    provider: "",
    purchasePrice: 0,
    price: 0,
    resellersPrice: 0,
    discountPercent: 0,
    category: "",
    subcategory: "",
    inStock: "",
    stock: 0,
    description: "",
    slug: "",
    updatedAt: "",
  },

  // ESTADO DE CARGA DEL PRODUCTO
  isProductLoading: false,
  setIsProductLoading: (isLoading: boolean) => set({ isProductLoading: isLoading }),

  // ASIGNAR VALORES A 'productData'
  handleChange: (type, value) => set((state) => {
    switch (true) {
      // Manejar cambios en las imágenes
      case type === "images":
        const files = Array.isArray(value) ? value : [value];
        const newImages = files.map((v: File) => ({
          img_url: URL.createObjectURL(v),
          img_alt: v.name,
          file: v,
        }));
        return {
          productData: {
            ...state.productData,
            images: [...state.productData.images, ...newImages],
          }
        };

      // Manejo de otros campos
      default:
        return {
          productData: {
            ...state.productData,
            [type]: value,
          }
        };
    }
  }),

  // ELIMINAR IMÁGENES DE 'productData'
  handleDeleteImage: (index) => set((state) => {
    return {
      productData: {
        ...state.productData,
        images: state.productData.images.filter((_, i) => i !== index),
      }
    };
  }),

  // Función para cargar un producto por id
  loadProductById: async (id) => {
    set({ isProductLoading: true });
    try {
      const product = await getProductById(id);
      
      if (!product || !product.id) {
        console.error('Producto no encontrado o inválido');
        return;
      }

      // Convertir updatedAt a formato datetime-local si existe
      let updatedAtValue = "";
      if (product.updatedAt) {
        const date = new Date(product.updatedAt);
        if (!isNaN(date.getTime())) {
          // Formato: YYYY-MM-DDTHH:mm (datetime-local)
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
          updatedAtValue = `${year}-${month}-${day}T${hours}:${minutes}`;
        }
      }

      set({
        productData: {
          id: product.id,
          initialImages: product.images,
          images: product.images,
          name: product.name,
          provider: product.providers?.[0] || "", 
          purchasePrice: product.purchasePrice,
          price: product.originalPrice || product.price,
          resellersPrice: product.resellersPrice || 0,
          discountPercent: product.discountPercent,
          category: product.category,
          subcategory: product.subcategory,
          inStock: product.inStock === true ? "Disponible" : "Agotado",
          stock: product.stock,
          description: product.description || "",
          slug: product.slug,
          updatedAt: updatedAtValue
        }
      });
    } catch (error) {
      console.error('Error al cargar producto:', error);
    } finally {
      set({ isProductLoading: false });
    }
  },

  resetProductData: () => set({
    productData: {
      id: null,
      initialImages: [],
      images: [],
      name: "",
      provider: "",
      price: 0,
      purchasePrice: 0,
      resellersPrice: 0,
      discountPercent: 0,
      category: "",
      subcategory: "",
      inStock: "",
      stock: 0,
      description: "",
      slug: "",
      updatedAt: "",
    }
  }),
}));




