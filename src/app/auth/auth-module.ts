import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FormField } from "@angular/forms/signals";

// FontAwesome
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// Componentes
import { Auth } from './auth';

// Componentes - Hijo
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';

// Componentes - Shared
import { OtpInput } from '../shared/components/otp-input/otp-input';
import { Select } from '../shared/components/select/select';

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
    Select,

    // Rutas
    RouterModule.forChild(AuthRoutes),
]
})
export class AuthModule {}
