import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from '../services/api/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  /**
   * Método que determina si se permite la activación de la ruta.
   * @param route El snapshot de la ruta que se intenta activar.
   * @param state El estado de la ruta actual.
   * @returns Un Observable, Promise, boolean o UrlTree que indica si la ruta se puede activar.
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      
      // Utilizamos `this.auth.user$` para obtener el usuario actual del servicio de autenticación.
      return this.auth.user$.pipe(map(user => {
        
        // Si el usuario es `null` o tiene el rol de 'PLAYER', redirigimos al usuario a la página de inicio.
        if (user == null || user.role == 'PLAYER') {
          this.router.navigate(['/home']);
        }
        
        // Retornamos `true` si el usuario no es `null`.
        return user != null;
      }));
  }
}
