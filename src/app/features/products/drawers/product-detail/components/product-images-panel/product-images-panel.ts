import {
  Component,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild
} from '@angular/core';

// FontAwesome
import {
  faPlus,
  faSpinner,
  faTrash,
  IconDefinition
} from '@fortawesome/free-solid-svg-icons';

// Servicios
import { InventarioService } from '../../../../services/inventario';

// Interfaces
import { Producto } from '../../../../models/products.model';

@Component({
  selector: 'app-product-images-panel',
  standalone: false,
  templateUrl: './product-images-panel.html',
  styleUrl: './product-images-panel.scss',
})
export class ProductImagesPanel {
  // TODO: INYECCIONES
  private readonly inventarioService = inject(InventarioService);

  // TODO: VIEWCHILD
  readonly fileInputRef = viewChild<ElementRef<HTMLInputElement>>('fileInputRef');

  // TODO: ICONOS
  readonly faPlus: IconDefinition = faPlus;
  readonly faTrash: IconDefinition = faTrash;
  readonly faSpinner: IconDefinition = faSpinner;


  // TODO: INPUT Y OUTPUT
  readonly images = input.required<string[]>();
  readonly productoId = input.required<number>();
  readonly productoActualizado = output<Producto>(); // Avisa al padre que el producto cambio

  // TODO: PROPIEDADES
  private readonly VALID_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif'
  ];
  private readonly MAX_SIZE_MB = 5;
  private readonly MAX_IMAGENES = 10;

  // TODO: SIGNALS
  subiendo = signal<boolean>(false);
  eliminando = signal<string | null>(null); // guarda la url de la imagen
  errorMessage = signal<string | null>(null); // mensaje de error

  // TODO: MÉTODOS PRIVADOS
  // Validamos el archivo
  private validateFile ( files: File[], input: HTMLInputElement ): boolean {
    // 1. Validamos cantidad máxima
    const espacioDisponible = this.MAX_IMAGENES - this.images().length;

    if ( files.length > espacioDisponible ) {
      this.errorMessage.set(
        `Solo puedes subir ${espacioDisponible} imagen(es) más. Ya tienes ${this.images().length} de ${this.MAX_IMAGENES} permitidas.`
      );

      input.value = '';
      return false;
    }

    // 2. Validar tipo y tamaño de cada archivo
    for ( const file of files ) {
      if ( !this.VALID_TYPES.includes(file.type) ) {
        this.errorMessage.set(
          `"${file.name}" no es formato válido.`
        );

        input.value = '';
        return false;
      }

      const sizeMB = file.size / (1024 * 1024);

      if ( sizeMB > this.MAX_SIZE_MB ) {
        this.errorMessage.set(
          `"${file.name}" pesa ${sizeMB.toFixed(1)}MB. El máximo permitido es ${this.MAX_SIZE_MB}MB.`
        );

        input.value = '';
        return false;
      }
    }

    return true;
  }

  // TODO: MÉTODOS PÚBLICOS

  // Abre el selector de archivos nativo
  abrirSelector(): void {
    this.fileInputRef()?.nativeElement.click();
  }

  // Cuando el usuario selecciona archivos
  onFilesSelected ( event: Event ): void {
    const input = event.target as HTMLInputElement;
    if ( !input.files || input.files.length === 0 ) return;

    this.errorMessage.set(null); // Limpia el error anterior

    const files = Array.from(input.files);
    const validation = this.validateFile(files, input);

    // 3. Si es todo válido, subimos al backend
    if ( validation ) {
      const formData = new FormData();
      files.forEach( file => formData.append('imagenes', file) );

      this.subiendo.set(true);

      this.inventarioService.subirImagenesProducto(
        this.productoId().toString(),
        formData
      ).subscribe({
        next: ( resp ) => {
          this.productoActualizado.emit(resp.producto);
          this.subiendo.set(false);
          input.value = ''; // permite volver a seleccionar el mismo archivo despues
        },
        error: ( err ) => {
          // Si el backend rechaza por alguna razón que el cliente no detecto
          this.errorMessage.set(
            err.message ?? 'Ocurrió un error al subir las imágenes.'
          );

          this.subiendo.set(false);
          input.value = '';
        }
      });
    }
  }

  // Eliminar una imagen existente
  eliminarImagen ( url: string ): void {
    this.eliminando.set(url);
    this.errorMessage.set(null);

    this.inventarioService.eliminarImagenProducto(
      this.productoId().toString(),
      url
    ).subscribe({
      next: ( resp ) => {
        this.productoActualizado.emit(resp.producto);
        this.eliminando.set(null);
      },
      error: () => this.eliminando.set(null)
    });
  }
}
