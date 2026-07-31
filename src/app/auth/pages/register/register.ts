import { Component, computed, signal } from '@angular/core';

// Font Awesome
import {
  faCheck,
  faEnvelopeOpen,
  faLock,
  faSpinner,
  faUser,
  faUserShield,
  IconDefinition
} from '@fortawesome/free-solid-svg-icons';

// Models
import {
  ROLE_OPTIONS,
  UserRole
} from '../../../shared/models/role.model';
import { form, required, validate } from '@angular/forms/signals';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  // TODO: ICONOS
  readonly faEnvelopeOpen: IconDefinition = faEnvelopeOpen;
  readonly faLock: IconDefinition = faLock;
  readonly faCheck: IconDefinition = faCheck;
  readonly faUser: IconDefinition = faUser;
  readonly faUserShield: IconDefinition = faUserShield;
  readonly faSpinner: IconDefinition = faSpinner;

  // TODO: PROPIEDADES
  readonly roleOptions = ROLE_OPTIONS;

  // TODO: SIGNAL
  saving = signal<boolean>(false); // carga al crear el usuario
  shakingField = signal<string | null>(null); // campo que está temblando

  // Modelo de datos del formulario
  registerModel = signal({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '' as UserRole | ''
  });

  // Conecta el registerModel con las reglas de validacion
  registerForm = form(this.registerModel, (schemaPath) => {
    required(schemaPath.role, { message: 'Selecciona un rol' });

    validate(schemaPath.username, ({ value }) => {
      if (value().trim().length === 0) {
        return {
          kind: 'required',
          message: 'El username es obligatorio y no puede contener valores en blanco'
        };
      }

      return null;
    });

    validate(schemaPath.email, ({ value }) => {
      const email = value().trim();
      if (email.length === 0) {
        return {
          kind: 'required',
          message: 'El correo es obligatorio y no puede contener valores en blanco'
        };
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if ( !emailRegex.test(email) ) {
        return {
          kind: 'invalidEmail',
          message: 'Ingresa un correo válido'
        };
      }

      return null;
    });

    validate(schemaPath.password, ({ value }) => {
      const password = value();
      if (password.trim().length === 0) {
        return {
          kind: 'required',
          message: 'La contraseña es obligatoria y no puede contener valores en blanco'
        };
      }

      if ( password.length < 8 ) {
        return {
          kind: 'tooShort',
          message: 'Debe tener al menos 8 caracteres'
        }
      }

      return null;
    });

    validate(schemaPath.confirmPassword, ({ value }) => {
      if (value().trim().length === 0) {
        return {
          kind: 'required',
          message: 'Confirma la contraseña'
        };
      }

      return null;
    });
  });

  // TODO: COMPUTED

  // Las contraseñas no coinciden
  readonly passwordMismatch = computed<boolean>(() => {
    const { password, confirmPassword } = this.registerModel();

    return confirmPassword.length > 0 && password !== confirmPassword;
  });

  // TODO: MÉTODOS PÚBLICOS

  // Se ejecuta cuando el shared-select de rol cambia
  updateRole ( value: string ): void {
    this.registerModel.update( m => ({ ...m, role: value as UserRole }) );
  }

  // Activa la animación de shake en el campo indicado
  triggerShake ( fieldName: string ): void {
    this.shakingField.set(fieldName);
    setTimeout(() => this.shakingField.set(null), 400);
  }

  // Se ejecuta al enviar el formulario
  onSubmit(): void {
    if ( this.registerForm().invalid() || this.passwordMismatch() ) return;

    this.saving.set(true);

    // TODO: cuando exista el endpoint, aquí llamas a authService.createUser(...)
    // .subscribe({
    //   next: () => { this.saving.set(false); /* volver al listado de usuarios */ },
    //   error: (err) => { this.saving.set(false); /* mostrar error */ }
    // });
  }
}
