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
  min,
  validate
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
  faSpinner,
  faFloppyDisk,
  faClose
} from '@fortawesome/free-solid-svg-icons';

// Servicio
import { InventarioService } from '../../services/inventario';

// Interfaces
import {
  Category,
  ProductState,
  Product,
  VariantRef,
} from '../../models/products.model';
import { SelectOption } from '../../../../shared/components/select/models/select.model';

type Tabs = 'variantes' | 'imagenes';

@Component({
  selector: 'product-detail',
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
  readonly faFloppyDisk: IconDefinition = faFloppyDisk;
  readonly faClose: IconDefinition = faClose;

  // TODO: INPUT Y OUTPUT
  readonly product = input.required<Product>();
  readonly startInEditMode = input<boolean>(false); // PARAMS: EDITAR PRODUCTO
  readonly editModeChanged = output<boolean>(); // PARAMS: EDITAR PRODUCTO
  readonly closeModal = output<void>();
  readonly productUpdated = output<Product>(); // Avisamos que el producto se actualizo
  readonly viewVariant = output<VariantRef>();
  readonly editVariant = output<VariantRef>();
  readonly addVariant = output<number>(); // productoId

  // TODO: PROPIEDADES
  readonly stateOptions: SelectOption[] = [
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
    {
      value: 'pausado',
      label: 'Pausado',
      badgeClass: 'badge--pausado'
    }
  ];

  readonly categoryOptions: SelectOption[] = [
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

  editMode = signal<boolean>(false); // ======= Modo edición para el formulario
  saving = signal<boolean>(false);

  // Se llena al activar edición
  editModel = signal({
    nombre: '',
    marca: '',
    modelo: '',
    precio: 0,
    descuento: 0,
    categoria: '' as Category,
    estado: '' as ProductState,
    descripcion: ''
  });

  tagsInput = signal<string>(''); // Tags o etiquetas se manejan a parte como texto separado por comas

  // El form de signalForms se construye sobre editModel
  editForm = form(this.editModel, ( schemaPath ) => {
    required( schemaPath.precio, { message: 'El precio es obligatorio' } );
    min( schemaPath.precio, 0, { message: 'El precio no puede ser negativo' } );
    min( schemaPath.descuento, 0, { message: 'El descuento no puede ser negativo' } );

    // Rechazamos valores que son solo espacios en blanco
    validate( schemaPath.nombre, ( { value } ) => {
      if ( value().trim().length === 0 ) {
        return {
          kind: 'whitespace',
          message: 'El nombre es obligatorio'
        };
      }

      return null;
    });

    validate( schemaPath.marca, ( { value } ) => {
      if ( value().trim().length === 0 ) {
        return {
          kind: 'whitespace',
          message: 'La marca es obligatoria'
        };
      }

      return null;
    });
  });

  // TODO: COMPUTED
  // ================================================== TAGS DE LOS PRODUCTOS

  // Tags que se muestran
  readonly visibleTags = computed<string[]>(() => {
    const etiquetas = this.product().etiquetas ?? [];

    if ( this.showAllTags() ) return etiquetas; // Todos

    return etiquetas.slice(0, this.maxTags())
  })

  // Cantidad de tags que quedan ocultos
  readonly remainingTags = computed<number>(() => {
    const etiquetas = this.product().etiquetas ?? [];

    if ( this.showAllTags() ) return 0; // Ya no hay restantes

    return Math.max(0, etiquetas.length - this.maxTags())
  })

  // ========================================================== ARCHIVAR

  // Verificamos que el producto esta archivado
  readonly productIsArchived = computed<boolean>(() =>
    this.product().estado === 'descontinuado'
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
  updateMaxTags(): void {
    const width = window.innerWidth;

    if ( width >= 1024 ) this.maxTags.set(4);
    else if ( width >= 600 ) this.maxTags.set(2);
    else this.maxTags.set(1);
  }

  // TODO: HOOKS
  ngOnInit(): void {
    this.updateMaxTags();

    // PARAMS: EDITAR PRODUCTO
    if ( this.startInEditMode() ) {
      this.startEditing(); // Abre directo en modo edición
    }
  }

  // TODO: MÉTODOS PRIVADOS
  // ========================================================== ARCHIVAR

  // Decide a que estado pasar al desarchivar, segun el stock real de las variantes
  private resolveUnarchiveState(): ProductState {
    const tieneStock = this.product().variantes.some( v => v.stock > 0 );
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
  toggleProductArchive(): void {
    const nuevoEstado: ProductState = this.productIsArchived()
                  ? this.resolveUnarchiveState()
                  : 'descontinuado';

    this.inventarioService.updateProduct(
      this.product().id.toString(),
      { estado: nuevoEstado }
    ).subscribe({
      next: (resp) => {
        this.productUpdated.emit(resp); // avisamos al padre
        this.showOptionsMenu.set(false); // Cerramos el menu
      }
    });
  }

  // ========================================================= EDICIÓN

  // Activar modo edición, carga los valores actuales del producto
  startEditing(): void {
    const p = this.product();

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
    this.editMode.set(true);
    this.editModeChanged.emit(true);
  }

  // Cancelar - descarta los cambios
  cancelEditing(): void {
    this.editMode.set(false);
    this.editModeChanged.emit(false);
  }

  // Guardar - envía los cambios a la API
  saveEditing(): void {
    if ( !this.editForm().valid() ) return;

    this.saving.set(true); // actuvamos el loader

    const valores = this.editModel();

    const etiquetas = this.tagsInput().split(',').map( tag => tag.trim() ).filter(
      tag => tag.length > 0
    );

    this.inventarioService.updateProduct(
      this.product().id.toString(),
      {
        ...valores,
        nombre: valores.nombre.trim(),
        marca: valores.marca.trim(),
        etiquetas
      }
    ).subscribe({
      next: ( resp ) => {
        this.productUpdated.emit(resp);
        this.editMode.set(false);
        this.editModeChanged.emit(false);
        this.saving.set(false); // desactivamos loader cuando llega respuesta
      },
      error: () => {
        this.saving.set(false); // desactivamos loader cuando hay error
      }
    })
  }

  // ========================================================== SELECTS
  updateState ( valor: string ): void {
    this.editModel.update( m => ({ ...m, estado: valor as ProductState }) );
  }

  updateCategory ( valor: string ): void {
    this.editModel.update( m => ({ ...m, categoria: valor as Category }) );
  }
}
