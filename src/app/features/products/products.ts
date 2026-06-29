import { ActivatedRoute, Router } from '@angular/router';

import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal
} from '@angular/core';

// Rxjs
import { forkJoin, map, of } from 'rxjs';
import {
  rxResource,
  toSignal
} from '@angular/core/rxjs-interop';

// Font Awesome
import {
  IconDefinition,
  faBoxArchive,
  faBoxOpen,
  faXmark,
  faBarcode,
  faFloppyDisk,
} from '@fortawesome/free-solid-svg-icons';

import {
  faEye
} from '@fortawesome/free-regular-svg-icons';

// Modelos
import {
  ProductState,
  VariantState,
  Product,
  Variant,
  VariantPanel,
  VariantRef
} from './models/products.model';

// Servicios
import { InventarioService } from './services/inventario';

@Component({
  selector: 'products',
  standalone: false,
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products implements OnInit {

  // TODO: INYECCIONES
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly inventarioService = inject(InventarioService);

  // TODO: ICONOS
  readonly faEye: IconDefinition = faEye;
  readonly faBoxArchive: IconDefinition = faBoxArchive;
  readonly faBoxOpen: IconDefinition = faBoxOpen;
  readonly faXmark: IconDefinition = faXmark;
  readonly faBarcode: IconDefinition = faBarcode;
  readonly faFloppyDisk: IconDefinition = faFloppyDisk;

  // TODO: SIGNALS
  products = signal<Product[]>([]);
  variant = signal<Variant | null>(null);
  selectedProducts = signal<Set<number>>(new Set());
  selectedState = signal<ProductState | 'Todas'>('Todas');
  variantPanel  = signal<VariantPanel | null>(null);
  searchQuery = signal<string>('');

  // TODO: toSignal
  // ====================================================== PARAMS: EDITAR PRODUCTO

  // Convertimos el observable de query params en un signal reactivo
  private readonly queryParams = toSignal(
    this.route.queryParamMap,
    { initialValue: this.route.snapshot.queryParamMap }
  );

  ngOnInit(): void {
    this.inventarioService.getProducts().subscribe({
      next: ( resp ) => this.products.set(resp),
    });
  }

  // TODO: EFFECTS
  // Limpia la selección automáticamente cada vez que se abre cualquier drawer
  private readonly clearSelectionOnDrawerOpen = effect(() => {
    const algunDrawerAbierto = this.selectedProduct() !== null ||
                              this.showProductForm() ||
                              this.selectedVariant() !== null;

    // Si hay algún drawer abierto
    if ( algunDrawerAbierto ) {
      this.clearSelection();
      this.variantPanel.set(null);
    }
  });

  // TODO: COMPUTED
  // ================================================== CAMBIAR ESTADO POR FILTRO

  // Filtrar los productos por estado
  readonly productsByState = computed<Product[]>(() => {
    const query = this.searchQuery();

    // Si hay busqueda activa, usar el resource
    if ( query ) {
      const resultados = this.productResource.value() ?? [];

      // Con esto retornamos solo los productos de cada estado
      if ( this.selectedState() === 'Todas' ) return resultados;
      return resultados.filter( p => p.estado === this.selectedState() );
    }

    if ( this.selectedState() === 'Todas' ) return this.products();

    return this.products().filter(
      producto => producto.estado === this.selectedState()
    );
  });

  // =================================================== SELECCIONAR CHECKBOX

  // Obtener la cantidad de todos los productos seleccionados
  readonly totalSelected = computed<number>(() => {
    return this.selectedProducts().size;
  });

  // ========================================================== ARCHIVAR

  // Obtener los productos seleccionados para archivar
  readonly productsToArchive = computed<Product[]>(() => {
    return this.products().filter(
      producto => this.selectedProducts().has(producto.id)
    );
  });

  // Para cambiar el nombre del botón archivar a desarchivar si todos los productos seleccionados están descontinuados
  readonly allArchived = computed<boolean>( () => {
    const seleccionados = this.productsToArchive();
    if ( seleccionados.length === 0 ) return false;

    return seleccionados.every( p => p.estado === 'descontinuado' ); // Verifica que todos los productos están en estado descontinuado, gracias al every
  });

  // Indica si la variante actual está archivada
  readonly variantIsArchived = computed<boolean>( () =>
    this.variant()?.estado === 'descontinuado'
  );

  // ===================================================== PARAMS: EDITAR PRODUCTO

  // El produco seleccionado se deriva de la URL - ya no es un signal mutable
  readonly selectedProduct = computed<Product | null>(() => {
    const id = this.queryParams().get('id');
    if ( !id ) return null;

    return this.products().find( producto => producto.id === Number(id) ) ?? null;
  });

  // Verificar el modo del drawer (PARAMS: EDITAR PRODUCTO)
  readonly startInEditMode = computed<boolean>(() =>
    this.queryParams().get('modo') === 'editar'
  );

  // ====================================================== PARAMS: CREAR PRODUCTO
  readonly showProductForm = computed<boolean>(() =>
    this.queryParams().get('modo') === 'crear'
  );

  // ===================================================== PARAMS: VER VARIANTE
  // El producto al que pertenece la variante — vía su propio parámetro, sin mezclarse con "id"
  readonly variantOwnerProduct = computed<Product | null>(() => {
    const productoId = this.queryParams().get('productoId');
    if ( !productoId ) return null;

    return this.products().find( p => p.id === Number(productoId) ) ?? null;
  });

  // La variante seleccionada
  readonly selectedVariant = computed<Variant | null>(() => {
    const producto = this.variantOwnerProduct();
    const varianteId = this.queryParams().get('varianteId');

    if ( !producto || !varianteId ) return null;

    return producto.variantes.find( v => v.id === Number(varianteId) ) ?? null;
  });

  // ===================================================== PARAMS: EDITAR VARIANTE
  readonly startVariantInEditMode = computed<boolean>(() =>
    this.queryParams().get('varModo') === 'editar'
  );

  // =======================================================================

  // TODO: rxResource
  // Buscar producto
  productResource = rxResource({
    params: () => ({ query: this.searchQuery() }),
    stream: ({ params }) => {
      // of - permite regresar un observable basado en lo que nosotros mandamos a invocar
      if ( !params.query ) return of([]);

      // Lo que hace forkJoin es que lanza las dos peticiones al mismo tiempo y cuando las dos responden te da los dos arrays juntos
      return forkJoin([
        this.inventarioService.getByBrand(params.query),
        this.inventarioService.getByTag(params.query),
        this.inventarioService.searchByName(params.query),
        this.inventarioService.searchByCategory(params.query),
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
  private resolveArchiveState(): VariantState {
    const variante = this.variant();

    // Si ya está archivada -> Desarchivar según su stock
    if ( variante?.estado === 'descontinuado' ) {
      return variante.stock === 0 ? 'sin_stock' : 'disponible';
    }

    // Si no está archivada -> archivar
    return 'descontinuado';
  }

  // Decide que estado aplicar según el estado actual de los productos (Solo cuando está desarchivado)
  private resolveUnarchiveState ( producto: Product ): ProductState {
    const tieneStock = producto.variantes.some( v => v.stock > 0 ); // Si hay uno que tenga stock mayor a 0

    return tieneStock ? 'disponible' : 'agotado';
  }

  // Sincroniza la respuesta de la API con el signal local (producto)
  private syncResponse ( resp: Product ): void {
    this.products.update( productos =>
      productos.map( producto => producto.id === resp.id ? resp : producto )
    );

    this.variant.set(null);
    this.variantPanel.set(null);
  }

  // TODO: MÉTODOS PÚBLICOS
  // ================================================== CAMBIAR ESTADO POR FILTRO

  // Cambiar el valor del estado seleccionado
  setSelectedState ( estado: ProductState | 'Todas' ): void {
    this.clearSelection();

    this.selectedState.set(estado);
  }


  // =================================================== SELECCIONAR CHECKBOX

  // Seleccionar todas
  selectAll(): void {
    const seleccionados = new Set( this.selectedProducts() );

    if ( this.totalSelected() === this.productsByState().length ) {
      return this.clearSelection();
    }

    this.productsByState().forEach( product => seleccionados.add(product.id) );
    this.selectedProducts.set(seleccionados);
  }

  // Identificar si el producto esta seleccionado
  isSelected ( id: number ): boolean {
    return this.selectedProducts().has(id);
  }

  // Añadir o sacar productos de la selección
  toggleSelection ( id: number ): void {
    const seleccionados = new Set( this.selectedProducts() );

    seleccionados.has(id) ? seleccionados.delete(id) : seleccionados.add(id);

    this.selectedProducts.set(seleccionados);
  }

  // Limpiar selecciones
  clearSelection(): void {
    this.selectedProducts.set( new Set() );
  }

  // ========================================================= PRODUCTO KEBAB

  // Mostrar Kebab por producto
  toggleProductKebab ( id: number ): void {
    // Si ese producto ya es el único seleccionado
    if ( this.totalSelected() === 1 && this.isSelected(id) ) {
      return this.clearSelection();
    }

    // Limpiar y seleccionar solo ese producto
    this.selectedProducts.set( new Set([id]) );
  }

  // Archivar / Desarchivar productos seleccionados
  archiveOrUnarchiveProducts(): void {
    const productos = this.productsToArchive();
    if ( productos.length === 0 ) return;

    // Cada producto puede tener un estado distinto al desarchivar
    const peticiones = productos.map(
      producto => {
        const nuevoEstado = this.allArchived()
                              ? this.resolveUnarchiveState(producto) // cada uno según su stock
                              : 'descontinuado'; // descontinuados todos

        return this.inventarioService.updateProduct(
          producto.id.toString(),
          { estado: nuevoEstado }
        )
      }
    );

    // Lanzamos todas las peticiones al mismo tiempo
    forkJoin(peticiones).subscribe({
      next: ( productosActualizados ) => {
        productosActualizados.forEach( productoActualizado => {
          this.products.update( productos =>
            productos.map( producto =>
              producto.id === productoActualizado.id
                        ? productoActualizado
                        : producto
            )
          );
        });

        this.clearSelection(); // Cierra kebabs
      }
    })
  }

  // ========================================================= VARIANTE KEBABS

  // Obtener variante
  getVariant ( ref: VariantRef ): void {
    const producto = this.products().find( p => p.id === ref.productoId );
    const variante = producto?.variantes.find( v => v.id === ref.varianteId ) ?? null;

    this.variant.set(variante);
  }

  // Actualizar stock
  updateStock ( value: string ): void {
    if ( !this.variantPanel() ) return;
    if ( !this.variant() ) return;

    const productId = this.variantPanel()!.productoId;
    const variantId = this.variant()!.id;

    this.inventarioService.updateVariant(
      productId.toString(),
      variantId.toString(),
      { stock: Number(value) }
    ).subscribe({
      next: ( resp ) => this.syncResponse(resp)
    })
  }

  // Archivar / Desarchivar la variante
  archiveOrUnarchiveVariant() {
    if ( !this.variantPanel() ) return;
    if ( !this.variant() ) return;

    const productId = this.variantPanel()!.productoId;
    const variantId = this.variant()!.id;
    const nuevoEstado = this.resolveArchiveState();

    this.inventarioService.updateVariant(
      productId.toString(),
      variantId.toString(),
      { estado: nuevoEstado }
    ).subscribe({
      next: ( resp ) => this.syncResponse(resp),
    })
  }

  // ================================================= DRAWER VER/EDITAR PRODUCTO

  // Abrir drawer Detalle producto
  openProductDetail ( id: number ): void {
    const producto = this.products().find(
      producto => producto.id === id
    );
    if ( !producto ) return; // Si no encuentra producto

    // Params
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { id, modo: null },
      queryParamsHandling: 'merge'
    });
  }

  // Cerrar drawer Detalle producto
  closeProductDetail() {
    // Params
    this.router.navigate( [], {
      relativeTo: this.route,
      queryParams: { id: null, modo: null },
      queryParamsHandling: 'merge'
    });
  }

  // ================================================= DRAWER CREAR PRODUCTO

  // Abrir drawer Formulario del producto
  openProductForm(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { modo: 'crear' },
      queryParamsHandling: 'merge'
    });
  }

  // Cerrar drawer Formulario del producto
  closeProductForm(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { modo: null },
      queryParamsHandling: 'merge'
    });
  }

  // Cerrar todos los drawers
  closeAllDrawers(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        id: null,
        modo: null,
        productoId: null,
        varianteId: null,
        varModo: null
      },
      queryParamsHandling: 'merge'
    });
  }

  // ================================================= DRAWER VER/EDITAR VARIANTE

  // Abrir drawer Detalle variante
  openVariantDetail ( productoId: number, varianteId: number ): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { productoId, varianteId },
      queryParamsHandling: 'merge'
    });
  }

  // Cerrar drawer Detalle variante
  closeVariantDetail(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { productoId: null, varianteId: null, varModo: null },
      queryParamsHandling: 'merge'
    });
  }

  // ========================================= ACHIVAR PRODUCTO DESDE PRODUCT DETAIL

  // Actualiza el producto en el signal local y mantiene sincronizado el drawer
  updateProductInList ( producto: Product ): void {
    this.products.update( productos =>
      productos.map( p => p.id === producto.id ? producto : p )
    );
  }

  // ====================================================== PARAMS: EDITAR PRODUCTO

  // Sincronizamos la URL con el modo
  syncEditMode ( activo: boolean ): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { modo: activo ? 'editar' : null },
      queryParamsHandling: 'merge'
    });
  }

  // Abre el drawer directo en modo edición
  editProduct ( id: number ): void {
    const producto = this.products().find( producto => producto.id === id );
    if ( !producto ) return;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { id, modo: 'editar' },
      queryParamsHandling: 'merge'
    });
  }

  // ====================================================== PARAMS: EDITAR VARIANTE

  // Abre directo en modo edición  desde la tabla o product-detail
  editVariant ( productoId: number, varianteId: number ): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { productoId, varianteId, varModo: 'editar' },
      queryParamsHandling: 'merge'
    });
  }

  // Sincroniza la URL cuando el modo cambia desde dentro del drawer
  syncVariantEditMode ( activo: boolean ): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { varModo: activo ? 'editar' : null },
      queryParamsHandling: 'merge'
    });
  }


  // ========================================================== CREAR PRODUCTO

  // Recibe el producto recién creado, lo agrega a la lista, y abre su detalle
  onProductCreated ( producto: Product ): void {
    this.products.update( products => [ ...products, producto ] );

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { modo: null, id: producto.id }, // abrimos product detail
      queryParamsHandling: 'merge'
    })
  }
}
