import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// Componente Padre
import { Products } from './products';
// Componentes hijos
import { ProductsFilters } from './components/products-filters/products-filters';
import { ProductsTools } from './components/products-tools/products-tools';
import { ProductsTable } from './components/products-table/products-table';
// Modals
import { ProductDetail } from './modals/product-detail/product-detail';
import { ProductForm } from './modals/product-form/product-form';
import { VariantDetail } from './modals/variant-detail/variant-detail';
import { VariantForm } from './modals/variant-form/variant-form';

// Rutas
import { productsRoutes } from './products.routes';

// Modulos
import { SharedModule } from '../../shared/shared-module';



@NgModule({
  declarations: [
    Products,
    ProductsFilters,
    ProductsTools,
    ProductsTable,

    // Modals
    ProductDetail,
    ProductForm,
    VariantDetail,
    VariantForm,
  ],
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    SharedModule,

    // Rutas
    RouterModule.forChild(productsRoutes),
  ],
})
export class ProductsModule {}
