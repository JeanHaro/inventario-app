import {
  Component,
  computed,
  inject,
  OnInit,
  signal
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';

// Rxjs
import { forkJoin, map, of } from 'rxjs';

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
  Variante,
  VariantePanel,
  VarianteRef
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

  // TODO: ICONOS
  readonly faEye: IconDefinition = faEye;
  readonly faBoxArchive: IconDefinition = faBoxArchive;
  readonly faXmark: IconDefinition = faXmark;
  readonly faClockRotateLeft: IconDefinition = faClockRotateLeft;
  readonly faBarcode: IconDefinition = faBarcode;
  readonly faFloppyDisk: IconDefinition = faFloppyDisk;

  // TODO: PROPIEDADES
  productos = signal<Producto[]>([]);
  variante = signal<Variante | null>(null);
  productosSeleccionados = signal<Set<number>>(new Set());
  estadoSeleccionado = signal<EstadoProducto | 'Todas'>('Todas');
  variantePanel  = signal<VariantePanel | null>(null);
  querySearch = signal<string>('');

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
    const query = this.querySearch();

    // Si hay busqueda activa, usar el resource
    if ( query ) {
      const resultados = this.productResource.value() ?? [];

      // Con esto retornamos solo los productos de cada estado
      if ( this.estadoSeleccionado() === 'Todas' ) return resultados;
      return resultados.filter( p => p.estado === this.estadoSeleccionado() );
    }

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

  // TODO: rxResource
  // Buscar producto
  productResource = rxResource({
    params: () => ({ query: this.querySearch() }),
    stream: ({ params }) => {
      // of - permite regresar un observable basado en lo que nosotros mandamos a invocar
      if ( !params.query ) return of([]);

      // Lo que hace forkJoin es que lanza las dos peticiones al mismo tiempo y cuando las dos responden te da los dos arrays juntos
      return forkJoin([
        this.inventarioService.obtenerPorMarca(params.query),
        this.inventarioService.obtenerPorEtiqueta(params.query),
        this.inventarioService.buscarPorNombre(params.query),
        this.inventarioService.buscarPorCategoria(params.query),
      ]).pipe(
        map( ([ porMarca, porEtiqueta, porNombre, porCategoria ]) => {
          // Unimos ambos resultados
          const todos = [
            ...porMarca,
            ...porEtiqueta,
            ...porNombre,
            ...porCategoria
          ];
          // Eliminamos productos duplicados por id, si un producto aparece en ambas búsquedas, esto lo hacemos con el new Map
          const unicos = new Map(todos.map( p => [ p.id, p ] ));

          return Array.from( unicos.values() );
        })
      );
    }
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

  // Obtener variante
  obtenerVariante ( ref: VarianteRef ): void {
    const producto = this.productos().find( p => p.id === ref.productoId );
    const variante = producto?.variantes.find( v => v.id === ref.varianteId ) ?? null;

    this.variante.set(variante);
  }

  // Actualizar stock
  actualizarStock ( value: string ): void {
    if ( !this.variantePanel() ) return;
    if ( !this.variante() ) return;

    const productId = this.variantePanel()!.productoId;
    const variantId = this.variante()!.id;

    this.inventarioService.actualizarVariante(
      productId.toString(),
      variantId.toString(),
      { stock: Number(value) }
    ).subscribe({
      next: ( resp ) => {
        // Actualizar el producto del signal local
        this.productos.update( productos =>
          productos.map( p => p.id === resp.id ? resp : p )
        );

        this.variante.set(null); // Borramos la variante del signal
        this.variantePanel.set(null); // Cerramos el panel de stock
      }
    })
  }
}
