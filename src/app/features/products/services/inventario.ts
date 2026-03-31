import { Injectable } from '@angular/core';

// Models
import {
  Categoria,
  EstadoProducto,
  Variante,
  Producto
} from '../features/products/products.model';

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
      categoria: Categoria.Electronica,
      estado: EstadoProducto.Disponible,
      disponible: true,
      variantes: [
        ['N/A', 'Negro', 10],
        ['N/A', 'Blanco', 5]
      ],
      descripcion: 'Smartphone Apple última generación'
    },
    {
      id: 2,
      nombre: 'Pollo a la Brasa',
      precio: 50,
      categoria: Categoria.Alimentos,
      estado: EstadoProducto.Descontinuado,
      disponible: false,
      variantes: [
        ['1/4 pollo', 'N/A', 16],
        ['1/2 pollo', 'N/A', 8]
      ],
      descripcion: 'Pollo a la brasa al mejor precio'
    },
    {
      id: 3,
      nombre: 'Polera a rayas',
      precio: 45,
      categoria: Categoria.Ropa,
      estado: EstadoProducto.Agotado,
      disponible: false,
      variantes: [
        ['M', 'Rojo', 0],
        ['L', 'Verde', 0]
      ],
      descripcion: 'Hecha a la medida y con puro algodón'
    },
    {
      id: 4,
      nombre: 'Espejo para baño',
      precio: 10,
      categoria: Categoria.Hogar,
      estado: EstadoProducto.Disponible,
      disponible: true,
      variantes: [
        ['Grande', 'Negra', 15],
        ['Mediana', 'Blanca', 20]
      ],
      descripcion: 'Espejo resistente al agua para baño'
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
    producto.disponible = (estado === EstadoProducto.Disponible);
  }
}
