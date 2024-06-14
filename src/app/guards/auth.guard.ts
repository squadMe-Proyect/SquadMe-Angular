import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from '../services/api/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

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
      
      // Utilizamos `this.auth.isConnected$` para obtener el estado de autenticación del usuario.
      return this.auth.isConnected$.pipe(map(connected => {
        
        // Si `connected` es `null`, redirigimos al usuario a la página de splash.
        if (connected == null) {
          this.router.navigate(['/splash']);
        } 
        
        // Si `connected` es `false`, redirigimos al usuario a la página de inicio de sesión.
        else if (!connected) {
          this.router.navigate(['/login']);
        }
        
        // Retornamos `true` si `connected` es `null`, `false` o `true`.
        return connected == null || connected == false || connected == true;
      }));
  }
}