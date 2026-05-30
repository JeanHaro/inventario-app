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

// Rutas
import { productsRoutes } from './products.routes';

// Modulos
import { SharedModule } from '../../shared/shared-module';
import { ProductsTable } from './components/products-table/products-table';

@NgModule({
  declarations: [Products, ProductsFilters, ProductsTools, ProductsTable],
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
