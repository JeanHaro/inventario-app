import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FormField } from '@angular/forms/signals';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// Componente Padre
import { Products } from './products';
// -> Componentes hijos
import { ProductsFilters } from './components/products-filters/products-filters';
import { ProductsTools } from './components/products-tools/products-tools';
import { ProductsTable } from './components/products-table/products-table';

// Drawers
import { ProductDetail } from './drawers/product-detail/product-detail';
// -> Componentes hijos
import { ProductVariantsPanel } from './drawers/product-detail/components/product-variants-panel/product-variants-panel';
import { ProductImagesPanel } from './drawers/product-detail/components/product-images-panel/product-images-panel';

import { ProductForm } from './drawers/product-form/product-form';
import { VariantDetail } from './drawers/variant-detail/variant-detail';
import { VariantForm } from './drawers/variant-form/variant-form';

// Componentes - Shared
import { Select } from '../../shared/components/select/select';
import { SkeletonTable } from '../../shared/components/skeleton-table/skeleton-table';

// Rutas
import { productsRoutes } from './products.routes';

// Pipes
import { CompactNumberPipe } from '../../shared/pipes/compact-number/compact-number.pipe';

@NgModule({
  declarations: [
    Products,
    ProductsFilters,
    ProductsTools,
    ProductsTable,

    // Drawers
    ProductDetail,
    ProductForm,
    VariantDetail,
    VariantForm,
    ProductVariantsPanel,
    ProductImagesPanel,
  ],
  imports: [
    CommonModule,
    FormsModule,
    FormField,
    FontAwesomeModule,
    // Shared
    Select,
    SkeletonTable,
    CompactNumberPipe,

    // Rutas
    RouterModule.forChild(productsRoutes),
  ],
})
export class ProductsModule {}
