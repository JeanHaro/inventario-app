import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

// RxJs
import { catchError, delay, Observable, tap, throwError } from 'rxjs';

// Models
import {
  Category,
  ProductState,
  Variant,
  Product
} from '../models/products.model';
import {
  DeleteImageResponse,
  DeleteResponse,
  ProductImagesResponse,
  VariantImageResponse,
  FinalPriceResponse
} from '../models/api-responses.model';

// Environment
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InventarioService {
  // TODO: INYECCIONES
  private http = inject(HttpClient);

  // TODO: PROPIEDADES
  private apiUrl = environment.apiUrl;

  // TODO: MÉTODOS PRIVADOS

  // Errors
  private handleError = ( error: HttpErrorResponse ) => {
    const mensaje = error.error?.error ?? 'Error desconocido';
    console.error(`[${error.status}]`, mensaje);
    return throwError(() => new Error(mensaje));
  }

  // TODO: MÉTODOS PÚBLICOS

  // Obtener todos los productos
  getProducts(): Observable<Product[]> {

    return this.http.get<Product[]>(`${this.apiUrl}/products`).pipe(
      delay(1500),
      tap( productos => console.log(`${productos.length} productos cargados`) ),

      catchError( this.handleError )

    );
  }

  // Obtener producto por ID
  getById ( id: string ): Observable<Product> {

    return this.http.get<Product>(`${this.apiUrl}/products/${id}`).pipe(

      tap( producto => console.log(`Producto cargado con id ${producto.id}`) ),

      catchError( this.handleError )

    );
  }

  // Obtener los productos por categoria
  getByCategory ( categoria: Category ): Observable<Product[]> {

    const params = new HttpParams().set('categoria', categoria);

    return this.http.get<Product[]>(`${this.apiUrl}/products`, { params }).pipe(

      catchError( this.handleError )

    );
  }

  // Obtener los productos por estado
  getByState ( estado: ProductState ): Observable<Product[]> {

    const params = new HttpParams().set('estado', estado);

    return this.http.get<Product[]>(`${this.apiUrl}/products`, { params }).pipe(

      catchError( this.handleError )

    );
  }

  // Obtener productos por marca
  getByBrand ( marca: string ): Observable<Product[]> {

    const params = new HttpParams().set('marca', marca);

    return this.http.get<Product[]>(`${this.apiUrl}/products`, { params }).pipe(

      catchError( this.handleError )

    );
  }

  // Obtener productos por etiqueta
  getByTag ( etiqueta: string ): Observable<Product[]> {

    const params = new HttpParams().set('etiqueta', etiqueta);

    return this.http.get<Product[]>(`${this.apiUrl}/products`, { params }).pipe(

      catchError( this.handleError )

    );
  }

  // Buscar producto por nombre
  searchByName ( query: string ): Observable<Product[]> {

    const params = new HttpParams().set('searchNombre', query);

    return this.http.get<Product[]>(`${this.apiUrl}/products`, { params }).pipe(

      catchError( this.handleError )

    );
  }

  // Buscar producto por categoria
  searchByCategory ( query: string ): Observable<Product[]> {

    const params = new HttpParams().set('searchCategoria', query);

    return this.http.get<Product[]>(`${this.apiUrl}/products`, { params }).pipe(

      catchError( this.handleError )

    );
  }

  // Obtener precio final con descuento
  getFinalPrice ( id: string ): Observable<FinalPriceResponse> {

    return this.http.get<FinalPriceResponse>(
      `${this.apiUrl}/products/${id}/precio`
    ).pipe(

      catchError( this.handleError )

    );
  }

  // Obtener precio final de variante con descuento
  getVariantFinalPrice ( productId: string, variantId: string ): Observable<FinalPriceResponse> {

    const params = new HttpParams().set('varianteId', variantId);

    return this.http.get<FinalPriceResponse>(
      `${this.apiUrl}/products/${productId}/precio`, { params }
    ).pipe(

      catchError( this.handleError )

    );
  }

  // Obtener variantes agotadas
  getOutOfStockVariants ( id: string ): Observable<Variant[]> {

    return this.http.get<Variant[]>(
      `${this.apiUrl}/products/${id}/variantes_agotadas`
    ).pipe(

      catchError( this.handleError )

    );
  }

  // Obtener variantes con stock bajas
  getLowStockVariants ( id: string ): Observable<Variant[]> {

    return this.http.get<Variant[]>(
      `${this.apiUrl}/products/${id}/variantes_bajas`
    ).pipe(

      catchError( this.handleError )

    );
  }

  // Crear productos
  createProduct ( producto: Omit<Product, 'id' | 'creadoEn' | 'actualizadoEn'> ): Observable<Product> {

    return this.http.post<Product>(`${this.apiUrl}/products`, producto).pipe(
      delay(1000), // Para el overlay
      catchError( this.handleError )

    );
  }

  // Actualizar producto
  updateProduct (
    id: string,
    producto: Partial<Omit<Product, 'id' | 'creadoEn' | 'actualizadoEn'>>
  ): Observable<Product> {

    const url = `${this.apiUrl}/products/${id}`;

    return this.http.patch<Product>(url, producto).pipe(
      delay(1000), // para el overlay
      catchError( this.handleError )

    );
  }

  // Eliminar producto
  deleteProduct ( id: string ): Observable<DeleteResponse> {

    const url = `${this.apiUrl}/products/${id}`;

    return this.http.delete<DeleteResponse>(url).pipe(
      delay(1000), // Para el overlay
      catchError( this.handleError )

    );
  }

  // Crear variantes
  createVariant (
    productId: string,
    variante: FormData
  ): Observable<Product> {

    return this.http.post<Product>(
      `${this.apiUrl}/products/${productId}/variantes`, variante
    ).pipe(
      delay(1000), // Para el overlay
      catchError( this.handleError )

    );
  }

  // Actualizar variante
  updateVariant (
    productId: string,
    variantId: string,
    variante: Partial<Omit<Variant, 'id'>>
  ): Observable<Product> {

    const url = `${this.apiUrl}/products/${productId}/variantes/${variantId}`;

    return this.http.patch<Product>(url, variante).pipe(
      delay(1000), // Para el overlay
      catchError( this.handleError )

    );
  }

  // Eliminar variante
  deleteVariant ( productId: string, varianteId: string ): Observable<Product> {

    const url = `${this.apiUrl}/products/${productId}/variantes/${varianteId}`;

    return this.http.delete<Product>(url).pipe(

      catchError( this.handleError )

    );
  }

  // Subir imagenes del producto
  uploadProductImages ( id: string, imagen: FormData ): Observable<ProductImagesResponse> {

    return this.http.post<ProductImagesResponse>(
      `${this.apiUrl}/products/${id}/imagenes`, imagen
    ).pipe(
      delay(1000),
      catchError( this.handleError )

    );
  }

  // Eliminar imagen del producto
  deleteProductImage ( id: string, imagen: string ): Observable<DeleteImageResponse> {

    const params = new HttpParams().set('url', imagen);

    return this.http.delete<DeleteImageResponse>(
      `${this.apiUrl}/products/${id}/imagenes`, { params }
    ).pipe(

      catchError( this.handleError )

    );
  }

  // Subir y cambiar la imagen de la variante
  uploadVariantImage ( productId: string, variantId: string, imagen: FormData ): Observable<VariantImageResponse> {

    return this.http.post<VariantImageResponse>(
      `${this.apiUrl}/products/${productId}/variantes/${variantId}/imagen`,
      imagen
    ).pipe(
      delay(1000),
      catchError( this.handleError )

    );
  }

  // Eliminar la imagen de la variante
  deleteVariantImage ( productId: string, variantId: string ): Observable<DeleteImageResponse> {

    return this.http.delete<DeleteImageResponse>(
      `${this.apiUrl}/products/${productId}/variantes/${variantId}/imagen`
    ).pipe(

      catchError( this.handleError )

    );
  }
}
