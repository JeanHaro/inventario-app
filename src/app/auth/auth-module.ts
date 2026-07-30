import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FormField } from "@angular/forms/signals";

// Font Awesome
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// Componentes
import { Auth } from './auth';

// Componentes - Hijo
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';

// Componentes - Shared
import { OtpInput } from '../shared/components/otp-input/otp-input';

// Rutas
import { AuthRoutes } from './auth.routes';


@NgModule({
  declarations: [
    Auth,
    Login,
    Register]
    ,
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    FormField,

    // Shared
    OtpInput,

    // Rutas
    RouterModule.forChild(AuthRoutes),
]
})
export class AuthModule {}
