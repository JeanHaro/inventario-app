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
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadChildren: () => import('../features/home/home-module').then(m => m.HomeModule)
      },
      {
        path: 'products',
        loadChildren: () => import('../features/products/products-module').then(m => m.ProductsModule)
      }
    ]
  }
];
