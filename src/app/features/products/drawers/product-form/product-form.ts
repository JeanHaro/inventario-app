import { Component, signal } from '@angular/core';

// Font Awesome
import {
  faArrowRightFromBracket,
  IconDefinition
} from '@fortawesome/free-solid-svg-icons';

// Interfaces
import { SelectOption } from '../../../../shared/components/select/models/select.model';
import {
  Category,
  ProductState
} from '../../models/products.model';
import { form, min, required } from '@angular/forms/signals';

@Component({
  selector: 'product-form',
  standalone: false,
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss',
})
export class ProductForm {
  // TODO: ICONOS
  readonly faArrowRightFromBracket: IconDefinition = faArrowRightFromBracket;

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
    required( schemaPath.nombre, { message: 'El nombre es obligatorio' });
    required( schemaPath.marca, { message: 'La marca es obligatoria' });
    required( schemaPath.precio, { message: 'El precio es obligatorio' });
    required( schemaPath.categoria, { message: 'La categoría es obligatoria' });
    required( schemaPath.estado, { message: 'El estado es obligatorio' });
    min( schemaPath.precio, 0, { message: 'El precio no puede ser negativo' });
    min( schemaPath.descuento, 0, { message: 'El descuento no puede ser negativo' });
  });

  // TODO: MÉTODOS PÚBLICOS
  // ========================================================== SELECTS
  updateState ( valor: string ): void {
    this.editModel.update( m => ({ ...m, estado: valor as ProductState }) );
  }

  updateCategory ( valor: string ): void {
    this.editModel.update( m => ({ ...m, categoria: valor as Category }) );
  }
}
