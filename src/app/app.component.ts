import { Component } from '@angular/core';
import { AuthService } from './services/api/auth.service';
import { Router } from '@angular/router';
import { IonMenu } from '@ionic/angular';
import { delay, tap } from 'rxjs/operators';
import { CustomTranslateService } from './services/auxiliar/custom-translate.service';
import { of } from 'rxjs';

/**
 * Componente principal de la aplicación.
 * Controla la navegación, autenticación y configuración de idioma.
 */
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  lang: string = "es"; // Idioma actual de la aplicación

  constructor(
    public translate: CustomTranslateService, // Servicio de traducción personalizado
    public auth: AuthService, // Servicio de autenticación
    private router: Router // Servicio de enrutamiento
  ) {
    translate.use(this.lang); // Establece el idioma inicial utilizando el servicio de traducción
  }

  /**
   * Cambia el idioma de la aplicación y actualiza el servicio de traducción.
   * @param lang Nuevo idioma seleccionado.
   * @returns False para evitar el comportamiento predeterminado del evento click.
   */
  onLang(lang: string): boolean {
    this.lang = lang;
    this.translate.use(this.lang); // Actualiza el idioma en el servicio de traducción
    return false; // Evita el comportamiento predeterminado del evento click
  }

  /**
   * Cierra el menú lateral después de un breve retraso.
   * @param menu Componente IonMenu del cual se va a cerrar.
   */
  close(menu: IonMenu): void {
    of('').pipe(delay(500), tap(_ => menu.close())).subscribe(); // Cierra el menú después de un retraso de 500ms
  }

  /**
   * Cierra sesión del usuario actual y redirige a la página de inicio de sesión.
   * @param menu Componente IonMenu del cual se va a cerrar después de cerrar sesión.
   */
  onSignOut(menu: IonMenu): void {
    this.auth.logout().subscribe(async _ => {
      await this.router.navigate(['/login']); // Navega a la página de inicio de sesión después de cerrar sesión
      menu.close(); // Cierra el menú lateral
    });
  }

  /**
   * Verifica si la ruta actual incluye la ruta especificada.
   * @param path Ruta que se desea verificar si está incluida en la ruta actual.
   * @returns True si la ruta actual incluye la ruta especificada, False de lo contrario.
   */
  routeInclude(path: string): boolean {
    return this.router.url.includes(path); // Verifica si la ruta actual incluye la ruta especificada
  }

  /**
   * Navega a la página de perfil del usuario.
   */
  toProfile(): void {
    this.router.navigate(['/user']); // Navega a la página de perfil del usuario
  }
}