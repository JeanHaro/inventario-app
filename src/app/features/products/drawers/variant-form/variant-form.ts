import {
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
  untracked,
  viewChild
} from '@angular/core';

import { form, min, required, validate } from '@angular/forms/signals';

// FontAwesome
import {
  faArrowRightFromBracket,
  faCamera,
  faSpinner,
  IconDefinition
} from '@fortawesome/free-solid-svg-icons';

// Servicios
import { InventarioService } from '../../services/inventario';

// Interfaces
import { Product, VariantState } from '../../models/products.model';
import { SelectOption } from '../../../../shared/components/select/models/select.model';

@Component({
  selector: 'variant-form',
  standalone: false,
  templateUrl: './variant-form.html',
  styleUrl: './variant-form.scss',
})
export class VariantForm {
  // TODO: INYECCIONES
  private readonly inventarioService = inject(InventarioService);
  private readonly destroyRef = inject(DestroyRef);

  // TODO: VIEWCHILD
  readonly imageInputRef = viewChild<ElementRef<HTMLInputElement>>('imageInputRef');

  // TODO: ICONOS
  readonly faArrowRightFromBracket: IconDefinition = faArrowRightFromBracket;
  readonly faCamera: IconDefinition = faCamera;
  readonly faSpinner: IconDefinition = faSpinner;

  // TODO: INPUT Y OUTPUT
  readonly productId = input.required<number>();
  readonly productName = input.required<string>();
  readonly closeModal = output<void>();
  readonly variantCreated = output<Product>();

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

