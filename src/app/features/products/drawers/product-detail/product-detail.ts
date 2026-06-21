import {
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  input,
  OnInit,
  output,
  signal,
  viewChild
} from '@angular/core';

import {
  form,
  required,
  min
} from '@angular/forms/signals';

// Font Awesome
import {
  IconDefinition,
  faArrowRightFromBracket,
  faPenToSquare,
  faEllipsis,
  faFileArrowDown,
  faBoxArchive,
  faBoxOpen,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';

// Servicio
import { InventarioService } from '../../services/inventario';

// Interfaces
import {
  Categoria,
  EstadoProducto,
  Producto,
} from '../../models/products.model';
import { SelectOption } from '../../../../shared/components/select/models/select.model';

type Tabs = 'variantes' | 'imagenes';

@Component({
  selector: 'app-product-detail',
  standalone: false,
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail implements OnInit {
  // TODO: INYECCIONES
  private readonly inventarioService = inject(InventarioService);

  // TODO: VIEWCHILD
  readonly optionsMenuRef = viewChild<ElementRef<HTMLElement>>('optionsMenuRef');

  // TODO: ICONOS
  readonly faArrowRightFromBracket: IconDefinition = faArrowRightFromBracket;
  readonly faPenToSquare: IconDefinition = faPenToSquare;
  readonly faEllipsis: IconDefinition = faEllipsis;
  readonly faFileArrowDown: IconDefinition = faFileArrowDown;
  readonly faBoxArchive: IconDefinition = faBoxArchive;
  readonly faBoxOpen: IconDefinition = faBoxOpen;
  readonly faSpinner: IconDefinition = faSpinner;

  // TODO: INPUT Y OUTPUT
  readonly producto = input.required<Producto>();
  readonly iniciarEnEdicion = input<boolean>(false); // PARAMS: EDITAR PRODUCTO
  readonly modoEdicionCambiado = output<boolean>(); // PARAMS: EDITAR PRODUCTO
  readonly cerrarModal = output<void>();
  readonly productoActualizado = output<Producto>(); // Avisamos que el producto se actualizo

  // TODO: PROPIEDADES
  readonly estadoOptions: SelectOption[] = [
    {
      value: 'disponible',
      label: 'Disponible',
      badgeClass: 'badge--disponible'
    },
    {
      value: 'agotado',
      label: 'Agotado',
      badgeClass: 'badge--agotado'
    },
    {
      value: 'reservado',
      label: 'Reservado',
      badgeClass: 'badge--reservado'
    },
    {
      value: 'descontinuado',
      label: 'Descontinuado',
      badgeClass: 'badge--descontinuado'
    },
    {
      value: 'proximamente',
      label: 'Próximamente',
      badgeClass: 'badge--proximamente'
    },
  ];

  readonly categoriaOptions: SelectOption[] = [
    {
      value: 'tecnologia',
      label: 'Tecnología',
      badgeClass: 'badge--tecnologia'
    },
    {
      value: 'hogar',
      label: 'Hogar',
      badgeClass: 'badge--hogar'
    },
    {
      value: 'ropa',
      label: 'Ropa',
      badgeClass: 'badge--ropa'
    },
    {
      value: 'alimentos',
      label: 'Alimentos',
      badgeClass: 'badge--alimentos'
    },
    {
      value: 'electronica',
      label: 'Electrónica',
      badgeClass: 'badge--electronica'
    },
    {
      value: 'calzado',
      label: 'Calzado',
      badgeClass: 'badge--calzado'
    },
    {
      value: 'bebidas',
      label: 'Bebidas',
      badgeClass: 'badge--bebidas'
    },
    {
      value: 'muebles',
      label: 'Muebles',
      badgeClass: 'badge--muebles'
    },
    {
      value: 'deportes',
      label: 'Deportes',
      badgeClass: 'badge--deportes'
    },
    {
      value: 'belleza',
      label: 'Belleza',
      badgeClass: 'badge--belleza'
    },
    {
      value: 'juguetes',
      label: 'Juguetes',
      badgeClass: 'badge--juguetes'
    },
    {
      value: 'libros',
      label: 'Libros',
      badgeClass: 'badge--libros'
    },
    {
      value: 'vehiculos',
      label: 'Vehículos',
      badgeClass: 'badge--vehiculos'
    },
    {
      value: 'herramientas',
      label: 'Herramientas',
      badgeClass: 'badge--herramientas'
    },
    {
      value: 'otros',
      label: 'Otros',
      badgeClass: 'badge--otros'
    }
  ];

  // TODO: SIGNALS
  showOptionsMenu = signal<boolean>(false);

  activeTab = signal<Tabs>('variantes');

  private readonly TAG_COLORS = [
    'violet', 'blue', 'green', 'orange', 'red', 'teal', 'pink', 'indigo'
  ] as const; // Paleta de colores predefinida para tags
  readonly maxTags = signal<number>(2); // Cantidad max de tags
  showAllTags = signal<boolean>(false); // Mostrar todos los tags

  // ========================================================= EDICIÓN

  modoEdicion = signal<boolean>(false); // ======= Modo edición para el formulario
  guardando = signal<boolean>(false);

  // Se llena al activar edición
  editModel = signal({
    nombre: '',
    marca: '',
    modelo: '',
    precio: 0,
    descuento: 0,
    categoria: '' as Categoria,
    estado: '' as EstadoProducto,
    descripcion: ''
  });

  tagsInput = signal<string>(''); // Tags o etiquetas se manejan a parte como texto separado por comas

  // El form de signalForms se construye sobre editModel
  editForm = form(this.editModel, ( schemaPath ) => {
    required( schemaPath.nombre, { message: 'El nombre es obligatorio' });
    required( schemaPath.marca, { message: 'La marca es obligatorio' } );
    required( schemaPath.precio, { message: 'El precio es obligatorio' } );
    min( schemaPath.precio, 0, { message: 'El precio no puede ser negativo' } );
    min( schemaPath.descuento, 0, { message: 'El descuento no puede ser negativo' } );
  });

  // TODO: COMPUTED
  // ================================================== TAGS DE LOS PRODUCTOS

  // Tags que se muestran
  readonly tagsVisibles = computed<string[]>(() => {
    const etiquetas = this.producto().etiquetas ?? [];

    if ( this.showAllTags() ) return etiquetas; // Todos

    return etiquetas.slice(0, this.maxTags())
  })

  // Cantidad de tags que quedan ocultos
  readonly tagsRestantes = computed<number>(() => {
    const etiquetas = this.producto().etiquetas ?? [];

    if ( this.showAllTags() ) return 0; // Ya no hay restantes

    return Math.max(0, etiquetas.length - this.maxTags())
  })

  // ========================================================== ARCHIVAR

  // Verificamos que el producto esta archivado
  readonly productoArchivado = computed<boolean>(() =>
    this.producto().estado === 'descontinuado'
  );

  // TODO: HOSTLISTENER
  // ====================================================== MOSTRAR OPCIONES

  // Escucha cualquier click en el documento
  @HostListener('document:click', ['$event'])
  onDocumentClick ( event: Event ): void {
    // Verificación independiente del menu de opciones
    if ( this.showOptionsMenu() ) {
      const menuOptions = this.optionsMenuRef()?.nativeElement;
      // Si existe el menu y el click fue fuera de este, entonces cerramos el menu
      if ( menuOptions && !menuOptions.contains(event.target as Node) ) {
        this.showOptionsMenu.set(false);
      }
    }
  }

  // ================================================== TAGS DE LOS PRODUCTOS

  // Actualiza maxTag según el ancho de la pantalla
  @HostListener('window:resize')
  actualizarMaxTags(): void {
    const width = window.innerWidth;

    if ( width >= 1024 ) this.maxTags.set(4);
    else if ( width >= 600 ) this.maxTags.set(2);
    else this.maxTags.set(1);
  }

  // TODO: HOOKS
  ngOnInit(): void {
    this.actualizarMaxTags();

    // PARAMS: EDITAR PRODUCTO
    if ( this.iniciarEnEdicion() ) {
      this.activarEdicion(); // Abre directo en modo edición
    }
  }

  // TODO: MÉTODOS PRIVADOS
  // ========================================================== ARCHIVAR

  // Decide a que estado pasar al desarchivar, segun el stock real de las variantes
  private resolverEstadoDesarchivar(): EstadoProducto {
    const tieneStock = this.producto().variantes.some( v => v.stock > 0 );
    return tieneStock ? 'disponible' : 'agotado';
  }


  // TODO: MÉTODOS PÚBLICOS
  // ====================================================== MOSTRAR OPCIONES

  // Abrir y cerrar menu de opciones
  toggleOptionsMenu ( event: Event ): void {
    event.stopPropagation(); // Evita que cuando demos click al button lo cuente como si estuviera clickeando en el documento de afuera

    this.showOptionsMenu.set(!this.showOptionsMenu());
  }

  // ================================================== TAGS DE LOS PRODUCTOS

  getTagColor ( tag: string ): string {
    // Suma los códigos de caracteres del nombre -> número estable
    const hash = tag.split('').reduce( ( acc, char ) => acc + char.charCodeAt(0), 0);

    return this.TAG_COLORS[ hash % this.TAG_COLORS.length];
  }

  // ========================================================== ARCHIVAR

  // Archivar / Desarchivar el producto
  toggleArchivoProducto(): void {
    const nuevoEstado: EstadoProducto = this.productoArchivado()
                  ? this.resolverEstadoDesarchivar()
                  : 'descontinuado';

    this.inventarioService.actualizarProducto(
      this.producto().id.toString(),
      { estado: nuevoEstado }
    ).subscribe({
      next: (resp) => {
        this.productoActualizado.emit(resp); // avisamos al padre
        this.showOptionsMenu.set(false); // Cerramos el menu
      }
    });
  }

  // ========================================================= EDICIÓN

  // Activar modo edición, carga los valores actuales del producto
  activarEdicion(): void {
    const p = this.producto();

    this.editModel.set({
      nombre: p.nombre,
      marca: p.marca ?? '',
      modelo: p.modelo ?? '',
      precio: p.precio,
      descuento: p.descuento ?? 0,
      categoria: p.categoria,
      estado: p.estado,
      descripcion: p.descripcion ?? ''
    });

    this.tagsInput.set( ( p.etiquetas ?? [] ).join(', ') );

    this.showOptionsMenu.set(false);
    this.modoEdicion.set(true);
    this.modoEdicionCambiado.emit(true);
  }

  // Cancelar - descarta los cambios
  cancelarEdicion(): void {
    this.modoEdicion.set(false);
    this.modoEdicionCambiado.emit(false);
  }

  // Guardar - envía los cambios a la API
  guardarEdicion(): void {
    if ( !this.editForm().valid() ) return;

    this.guardando.set(true); // actuvamos el loader

    const valores = this.editModel();

    const etiquetas = this.tagsInput().split(',').map( tag => tag.trim() ).filter(
      tag => tag.length > 0
    );

    this.inventarioService.actualizarProducto(
      this.producto().id.toString(),
      { ...valores, etiquetas }
    ).subscribe({
      next: ( resp ) => {
        this.productoActualizado.emit(resp);
        this.modoEdicion.set(false);
        this.modoEdicionCambiado.emit(false);
        this.guardando.set(false); // desactivamos loader cuando llega respuesta
      },
      error: () => {
        this.guardando.set(false); // desactivamos loader cuando hay error
      }
    })
  }

  // ========================================================== SELECTS
  actualizarEstado ( valor: string ): void {
    this.editModel.update( m => ({ ...m, estado: valor as EstadoProducto }) );
  }

  actualizarCategoria ( valor: string ): void {
    this.editModel.update( m => ({ ...m, categoria: valor as Categoria }) );
  }
}
