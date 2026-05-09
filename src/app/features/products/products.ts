import { Component, OnInit, signal } from '@angular/core';

// Modelos
import {
  EstadoProducto,
  Producto
} from './models/products.model';

// Servicios
import { InventarioService } from './services/inventario';

@Component({
  selector: 'app-products',
  standalone: false,
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products implements OnInit {
  // Propiedades
  productos: Producto[] = [];
  categoriaSeleccionada= signal<string>('Todas');

  mostrarFormulario: boolean = false;

  constructor (
    private inventarioService: InventarioService
  ) {}

  ngOnInit(): void {
    this.productos = this.inventarioService.obtenerProductos();
  }

  // Getters - productos filtrados según categoría seleccionada
  get productosFiltrados(): Producto[] {
    if (this.categoriaSeleccionada() === 'Todas') return this.productos;

    return this.productos.filter( p => p.categoria === this.categoriaSeleccionada() );
  }

  get totalDisponibles(): number {
    return this.productos.filter(p => p.estado === 'disponible').length;
  }

  get totalAgotados(): number {
    return this.productos.filter(p => p.estado === 'agotado').length;
  }

  // Métodos
  onEstadoChange ( id: number, event: Event ): void {
    const select = event.target as HTMLSelectElement;
    const estado = select.value as EstadoProducto;

    this.cambiarEstado(id, estado);
  }

  cambiarEstado ( id: number, estado: EstadoProducto ): void {
    this.inventarioService.cambiarEstado(id, estado);
  }

  eliminarProducto ( id: number ): void {
    this.inventarioService.eliminarProducto(id);
  }

  // TODO: Formulario
  toggleFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
  }

  // Recibe el producto del hijo y llama al servicio
  onProductoCreado ( producto: Producto ): void {
    this.inventarioService.agregarProducto(producto);
    this.toggleFormulario();
  }
}
