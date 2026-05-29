import { Producto } from './products.model';

// Respuesta al eliminar un producto
export interface DeleteResponse {
  message: string;
}

// Respuesta base
interface ImagenBaseResponse {
  message: string;
  producto: Producto;
}

// Respuesta al subir imágenes del producto
export interface ImagenesProductoResponse extends ImagenBaseResponse {
  imagenesNuevas: string[];
}

// Respuesta al subir imagen de variante
export interface ImagenVarianteResponse extends ImagenBaseResponse {
  imageUrl: string;
}

// Respuesta al eliminar imagen (producto o variante)
export interface DeleteImagenResponse extends ImagenBaseResponse {}


// Respuesta del precio final
export interface PrecioFinalResponse {
  producto: string;
  precioBase: number;
  descuento: number;
  precioFinal: number;
}
