import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-auth',
  standalone: false,
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
})
export class Auth {
  // TODO: INYECCIONES
  private readonly router = inject(Router);

  // TODO: toSignal
  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter( (e) => e instanceof NavigationEnd ),
      map( () => this.router.url )
    ),
    { initialValue: this.router.url }
  );

  // TODO: COMPUTED

  // Es true cuando la ruta activa es register
  readonly isRegisterRoute = computed(() =>
    this.currentUrl().includes('register')
  );
}
