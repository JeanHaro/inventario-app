import { Component, signal } from '@angular/core';
import { form, required, validate } from '@angular/forms/signals';

// Font Awesome
import {
  faCheck,
  faEnvelopeOpen,
  faLock,
  faSpinner,
  IconDefinition
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  // TODO: ICONOS
  readonly faEnvelopeOpen: IconDefinition = faEnvelopeOpen;
  readonly faLock: IconDefinition = faLock;
  readonly faCheck: IconDefinition = faCheck;
  readonly faSpinner: IconDefinition = faSpinner;

  // TODO: SIGNALS
  saving = signal<boolean>(false); // Carga del login
  shakingField = signal<string | null>(null); // Guarda cual campo está temblando

  step = signal<'credenciales' | 'otp'>('credenciales'); // Control si mostramos formulario de credenciales o panel de codigo OTP
  otpCode = signal<string>(''); // guarda el codigo completo
  verifyingOtp = signal<boolean>(false); // mientras esperamos la respuesta del backend para verificar el codigo OTP
  otpError = signal<string | null>(null); // mensaje de error si el codigo OTP fue incorrecto

  // Modelo de datos del formulario
  loginModel = signal({
    email: '',
    password: ''
  });

  // conecta el loginModel para las reglas de validacion
  loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.email, { message: 'El correo es obligatorio' });
    required(schemaPath.password, { message: 'La contraseña es obligatorio' });
    validate(schemaPath.email, ({ value }) => {
      const email = value().trim();
      if ( email.length === 0 ) return null; // El required ya cubre el vacío

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if ( !emailRegex.test(email) ) {
        return {
          kind: 'invalidEmail',
          message: 'Ingresa un correo válido'
        };
      }

      return null;
    });
  });

  // TODO: MÉTODOS
  // Activa la animación de shake en el campo indicado por 400ms y luego apaga solo
  triggerShake ( fieldName: string ): void {
    this.shakingField.set(fieldName);
    setTimeout(() => this.shakingField.set(null), 400);
  }

  // Se ejecuta al enviar el formulario de credenciales
  onSubmit(): void {
    if ( this.loginForm().invalid() ) return;

    this.saving.set(true);

    // TODO: Cuando exista el endpoint, aquí llamas a login(email, password).
    // Si el backend confirma las credenciales, ahí recién avanzas al paso 'otp'.
    // Por ahora avanzamos directo para poder ver el flujo funcionando:
    this.saving.set(false);
    this.step.set('otp');
  }

  // Se ejecuta cada vez que el shared-otp-input emite un cambio de codigo
  onOtpChange ( code: string ): void {
    this.otpCode.set(code); // guarda el codigo actual
    this.otpError.set(null); // limpia el error
  }

  // Se ejecuta solo cuando el shared-otp-input avisa que ya se llenaron todos los digitos
  onOtpCompleted ( code: string ): void {
    this.otpCode.set(code);
    // Opcional: podrías llamar directo a verifyOtp() aquí para un UX "sin botón"
  }

  // Se ejecuta al hacer click en "Confirmar codigo"
  verifyOtp(): void {
    // Si el codigo tiene menos de 6 digitos
    if ( this.otpCode().length < 6 ) return;

    this.verifyingOtp.set(true);

    // TODO: authService.verifyOtp(email, this.otpCode()).subscribe({
    //   next: () => { /* navegar al dashboard */ },
    //   error: () => {
    //     this.verifyingOtp.set(false);
    //     this.otpError.set('El código ingresado no es correcto');
    //   }
    // });
  }
}
