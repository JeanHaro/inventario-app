import {
  Component,
  computed,
  effect,
  ElementRef,
  HostListener,
  inject,
  input,
  OnInit,
  output,
  signal,
  untracked,
  viewChild
} from '@angular/core';

import { form, min, required, validate } from '@angular/forms/signals';

// FontAwesome
import {
  faArrowRightFromBracket,
  faBarcode,
  faBoxArchive,
  faBoxesStacked,
  faBoxOpen,
  faCamera,
  faClockRotateLeft,
  faClose,
  faEllipsis,
  faFileArrowDown,
  faFloppyDisk,
  faPenToSquare,
  faPlus,
  faSpinner,
  faTag,
  IconDefinition
} from '@fortawesome/free-solid-svg-icons';

// Interfaces
import {
  Product,
  Variant,
  VariantState
} from '../../models/products.model';

// Servicios
import { InventarioService } from '../../services/inventario';
import { SelectOption } from '../../../../shared/components/select/models/select.model';

@Component({
  selector: 'variant-detail',
  standalone: false,
  templateUrl: './variant-detail.html',
  styleUrl: './variant-detail.scss',
})
export class VariantDetail implements OnInit {
  // TODO: INYECCIONES
  private readonly inventarioService = inject(InventarioService);

  // TODO: VIEWCHILD
  readonly optionsMenuRef = viewChild<ElementRef<HTMLElement>>('optionsMenuRef');
  readonly imageInputRef = viewChild<ElementRef<HTMLInputElement>>('imageInputRef');

  // TODO: ICONOS
  readonly faArrowRightFromBracket: IconDefinition = faArrowRightFromBracket;
  readonly faPenToSquare: IconDefinition = faPenToSquare;
  readonly faEllipsis: IconDefinition = faEllipsis;
  readonly faFloppyDisk: IconDefinition = faFloppyDisk;
  readonly faClose: IconDefinition = faClose;
  readonly faFileArrowDown: IconDefinition = faFileArrowDown;
  readonly faBoxArchive: IconDefinition = faBoxArchive;
  readonly faBarcode: IconDefinition = faBarcode;
  readonly faSpinner: IconDefinition = faSpinner;
  readonly faBoxesStacked: IconDefinition = faBoxesStacked;
  readonly faTag: IconDefinition = faTag;
  readonly faPlus: IconDefinition = faPlus;
  readonly faClockRotateLeft: IconDefinition = faClockRotateLeft;
  readonly faCamera: IconDefinition = faCamera;
  readonly faBoxOpen: IconDefinition = faBoxOpen;

  // TODO: INPUT Y OUTPUT
  readonly variant = input.required<Variant>();
  readonly productName = input.required<string>();
  readonly productId = input.required<number>();
  readonly closeModal = output<void>();
  readonly variantUpdated = output<Product>(); // Avisamos al padre que actualizamos la variante
  readonly startInEditMode = input<boolean>(false);
  readonly editModeChanged = output<boolean>();

