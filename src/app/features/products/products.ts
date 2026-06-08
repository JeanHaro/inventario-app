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
  faBoxOpen,
  faXmark,
  faClockRotateLeft,
  faBarcode,
  faFloppyDisk,
} from '@fortawesome/free-solid-svg-icons';

import {
  faEye
} from '@fortawesome/free-regular-svg-icons';

// Modelos
import {
  EstadoProducto,
  EstadoVariante,
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
  readonly faBoxOpen: IconDefinition = faBoxOpen;
  readonly faXmark: IconDefinition = faXmark;
  readonly faClockRotateLeft: IconDefinition = faClockRotateLeft;
  readonly faBarcode: IconDefinition = faBarcode;
  readonly faFloppyDisk: IconDefinition = faFloppyDisk;

  // TODO: PROPIEDADES
  productos = signal<Producto[]>([]);
  variante = signal<Variante | null>(null);
  productosSeleccionados = signal<Set<number>>(new Set());
  productoSeleccionado = signal<Producto | null>(null);
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
  // ================================================== CAMBIAR ESTADO POR FILTRO

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

  // =================================================== SELECCIONAR CHECKBOX

  // Obtener la cantidad de todos los productos seleccionados
  readonly totalSeleccionados = computed<number>(() => {
    return this.productosSeleccionados().size;
  });

  // ========================================================== ARCHIVAR

  // Obtener los productos seleccionados para archivar
  readonly productosParaArchivar = computed<Producto[]>(() => {
    return this.productos().filter(
      producto => this.productosSeleccionados().has(producto.id)
    );
  });

  // Para cambiar el nombre del botón archivar a desarchivar si todos los productos seleccionados están descontinuados
  readonly todosArchivados = computed<boolean>( () => {
    const seleccionados = this.productosParaArchivar();
    if ( seleccionados.length === 0 ) return false;

    return seleccionados.every( p => p.estado === 'descontinuado' ); // Verifica que todos los productos están en estado descontinuado, gracias al every
  })

  // Indica si la variante actual está archivada
  readonly varianteEstaArchivada = computed<boolean>( () =>
    this.variante()?.estado === 'descontinuado'
  )

  // =======================================================================

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

  // TODO: MÉTODOS PRIVADOS
  // Decide que estado aplicar según el estado actual de la variante
  private resolverEstadoArchivar(): EstadoVariante {
    const variante = this.variante();

    // Si ya está archivada -> Desarchivar según su stock
    if ( variante?.estado === 'descontinuado' ) {
      return variante.stock === 0 ? 'sin_stock' : 'disponible';
    }

    // Si no está archivada -> archivar
    return 'descontinuado';
  }

  // Decide que estado aplicar según el estado actual de los productos (Solo cuando está desarchivado)
  private resolverEstadoDesarchivarProducto ( producto: Producto ): EstadoProducto {
    const tieneStock = producto.variantes.some( v => v.stock > 0 ); // Si hay uno que tenga stock mayor a 0

    return tieneStock ? 'disponible' : 'agotado';
  }

  // Sincroniza la respuesta de la API con el signal local (producto)
  private sincronizarRespuesta ( resp: Producto ): void {
    this.productos.update( productos =>
      productos.map( producto => producto.id === resp.id ? resp : producto )
    );

    this.variante.set(null);
    this.variantePanel.set(null);
  }

  // TODO: MÉTODOS PÚBLICOS
  // ================================================== CAMBIAR ESTADO POR FILTRO

  // Cambiar el valor del estado seleccionado
  estadoPorProducto ( estado: EstadoProducto | 'Todas' ): void {
    this.limpiarSeleccion();

    this.estadoSeleccionado.set(estado);
  }


  // =================================================== SELECCIONAR CHECKBOX

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

  // ========================================================= PRODUCTO KEBAB

  // Mostrar Kebab por producto
  toggleKebabProducto ( id: number ): void {
    // Si ese producto ya es el único seleccionado
    if ( this.totalSeleccionados() === 1 && this.estaSeleccionado(id) ) {
      return this.limpiarSeleccion();
    }

    // Limpiar y seleccionar solo ese producto
    this.productosSeleccionados.set( new Set([id]) );
  }

  // Archivar / Desarchivar productos seleccionados
  archivarODesarchivarProductos(): void {
    const productos = this.productosParaArchivar();
    if ( productos.length === 0 ) return;

    // Cada producto puede tener un estado distinto al desarchivar
    const peticiones = productos.map(
      producto => {
        const nuevoEstado = this.todosArchivados()
                              ? this.resolverEstadoDesarchivarProducto(producto) // cada uno según su stock
                              : 'descontinuado'; // descontinuados todos

        return this.inventarioService.actualizarProducto(
          producto.id.toString(),
          { estado: nuevoEstado }
        )
      }
    );

    // Lanzamos todas las peticiones al mismo tiempo
    forkJoin(peticiones).subscribe({
      next: ( resp ) => {
        resp.forEach( resp => {
          this.productos.update( productos =>
            productos.map( producto => producto.id === resp.id ? resp : producto )
          );
        });

        this.limpiarSeleccion(); // Cierra kebabs
      }
    })
  }

  // ========================================================= VARIANTE KEBABS

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
      next: ( resp ) => this.sincronizarRespuesta(resp)
    })
  }

  // Archivar / Desarchivar la variante
  archivarODesarchivarVariante() {
    if ( !this.variantePanel() ) return;
    if ( !this.variante() ) return;

    const productId = this.variantePanel()!.productoId;
    const variantId = this.variante()!.id;
    const nuevoEstado = this.resolverEstadoArchivar();

    this.inventarioService.actualizarVariante(
      productId.toString(),
      variantId.toString(),
      { estado: nuevoEstado }
    ).subscribe({
      next: ( resp ) => this.sincronizarRespuesta(resp),
    })
  }

  // ===================================================== MDALS VER/EDITAR PRODUCTO

  // Abrir modal Detalle producto
  abrirDetalleProducto ( id: number ): void {
    const producto = this.productos().find(
      producto => producto.id === id
    );
    if ( !producto ) return; // Si no encuentra producto

    this.limpiarSeleccion();
    this.productoSeleccionado.set(producto);
  }

  // Cerrar modal Detalle producto
  cerrarDetalleProducto() {
    this.productoSeleccionado.set(null);
  }
}
