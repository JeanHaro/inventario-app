import { Routes } from '@angular/router';

// Componente
import { Auth } from './auth';
// Componentes hijos
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';

// Componentes

export const AuthRoutes: Routes = [
  {
    path: '',
    component: Auth,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        component: Login
      },
      {
        path: 'register',
        component: Register
      }
    ]
  }
];
