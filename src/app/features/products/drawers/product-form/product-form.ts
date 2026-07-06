import { Component, inject, output, signal } from '@angular/core';

// Font Awesome
import {
  faArrowRightFromBracket,
  faSpinner,
  IconDefinition
} from '@fortawesome/free-solid-svg-icons';

// Interfaces
import { SelectOption } from '../../../../shared/components/select/models/select.model';
import {
  Category,
  Product,
  ProductState
} from '../../models/products.model';
import { form, min, required, validate } from '@angular/forms/signals';

// Servicios
import { InventarioService } from '../../services/inventario';

@Component({
  selector: 'product-form',
  standalone: false,
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss',
})
export class ProductForm {
  // TODO: INYECCIONES
  private readonly inventarioService = inject(InventarioService);

  // TODO: ICONOS
  readonly faArrowRightFromBracket: IconDefinition = faArrowRightFromBracket;
  readonly faSpinner: IconDefinition = faSpinner;

  // TODO: OUTPUT
  readonly closeModal = output<void>();
  readonly productCreated = output<Product>(); // Avisamos que creamos el producto

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
  saving = signal<boolean>(false);
  shakingField = signal<string | null>(null); // Errors

  // Modelo del nuevo producto - se inicia vacío
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
  tagsInput = signal<string>(''); // Etiquetas separadas por comas

  // El form de signalForms se construye sobre editModel
  editForm = form(this.editModel, ( schemaPath ) => {
    required( schemaPath.precio, { message: 'El precio es obligatorio' });
    required( schemaPath.categoria, { message: 'La categoría es obligatoria' });
    required( schemaPath.estado, { message: 'El estado es obligatorio' });
    min( schemaPath.precio, 0, { message: 'El precio no puede ser negativo' });
    min( schemaPath.descuento, 0, { message: 'El descuento no puede ser negativo' });

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

  // TODO: MÉTODOS PÚBLICOS
  // ========================================================== SELECTS
  updateState ( valor: string ): void {
    this.editModel.update( m => ({ ...m, estado: valor as ProductState }) );
  }

  updateCategory ( valor: string ): void {
    this.editModel.update( m => ({ ...m, categoria: valor as Category }) );
  }

  // ========================================================== CREAR PRODUCTO

  createProduct(): void {
    if ( !this.editForm().valid() ) return;

    this.saving.set(true);

    const valores = this.editModel();

    const etiquetas = this.tagsInput().split(',').map( tag => tag.trim() ).filter(
      tag => tag.length > 0
    );

    this.inventarioService.createProduct({
      ...valores,
      nombre: valores.nombre.trim(),
      marca: valores.marca.trim(),
      etiquetas,
      variantes: []
    }).subscribe({
      next: ( resp ) => {
        this.productCreated.emit(resp); // avisamos al padre que creamos el producto
        this.saving.set(false);
      },
      error: () => {
        this.saving.set(false);
      }
    })
  }

  // ======================================================== ERRORS

  // Método compartido para cualquier campo
  triggerShake ( fieldName: string ): void {
    this.shakingField.set(fieldName);
    setTimeout(() => this.shakingField.set(null), 400);
  }
}
