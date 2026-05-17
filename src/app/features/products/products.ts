import { Component, OnInit, signal } from '@angular/core';

// Font Awesome
import {
  IconDefinition,
  faTableCellsLarge,
  faBan,
  faMagnifyingGlass,
  faPlus,
  faCheck,
  faArrowUpShortWide,
  faPenToSquare,
  faLayerGroup,
  faChevronDown,
  faEllipsisVertical,
  faBoxArchive,
  faBoxesStacked,
  faClockRotateLeft,
  faBarcode,
  faXmark,
  faFloppyDisk,
} from '@fortawesome/free-solid-svg-icons';

import {
  faCheckCircle,
  faCircleXmark,
  faBookmark,
  faCalendarDays,
  faCirclePause,
  faEye
} from '@fortawesome/free-regular-svg-icons';

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
  // Iconos
  readonly faTableCellsLarge: IconDefinition = faTableCellsLarge;
  readonly faCheckCircle: IconDefinition = faCheckCircle;
  readonly faCircleXmark: IconDefinition = faCircleXmark;
  readonly faBookmark: IconDefinition = faBookmark;
  readonly faCalendarDays: IconDefinition = faCalendarDays;
  readonly faBan: IconDefinition = faBan;
  readonly faCirclePause: IconDefinition = faCirclePause;
  readonly faPlus: IconDefinition = faPlus;
  readonly faMagnifyingGlass: IconDefinition = faMagnifyingGlass;
  readonly faCheck: IconDefinition = faCheck;
  readonly faArrowUpShortWide: IconDefinition = faArrowUpShortWide;
  readonly faChevronDown: IconDefinition = faChevronDown;
  readonly faPenToSquare: IconDefinition = faPenToSquare;
  readonly faLayerGroup: IconDefinition = faLayerGroup;
  readonly faEllipsisVertical: IconDefinition = faEllipsisVertical;
  readonly faEye: IconDefinition = faEye;
  readonly faBoxArchive:IconDefinition = faBoxArchive;
  readonly faBoxesStacked: IconDefinition = faBoxesStacked;
  readonly faClockRotateLeft: IconDefinition = faClockRotateLeft;
  readonly faBarcode: IconDefinition = faBarcode;
  readonly faXmark: IconDefinition = faXmark;
  readonly faFloppyDisk: IconDefinition = faFloppyDisk;

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
