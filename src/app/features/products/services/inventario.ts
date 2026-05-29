import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

// RxJs
import { catchError, Observable, tap, throwError } from 'rxjs';

// Models
import {
  Categoria,
  EstadoProducto,
  Variante,
  Producto
} from '../models/products.model';
import {
  DeleteImagenResponse,
  DeleteResponse,
  ImagenesProductoResponse,
  ImagenVarianteResponse,
  PrecioFinalResponse
} from '../models/api-responses.model';

// Environment
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InventarioService {
  // Inyecciones
  private http = inject(HttpClient);

  // Propiedades
  private API_URL = environment.apiUrl;


  // TODO: Métodos

  // Obtener todos los productos
  obtenerProductos(): Observable<Producto[]> {

    return this.http.get<Producto[]>(`${this.API_URL}/products`).pipe(

      tap( productos => console.log(`${productos.length} productos cargados`) ),

      catchError( ( error: HttpErrorResponse ) => {
        const mensaje = error.error?.error ?? 'Error desconocido';
        console.error(`[${error.status}]`, mensaje);

        return throwError(() => new Error(mensaje));
      })

    );
  }

  // Obtener producto por ID
  obtenerPorId ( id: string ): Observable<Producto> {

    return this.http.get<Producto>(`${this.API_URL}/products/${id}`).pipe(

      tap( producto => console.log(`Producto cargado con id ${producto.id}`) ),

      catchError( ( error: HttpErrorResponse ) => {
        const mensaje = error.error?.error ?? 'Error desconocido';
        console.error(`[${error.status}]`, mensaje);

        return throwError(() => new Error(mensaje));
      })

    );
  }

  // Obtener los productos por categoria
  obtenerPorCategoria ( categoria: Categoria ): Observable<Producto[]> {

    const params = new HttpParams().set('categoria', categoria);

    return this.http.get<Producto[]>(`${this.API_URL}/products`, { params }).pipe(

      catchError( ( error: HttpErrorResponse ) => {
        const mensaje = error.error?.error ?? 'Error desconocido';
        console.error(`[${error.status}]`, mensaje);

        return throwError(() => new Error(mensaje));
      })

    );
  }

  // Obtener los productos por estado
  obtenerPorEstado ( estado: EstadoProducto): Observable<Producto[]> {

    const params = new HttpParams().set('estado', estado);

    return this.http.get<Producto[]>(`${this.API_URL}/products`, { params }).pipe(

      catchError( ( error: HttpErrorResponse ) => {
        const mensaje = error.error?.error ?? 'Error desconocido';
        console.error(`[${error.status}]`, mensaje);

        return throwError(() => new Error(mensaje));
      })

    );
  }

  // Obtener productos por marca
  obtenerPorMarca ( marca: string ): Observable<Producto[]> {

    const params = new HttpParams().set('marca', marca);

    return this.http.get<Producto[]>(`${this.API_URL}/products`, { params }).pipe(

      catchError( ( error: HttpErrorResponse ) => {
        const mensaje = error.error?.error ?? 'Error desconocido';
        console.error(`[${error.status}]`, mensaje);

        return throwError(() => new Error(mensaje));
      })

    );
  }

  // Obtener productos por etiqueta
  obtenerPorEtiqueta ( etiqueta: string ): Observable<Producto[]> {

    const params = new HttpParams().set('etiqueta', etiqueta);

    return this.http.get<Producto[]>(`${this.API_URL}/products`, { params }).pipe(

      catchError( ( error: HttpErrorResponse ) => {
        const mensaje = error.error?.error ?? 'Error desconocido';
        console.error(`[${error.status}]`, mensaje);

        return throwError(() => new Error(mensaje));
      })

    );
  }

  // Buscar producto por nombre
  buscarPorNombre ( query: string ): Observable<Producto[]> {

    const params = new HttpParams().set('searchNombre', query);

    return this.http.get<Producto[]>(`${this.API_URL}/products`, { params }).pipe(

      catchError( ( error: HttpErrorResponse ) => {
        const mensaje = error.error?.error ?? 'Error desconocido';
        console.error(`[${error.status}]`, mensaje);

        return throwError(() => new Error(mensaje));
      })

    );
  }

  // Buscar producto por categoria
  buscarPorCategoria ( query: string ): Observable<Producto[]> {

    const params = new HttpParams().set('searchCategoria', query);

    return this.http.get<Producto[]>(`${this.API_URL}/products`, { params }).pipe(

      catchError( ( error: HttpErrorResponse ) => {
        const mensaje = error.error?.error ?? 'Error desconocido';
        console.error(`[${error.status}]`, mensaje);

        return throwError(() => new Error(mensaje));
      })

    );
  }

  // Obtener precio final con descuento
  obtenerPrecioFinal ( id: string ): Observable<PrecioFinalResponse> {

    return this.http.get<PrecioFinalResponse>(
      `${this.API_URL}/products/${id}/precio`
    ).pipe(

      catchError( ( error: HttpErrorResponse ) => {
        const mensaje = error.error?.error ?? 'Error desconocido';
        console.error(`[${error.status}]`, mensaje);

        return throwError(() => new Error(mensaje));
      })

    );
  }

  // Obtener precio final de variante con descuento
  obtenerVariantePrecioFinal ( productId: string, variantId: string ): Observable<PrecioFinalResponse> {

    const params = new HttpParams().set('varianteId', variantId);

    return this.http.get<PrecioFinalResponse>(
      `${this.API_URL}/products/${productId}/precio`, { params }
    ).pipe(

      catchError( ( error: HttpErrorResponse ) => {
        const mensaje = error.error?.error ?? 'Error desconocido';
        console.error(`[${error.status}]`, mensaje);

        return throwError(() => new Error(mensaje));
      })

    );
  }

  // Obtener variantes agotadas
  obtenerVariantesAgotadas ( id: string ): Observable<Variante[]> {

    return this.http.get<Variante[]>(
      `${this.API_URL}/products/${id}/variantes_agotadas`
    ).pipe(

      catchError( ( error: HttpErrorResponse ) => {
        const mensaje = error.error?.error ?? 'Error desconocido';
        console.error(`[${error.status}]`, mensaje);

        return throwError(() => new Error(mensaje));
      })

    );
  }

  // Obtener variantes con stock bajas
  obtenerVariantesBajas ( id: string ): Observable<Variante[]> {

    return this.http.get<Variante[]>(
      `${this.API_URL}/products/${id}/variantes_bajas`
    ).pipe(

      catchError( ( error: HttpErrorResponse ) => {
        const mensaje = error.error?.error ?? 'Error desconocido';
        console.error(`[${error.status}]`, mensaje);

        return throwError(() => new Error(mensaje));
      })

    );
  }

  // Crear productos
  crearProducto ( producto: Omit<Producto, 'id' | 'creadoEn' | 'actualizadoEn'> ): Observable<Producto> {

    return this.http.post<Producto>(`${this.API_URL}/products`, producto).pipe(

      catchError( ( error: HttpErrorResponse ) => {
        const mensaje = error.error?.error ?? 'Error desconocido';
        console.error(`[${error.status}]`, mensaje);

        return throwError(() => new Error(mensaje));
      })

    );
  }

  // Actualizar producto
  actualizarProducto (
    id: string,
    producto: Partial<Omit<Producto, 'id' | 'creadoEn' | 'actualizadoEn'>>
  ): Observable<Producto> {

    const url = `${this.API_URL}/products/${id}`;

    return this.http.patch<Producto>(url, producto).pipe(

      catchError( ( error: HttpErrorResponse ) => {
        const mensaje = error.error?.error ?? 'Error desconocido';
        console.error(`[${error.status}]`, mensaje);

        return throwError(() => new Error(mensaje));
      })

    );
  }

  // Eliminar producto
  eliminarProducto ( id: string ): Observable<DeleteResponse> {

    const url = `${this.API_URL}/products/${id}`;

    return this.http.delete<DeleteResponse>(url).pipe(

      catchError( ( error: HttpErrorResponse ) => {
        const mensaje = error.error?.error ?? 'Error desconocido';
        console.error(`[${error.status}]`, mensaje);

        return throwError(() => new Error(mensaje));
      })

    );
  }

  // Crear variantes
  crearVariante (
    productId: string,
    variante: Omit<Variante, 'id'>
  ): Observable<Producto> {

    return this.http.post<Producto>(
      `${this.API_URL}/products/${productId}/variantes`, variante
    ).pipe(

      catchError( ( error: HttpErrorResponse ) => {
        const mensaje = error.error?.error ?? 'Error desconocido';
        console.error(`[${error.status}]`, mensaje);

        return throwError(() => new Error(mensaje));
      })

    );
  }

  // Actualizar variante
  actualizarVariante (
    productId: string,
    variantId: string,
    variante: Partial<Omit<Variante, 'id'>>
  ): Observable<Producto> {

    const url = `${this.API_URL}/products/${productId}/variantes/${variantId}`;

    return this.http.patch<Producto>(url, variante).pipe(

      catchError( ( error: HttpErrorResponse ) => {
        const mensaje = error.error?.error ?? 'Error desconocido';
        console.error(`[${error.status}]`, mensaje);

        return throwError(() => new Error(mensaje));
      })

    );
  }

  // Eliminar variante
  eliminarVariante ( productId: string, varianteId: string ): Observable<Producto> {

    const url = `${this.API_URL}/products/${productId}/variantes/${varianteId}`;

    return this.http.delete<Producto>(url).pipe(

      catchError( ( error: HttpErrorResponse ) => {
        const mensaje = error.error?.error ?? 'Error desconocido';
        console.error(`[${error.status}]`, mensaje);

        return throwError(() => new Error(mensaje));
      })

    );
  }

  // Subir imagenes del producto
  subirImagenesProducto ( id: string, imagen: FormData ): Observable<ImagenesProductoResponse> {

    return this.http.post<ImagenesProductoResponse>(
      `${this.API_URL}/products/${id}/imagenes`, imagen
    ).pipe(

      catchError( ( error: HttpErrorResponse ) => {
        const mensaje = error.error?.error ?? 'Error desconocido';
        console.error(`[${error.status}]`, mensaje);

        return throwError(() => new Error(mensaje));
      })

    );
  }

  // Eliminar imagen del producto
  eliminarImagenProducto ( id: string, imagen: string ): Observable<DeleteImagenResponse> {

    const params = new HttpParams().set('url', imagen);

    return this.http.delete<DeleteImagenResponse>(
      `${this.API_URL}/products/${id}/imagenes`, { params }
    ).pipe(

      catchError( ( error: HttpErrorResponse ) => {
        const mensaje = error.error?.error ?? 'Error desconocido';
        console.error(`[${error.status}]`, mensaje);

        return throwError(() => new Error(mensaje));
      })

    );
  }

  // Subir y cambiar la imagen de la variante
  subirImagenVariante ( productId: string, variantId: string, imagen: FormData ): Observable<ImagenVarianteResponse> {

    return this.http.post<ImagenVarianteResponse>(
      `${this.API_URL}/products/${productId}/variantes/${variantId}/imagen`,
      imagen
    ).pipe(

      catchError( ( error: HttpErrorResponse ) => {
        const mensaje = error.error?.error ?? 'Error desconocido';
        console.error(`[${error.status}]`, mensaje);

        return throwError(() => new Error(mensaje));
      })

    );
  }

  // Eliminar la imagen de la variante
  eliminarImagenVariante ( productId: string, variantId: string ): Observable<DeleteImagenResponse> {

    return this.http.delete<DeleteImagenResponse>(
      `${this.API_URL}/products/${productId}/variantes/${variantId}/imagen`
    ).pipe(

      catchError( ( error: HttpErrorResponse ) => {
        const mensaje = error.error?.error ?? 'Error desconocido';
        console.error(`[${error.status}]`, mensaje);

        return throwError(() => new Error(mensaje));
      })

    );
  }
}