  private readonly VALID_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif'
  ];
  private readonly MAX_SIZE_MB = 5;

  // TODO: SIGNALS
  saving = signal<boolean>(false);
  rawServerError = signal<string | null>(null); // Mensaje crudo del backend
  shakingField = signal<string | null>(null); // Errors

  editModel = signal({
    nombre: '',
    sku: '',
    estado: '' as VariantState,
    stock: 0,
    precioAdicional: 0,
    talla: '',
    color: '',
    capacidad: ''
  });

  editForm = form( this.editModel, ( schemaPath ) => {
    required( schemaPath.estado, { message: 'El estado es obligatorio' } );
    required( schemaPath.stock, { message: 'El stock es obligatorio' } );
    required( schemaPath.precioAdicional, { message: 'El precio es obligatorio' } );
    min( schemaPath.stock, 0, { message: 'El stock no puede ser negativo' } );
    min( schemaPath.precioAdicional, 0, { message: 'El precio no puede ser negativo' } );

    validate( schemaPath.nombre, ({ value }) => {
      if ( value().trim().length === 0 ) {
        return {
          kind: 'whitespace',
          message: 'El nombre es obligatorio'
        }
      }

      return null;
    });

    validate( schemaPath.sku, ({ value }) => {
      if ( value().trim().length === 0 ) {
        return {
          kind: 'whitespace',
          message: 'El SKU es obligatorio'
        }
      }

      return null;
    });
  });

  // ========================================================= IMAGEN
  private currentPreviewUrl: string | null = null; // guarda la URL activa para poder revocarla
  selectedImage = signal<File | null>(null);
  imageError = signal<String | null>(null);

  // TODO: COMPUTED

  // Preview local — no se sube hasta que se crea la variante
  readonly imagePreviewUrl = computed<string | null>(() => {
    this.selectedImage(); // dependencia — se recalcula cuando cambia la imagen
    return this.currentPreviewUrl;
  });

  // ============================================================ SKU

  // Solo se muestra en la zona del SKU si el mensaje del backend menciona el SKU
  readonly skuServerError = computed<string | null>(() => {
    const msg = this.rawServerError();
    if ( msg && msg.toLowerCase().includes('sku') ) return msg;
    return null;
  });

  // Cualquier otro error del servidor que no sea sobre el SKU
  readonly generalServerError = computed<string | null>(() => {
    const msg = this.rawServerError();
    if ( msg && !msg.toLowerCase().includes('sku') ) return msg;
    return null;
  });

  // TODO: EFFECTS
  // ======================================================== IMAGEN

  // Genera la preview y libera la URL anterior antes de crear una nueva
  private readonly managePreviewUrl = effect(() => {
    const file = this.selectedImage();

    // Libera la URL anterior si existía
    if ( this.currentPreviewUrl ) {
      URL.revokeObjectURL(this.currentPreviewUrl);
      this.currentPreviewUrl = null;
    }

    if ( file ) {
      this.currentPreviewUrl = URL.createObjectURL(file);
    }
  });

  // ======================================================== SKU

  // Si el usuario modifica el SKU mientras hay un error de servidor, lo limpiamos
  private readonly clearSkuServerError = effect(() => {
    this.editForm.sku().value(); // única dependencia real

    untracked(() => {
      if ( this.rawServerError() !== null ) {
        this.rawServerError.set(null);
      }
    });
  });

  // TODO: HOOKS

  constructor() {
    // Liberamos la última URL activa al destruir el componente
    this.destroyRef.onDestroy(() => {
      if ( this.currentPreviewUrl ) {
        URL.revokeObjectURL(this.currentPreviewUrl);
      }
    });
  }


  // TODO: MÉTODOS PRIVADOS
  // ========================================================= IMAGEN
  validateFile ( file: File, input: HTMLInputElement ): boolean {
    this.imageError.set(null);

    if ( !this.VALID_TYPES.includes(file.type) ) {
      this.imageError.set(`"${file.name}" no es un formato válido.`);
      input.value = '';

      return false;
    }

    const sizeMB = file.size / (1024 * 1024);
    if ( sizeMB > this.MAX_SIZE_MB ) {
      this.imageError.set(`"${file.name}" pesa ${sizeMB.toFixed(1)}MB. El máximo permitido es ${this.MAX_SIZE_MB}MB.`);
      input.value = '';

      return false;
    }

    return true;
  }

  // TODO: MÉTODOS PÚBLICOS
  // ========================================================== SELECTS

  updateState ( valor: string ): void {
    this.editModel.update( m => ({ ...m, estado: valor as VariantState }) );
  }

  // ========================================================= IMAGEN

  // Abrir el input file
  openImageSelector(): void {
    this.imageInputRef()?.nativeElement.click();
  }

  // Seleccionamos la imagen
  onImageSelected ( event: Event ): void {
    const input = event.target as HTMLInputElement;
    if ( !input.files || input.files.length === 0 ) return;

    const file = input.files[0];

    const validation = this.validateFile(file, input);

    if ( validation ) {
      this.selectedImage.set(file);
      input.value = '';
    }
  }

  // ========================================================== CREAR VARIANTE

  // Crear variante
  createVariant(): void {
    if ( !this.editForm().valid() ) return;

    this.saving.set(true);
    this.rawServerError.set(null);

    const valores = this.editModel();
    const formData = new FormData();

    formData.append('nombre', valores.nombre.trim());
    formData.append('sku', valores.sku.trim());
    formData.append('estado', valores.estado);
    formData.append('stock', valores.stock.toString());
    formData.append('precioAdicional', valores.precioAdicional.toString());

    if ( valores.talla.trim() ) formData.append('talla', valores.talla.trim());
    if ( valores.color.trim() )  formData.append('color', valores.color.trim());
    if ( valores.capacidad.trim() ) formData.append('capacidad', valores.capacidad.trim());

    const imagen = this.selectedImage();
    if ( imagen ) formData.append('imagen', imagen);

    this.inventarioService.createVariant(
      this.productId().toString(),
      formData
    ).subscribe({
      next: ( resp ) => {
        this.variantCreated.emit(resp);
        this.saving.set(false);
      },
      error: ( err ) => {
        this.saving.set(false);
        this.rawServerError.set( err.message ?? 'Ocurrió un error al crear la variante' );
      }
    });
  }

  // ======================================================== ERRORS
  
  // Método compartido para cualquier campo
  triggerShake ( fieldName: string ): void {
    this.shakingField.set(fieldName);
    setTimeout(() => this.shakingField.set(null), 400);
  }
}
