import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { delay, of } from 'rxjs';

/**
 * Página de bienvenida que muestra un splash screen.
 * Redirige automáticamente a la página de inicio después de un cierto tiempo.
 */
@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {

  /**
   * Constructor de SplashPage.
   * @param router Servicio de enrutamiento de Angular (`Router`).
   */
  constructor(private router: Router) { }

  /**
   * Método del ciclo de vida de Angular que se llama al inicializarse el componente.
   * Realiza una redirección después de un breve retraso.
   */
  ngOnInit() {
    // Utiliza un observable con un valor vacío y un retraso de 2000 milisegundos
    of('').pipe(delay(2000)).subscribe(_=> {
      // Navega hacia la página de inicio ('/home') después de completarse el retraso
      this.router.navigate(['/home']);
    });
  }

}
