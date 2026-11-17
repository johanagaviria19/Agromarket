import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const rolGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const usuario = auth.usuario();

  if (!usuario) {
    router.navigate(['/']);
    return false;
  }

  const rolRequerido = route.data['rol'] as 'agricultor' | 'comprador';

  if (usuario.rol === rolRequerido) {
    return true;
  }

  if (usuario.rol === 'agricultor') {
    router.navigate(['/dashboard-agricultor']);
  } else {
    router.navigate(['/dashboard-comprador']);
  }
  return false;
};
