import {
  Component,
  computed,
  ElementRef,
  input,
  output,
  signal,
  viewChildren
} from '@angular/core';

@Component({
  selector: 'shared-otp-input',
  standalone: true,
  imports: [],
  templateUrl: './otp-input.html',
  styleUrl: './otp-input.scss',
})
export class OtpInput {
  // TODO: VIEWCHILDREN
  // referencias a los <input> para manejar el foco
  readonly boxRefs = viewChildren<ElementRef<HTMLInputElement>>('box');

  // TODO: INPUT Y OUTPUT
  readonly length = input<number>(6); // cantidad de cuadros
  readonly codeChange = output<string>(); // se emite en cada cambio (para validar largo, limpiar error, etc.)
  readonly completed = output<string>(); // Se emite solo cuando todos los cuadros están llenos

  // TODO: SIGNAL
  digits = signal<string[]>(Array(this.length()).fill('')); // guarda el valor de cada cuadro por separado, ej: ['1', '2']

  // TODO: COMPUTED
  // genera [0, 1, 2, 3] a partir de length, es para que el for sepa cuantos cuadros dibujar
  readonly indexes = computed(() => Array.from(
    { length: this.length() },
    (_, i) => i
  ));

  // TODO: MÉTODOS PRIVADOS
  // Juntamos el arreglo digits en un solo string y decide cual de los dos outputs emitimos al padre
  private emitChanges(): void {
    const code = this.digits().join('');
    this.codeChange.emit(code);

    // Emitimos completed solo si ya no quedan cuadros vacíos
    if ( code.length === this.length() && !code.includes('') ) {
      this.completed.emit(code);
    }
  }

  // TODO: MÉTODOS PÚBLICOS
  // Se ejecuta cada vez que el usuario escribe un cuadro
  onInput( event: Event, index: number ): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/[^0-9]/g, '').slice(-1); // Solo el último digito numérico

    input.value = value;

    // Guardamos el digito en su posición
    this.digits.update(arr => {
      const copy = [...arr];
      copy[index] = value;

      return copy;
    });

    // Avisamos que el código cambió
    this.emitChanges();

    // Si el cuadro no era el último salta al siguiente cuadro automáticamente
    if ( value && index < this.length() - 1 ) {
      this.boxRefs()[index + 1]?.nativeElement.focus();
    }
  }

  // Se ejecuta al presionar una tecla dentro de un cuadro
  onKeydown ( event: KeyboardEvent, index: number ): void {
    // Si presionamos backspace (tecla de retroceso o borrado) salta el foco hacia el anterior cuadro, si tiene contenido en el cuadro lo borra
    if (
      event.key === 'Backspace' &&
      !this.digits()[index] &&
      index > 0
    ) {
      this.boxRefs()[index - 1]?.nativeElement.focus();
    }
  }

  // Se ejecuta si el usuario pega el codigo completo en algún cuadro
  onPaste ( event: ClipboardEvent ): void {
    event.preventDefault();

    const pasted = event.clipboardData?.getData('text').replace(/[^0-9]/g, '') ?? '';

    if ( !pasted ) return;

    const newDigits = pasted.slice(0, this.length()).split('');

    // Guardamos los digitos en cada posición
    this.digits.set([
      ...newDigits,
      ...Array(this.length() - newDigits.length).fill('')
    ]);

    // Avisamos que el código cambió
    this.emitChanges();

    // Dejamos el foco en el siguiente cuadro vacío o en el último si se llenot odos los cuadros
    const focusIndex = Math.min(newDigits.length, this.length() - 1);
    this.boxRefs()[focusIndex]?.nativeElement.focus();
  }
}
