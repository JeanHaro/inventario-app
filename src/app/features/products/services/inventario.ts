import { Injectable } from '@angular/core';

// Models
import {
  Categoria,
  EstadoProducto,
  Variante,
  Producto
} from '../models/products.model';

@Injectable({
  providedIn: 'root',
})
export class InventarioService {
  // Propiedades
  private productos: Producto[] = [
    {
      id: 1,
      nombre: 'iPhone 15',
      precio: 3500,
      categoria: 'electronica',
      estado: 'disponible',
      variantes: [
        {
          id: 1,
          nombre: 'N/A',
          color: 'Negro',
          stock: 10,
          estado: 'disponible',
        },
        {
          id: 2,
          nombre: 'N/A',
          color: 'Blanco',
          stock: 5,
          estado: 'disponible',
        }
      ],
      descripcion: 'Smartphone Apple última generación',
      creadoEn: new Date().toISOString(),
      actualizadoEn: new Date().toISOString()
    },
    {
      id: 2,
      nombre: 'Pollo a la Brasa',
      precio: 50,
      categoria: 'alimentos',
      estado: 'descontinuado',
      variantes: [
        {
          id: 1,
          nombre: '1/4 de pollo',
          color: 'N/A',
          stock: 16,
          estado: 'descontinuada'
        },
        {
          id: 2,
          nombre: '1/2 de pollo',
          color: 'N/A',
          stock: 8,
          estado: 'descontinuada'
        }

      ],
      descripcion: 'Pollo a la brasa al mejor precio',
      creadoEn: new Date().toISOString(),
      actualizadoEn: new Date().toISOString()
    },
    {
      id: 3,
      nombre: 'Polera a rayas',
      precio: 45,
      categoria: 'ropa',
      estado: 'agotado',
      variantes: [
        {
          id: 1,
          talla: 'M',
          color: 'Rojo',
          stock: 0,
          estado: 'sin_stock'
        },
        {
          id: 2,
          talla: 'L',
          color: 'Verde',
          stock: 0,
          estado: 'sin_stock'
        }
      ],
      descripcion: 'Hecha a la medida y con puro algodón',
      creadoEn: new Date().toISOString(),
      actualizadoEn: new Date().toISOString()
    },
    {
      id: 4,
      nombre: 'Espejo para baño',
      precio: 10,
      categoria: 'hogar',
      estado: 'disponible',
      variantes: [
        {
          id: 1,
          nombre: 'Grande',
          color: 'Negra',
          stock: 15,
          estado: 'disponible'
        },
        {
          id: 2,
          nombre: 'Mediana',
          color: 'Blanca',
          stock: 20,
          estado: 'disponible'
        }
      ],
      descripcion: 'Espejo resistente al agua para baño',
      creadoEn: new Date().toISOString(),
      actualizadoEn: new Date().toISOString()
    }
  ];

  // Métodos
  obtenerProductos(): Producto[] {
      return this.productos;
  }

  obtenerPorCategoria ( categoria: Categoria ): Producto[] {
    return this.productos.filter( producto => producto.categoria === categoria);
  }

  agregarProducto ( producto: Producto ): void {
    this.productos.push(producto);
  }

  eliminarProducto (id: number): void {
    const index = this.productos.findIndex( producto => producto.id === id);

    if (index === -1) throw new Error(`Producto con ID ${id} no encontrado`);

    this.productos.splice(index, 1);
  }

  cambiarEstado ( id: number, estado: EstadoProducto ): void {
    const producto = this.productos.find( producto => producto.id === id);

    if (!producto) throw new Error(`Producto con ID ${id} no encontrado`);

    producto.estado = estado;
  }
}
