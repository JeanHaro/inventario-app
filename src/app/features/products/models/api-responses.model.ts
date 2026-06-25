import { Product } from './products.model';

// Respuesta al eliminar un producto
export interface DeleteResponse {
  message: string;
}

// Respuesta base
interface ImageBaseResponse {
  message: string;
  producto: Product;
}

// Respuesta al subir imágenes del producto
export interface ProductImagesResponse extends ImageBaseResponse {
  imagenesNuevas: string[];
}

// Respuesta al subir imagen de variante
export interface VariantImageResponse extends ImageBaseResponse {
  imageUrl: string;
}

// Respuesta al eliminar imagen (producto o variante)
export interface DeleteImageResponse extends ImageBaseResponse {}


// Respuesta del precio final
export interface FinalPriceResponse {
  producto: string;
  precioBase: number;
  descuento: number;
  precioFinal: number;
}
