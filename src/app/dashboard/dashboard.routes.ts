import { Routes } from '@angular/router';

// Componentes
import { DashboardLayout } from './layout/dashboard-layout/dashboard-layout';

export const DashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardLayout,
    children: [
      {
        path: '',
        redirectTo: 'products',
        pathMatch: 'full'
      },
      {
        path: 'products',
        loadChildren: () => import('../features/products/products-module').then(m => m.ProductsModule)
      }
    ]
  }
];
