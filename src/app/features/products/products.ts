import {
  Component,
  computed,
  inject,
  OnInit,
  signal
} from '@angular/core';

// Font Awesome
import {
  IconDefinition,
  faBoxArchive,
  faXmark,
  faClockRotateLeft,
  faBarcode,
  faFloppyDisk
} from '@fortawesome/free-solid-svg-icons';

import {
  faEye
} from '@fortawesome/free-regular-svg-icons';

// Modelos
import {
  EstadoProducto,
  Producto,
  VariantePanel
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

  // Inyecciones
  private inventarioService = inject(InventarioService);

  // TODO: Iconos
  readonly faEye: IconDefinition = faEye;
  readonly faBoxArchive: IconDefinition = faBoxArchive;
  readonly faXmark: IconDefinition = faXmark;
  readonly faClockRotateLeft: IconDefinition = faClockRotateLeft;
  readonly faBarcode: IconDefinition = faBarcode;
  readonly faFloppyDisk: IconDefinition = faFloppyDisk;

  // TODO: Propiedades
  productos = signal<Producto[]>([]);
  productosSeleccionados = signal<Set<number>>(new Set());
  estadoSeleccionado = signal<EstadoProducto | 'Todas'>('Todas');
  variantePanel  = signal<VariantePanel | null>(null);

  ngOnInit(): void {
    this.inventarioService.obtenerProductos().subscribe({
      next: ( resp ) => {
        this.productos.set(resp);
      },
    });
  }

  // TODO: COMPUTED
  // Filtrar los productos por estado
  readonly productosPorEstado = computed<Producto[]>(() => {
    if ( this.estadoSeleccionado() === 'Todas' ) return this.productos();

    return this.productos().filter(
      producto => producto.estado === this.estadoSeleccionado()
    );
  });

  // Obtener la cantidad de todos los productos seleccionados
  readonly totalSeleccionados = computed<number>(() => {
    return this.productosSeleccionados().size;
  });

  // Obtener los productos seleccionados para archivar
  readonly productosParaArchivar = computed<Producto[]>(() => {
    return this.productos().filter(
      producto => this.productosSeleccionados().has(producto.id)
    );
  });

  // TODO: MÉTODOS
  // Seleccionar todas
  seleccionarTodas(): void {
    const seleccionados = new Set( this.productosSeleccionados() );

    if ( this.totalSeleccionados() === this.productosPorEstado().length ) {
      return this.limpiarSeleccion();
    }

    this.productosPorEstado().forEach( product => seleccionados.add(product.id) );
    this.productosSeleccionados.set(seleccionados);
  }

  // Identificar si el producto esta seleccionado
  estaSeleccionado ( id: number ): boolean {
    return this.productosSeleccionados().has(id);
  }

  // Mostrar Kebab por producto
  toggleKebabProducto ( id: number ): void {
    // Si ese producto ya es el único seleccionado
    if ( this.totalSeleccionados() === 1 && this.estaSeleccionado(id) ) {
      return this.limpiarSeleccion();
    }

    // Limpiar y seleccionar solo ese producto
    this.productosSeleccionados.set( new Set([id]) );
  }

  // Añadir o sacar productos de la selección
  toggleSeleccion ( id: number ): void {
    const seleccionados = new Set( this.productosSeleccionados() );

    seleccionados.has(id) ? seleccionados.delete(id) : seleccionados.add(id);

    this.productosSeleccionados.set(seleccionados);
  }

  // Limpiar selecciones
  limpiarSeleccion(): void {
    this.productosSeleccionados.set( new Set() );
  }

  // Cambiar el valor del estado seleccionado
  estadoPorProducto ( estado: EstadoProducto | 'Todas' ): void {
    this.limpiarSeleccion();

    this.estadoSeleccionado.set(estado);
  }
}