  // TODO: PROPIEDADES
  readonly variantStateOptions: SelectOption[] = [
  {
    value: 'disponible',
    label: 'Disponible',
    badgeClass: 'badge--disponible'
  },
  {
    value: 'sin_stock',
    label: 'Sin stock',
    badgeClass: 'badge--sin_stock'
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
];

  // TODO: SIGNALS
  showOptionsMenu = signal<boolean>(false);

  // ====================================================== EDICIÓN
  editMode = signal<boolean>(false);
  saving = signal<boolean>(false);
  rawServerError = signal<string | null>(null); // mensaje crudo que llega del backend
  archiving = signal<boolean>(false);
  shakingField = signal<string | null>(null); // Errors

  editModel = signal({
    nombre: '',
    sku: '',
    precioAdicional: 0,
    stock: 0,
    estado: '' as VariantState,
    talla: '',
    color: '',
    capacidad: ''
  });

  editForm = form(this.editModel, ( schemaPath ) => {
    required( schemaPath.precioAdicional, { message: 'El precio es obligatorio' } );
    required( schemaPath.stock, { message: 'El stock es obligatorio' } );
    min( schemaPath.precioAdicional, 0, { message: 'El precio no puede ser negativo' } );
    min( schemaPath.stock, 0, { message: 'El stock no puede ser negativo' } );

    validate( schemaPath.nombre, ({ value }) => {
      if ( value().trim().length === 0 ) {
        return { kind: 'whitespace', message: 'El nombre es obligatorio' };
      }

      return null;
    });

    validate( schemaPath.sku, ({ value }) => {
      if ( value().trim().length === 0 ) {
        return { kind: 'whitespace', message: 'El SKU es obligatorio' }
      }

      return null;
    });
  });

  // ========================================================= IMAGEN
  uploadingImage = signal<boolean>(false);
  imageError = signal<string | null>(null);

  private readonly VALID_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  private readonly MAX_SIZE_MB = 5;

  // TODO: COMPUTED
  // ========================================================== ARCHIVAR

  // Verificamos que el producto esta archivado
  readonly variantIsArchived = computed<boolean>(() =>
    this.variant().estado === 'descontinuado'
  );

  // ========================================================= EDICIÓN

  // Solo se muestra si el mensaje del servidor menciona el SKU
  readonly skuServerError = computed<string | null>(() => {
    const msg = this.rawServerError();
    if ( msg && msg.toLowerCase().includes('sku') ) return msg;
    return null;
  });

  // Cualquier otro error del servidor que NO sea sobre el SKU
  readonly generalServerError = computed<string | null>(() => {
    const msg = this.rawServerError();
    if ( msg && !msg.toLowerCase().includes('sku') ) return msg;
    return null;
  });

  // TODO: EFFECTS
  // Si el usuario modifica el SKU mientras hay un error de servidor, lo limpiamos
  private readonly clearSkuServerError = effect(() => {
    this.editForm.sku().value(); // se suscribe a los cambios del valor

    untracked(() => {
    if ( this.rawServerError() !== null ) {
      this.rawServerError.set(null);
    }
  });
  });

  // TODO: HOSTLISTENER
  // ====================================================== MOSTRAR OPCIONES

  // Escucha cualquier click en el documento
  @HostListener('document:click', ['$event'])
  onDocumentClick ( event: Event ): void {
    if ( this.showOptionsMenu() ) {
      const menuOptions = this.optionsMenuRef()?.nativeElement;

      if ( menuOptions && !menuOptions.contains(event.target as Node) ) {
        this.showOptionsMenu.set(false);
      }
    }
  }

  // TODO: HOOKS
  ngOnInit(): void {
    if ( this.startInEditMode() ) {
      this.startEditing();
    }
  }

  // TODO: MÉTODOS PRIVADOS
  // ========================================================= IMAGEN
  private truncarNombre ( nombre: string, maxLength: number = 20 ): string {
    if ( nombre.length <= maxLength ) return nombre;
    return nombre.slice(0, maxLength) + '...';
  }

  private validateFile ( file: File, input: HTMLInputElement ): boolean {
    this.imageError.set(null); // Limpiamos los errores

    // 1. Validamos el formato
    if ( !this.VALID_TYPES.includes(file.type) ) {
      this.imageError.set(`"${this.truncarNombre(file.name)}" no es un formato válido.`);
      input.value = '';

      return false;
    }

    const sizeMB = file.size / ( 1024 * 1024 );
    // 2. Validamos el tamaño del archivo
    if ( sizeMB > this.MAX_SIZE_MB ) {
      this.imageError.set(`"${this.truncarNombre(file.name)}" pesa ${sizeMB.toFixed(1)}MB. El máximo permitido es ${this.MAX_SIZE_MB}MB.`);
      input.value = '';

      return false;
    }

    return true;
  }

  // ========================================================== ARCHIVAR

  // Decide a que estado pasar al desarchivar, segun el stock real de las variantes
  private resolveVariantUnarchiveState(): VariantState {
    return this.variant().stock > 0 ? 'disponible' : 'sin_stock';
  }

  // TODO: MÉTODOS PÚBLICOS
  // ====================================================== MOSTRAR OPCIONES

  // Mostrar y ocultar el menu de opciones
  toggleOptionsMenu ( event: Event ): void {
    event.stopPropagation();
    this.showOptionsMenu.set(!this.showOptionsMenu());
  }

  // ========================================================== ARCHIVAR

  // Archivar / Desarchivar el producto
  toggleVariantArchive(): void {
    this.archiving.set(true);

    const nuevoEstado: VariantState = this.variantIsArchived()
      ? this.resolveVariantUnarchiveState()
      : 'descontinuado';

    this.inventarioService.updateVariant(
      this.productId().toString(),
      this.variant().id.toString(),
      { estado: nuevoEstado }
    ).subscribe({
      next: ( resp ) => {
        this.variantUpdated.emit(resp);
        this.showOptionsMenu.set(false);
        this.archiving.set(false);
      },
      error: () => this.archiving.set(false)
    });
  }

  // ========================================================= EDICIÓN

  // Activar modo edición
  startEditing(): void {
    const v = this.variant();

    this.editModel.set({
      nombre: v.nombre ?? '',
      sku: v.sku ?? '',
      precioAdicional: v.precioAdicional ?? 0,
      stock: v.stock,
      estado: v.estado,
      talla: v.talla ?? '',
      color: v.color ?? '',
      capacidad: v.capacidad ?? ''
    });

    this.showOptionsMenu.set(false);
    this.editMode.set(true);
    this.editModeChanged.emit(true);
  }

  // Actualizar estado
  updateState ( valor: string ): void {
    this.editModel.update( m => ({ ...m, estado: valor as VariantState }));
  }

  // Cancelar modo edición
  cancelEditing(): void {
    this.editMode.set(false);
    this.editModeChanged.emit(false);
    this.imageError.set(null);
    this.rawServerError.set(null);
  }

  // Guardar datos editados
  saveEditing(): void {
    if ( !this.editForm().valid() ) return;

    this.saving.set(true);
    this.rawServerError.set(null);

    const valores = this.editModel();

    this.inventarioService.updateVariant(
      this.productId().toString(),
      this.variant().id.toString(),
      {
        ...valores,
        nombre: valores.nombre.trim(),
        sku: valores.sku.trim()
      }
    ).subscribe({
      next: ( resp ) => {
        this.variantUpdated.emit(resp);
        this.editMode.set(false);
        this.editModeChanged.emit(false);
        this.saving.set(false);
        this.imageError.set(null);
        this.rawServerError.set(null);
      },
      error: ( err ) => {
        this.saving.set(false);
        this.rawServerError.set( err.message ?? 'Ocurrió un error al guardar' );
      }
    })
  }

  // ========================================================= IMAGEN

  // Abrir input file
  openImageSelector(): void {
    if ( !this.editMode() ) return; // Solo se puede cambiar en modo edición
    this.imageInputRef()?.nativeElement.click();
  }

  // Seleccionamos la imagen
  onImageSelected ( event: Event ): void {
    const input = event.target as HTMLInputElement;
    if ( !input.files || input.files.length === 0 ) return;

    const file = input.files[0];
    const validation = this.validateFile(file, input);

    if ( validation ) {
      const formData = new FormData();
      formData.append('imagen', file);

      this.uploadingImage.set(true);

      this.inventarioService.uploadVariantImage(
        this.productId().toString(),
        this.variant().id.toString(),
        formData
      ).subscribe({
        next: ( resp ) => {
          this.variantUpdated.emit(resp.producto);
          this.uploadingImage.set(false);
          input.value = '';
        },
        error: ( err ) => {
          this.imageError.set( err.message ?? 'Ocurrió un error al subir la imagen.' );
          this.uploadingImage.set(false);
          input.value = '';
        }
      })
    }
  }

  // ======================================================== ERRORS

  // Método compartido para cualquier campo
  triggerShake ( fieldName: string ): void {
    this.shakingField.set(fieldName);
    setTimeout(() => this.shakingField.set(null), 400);
  }
}
