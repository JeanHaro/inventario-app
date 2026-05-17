import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// Componente Padre
import { Products } from './products';
// Componentes Hijos
import { ProductsFilters } from './components/products-filters/products-filters';
import { ProductsForm } from './components/products-form/products-form';
import { ProductsCard } from './components/products-card/products-card';

// Rutas
import { productsRoutes } from './products.routes';

@NgModule({
  declarations: [
    Products,
    ProductsFilters,
    ProductsForm,
    ProductsCard
  ],
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    RouterModule.forChild(productsRoutes)
  ],
})
export class ProductsModule {}
