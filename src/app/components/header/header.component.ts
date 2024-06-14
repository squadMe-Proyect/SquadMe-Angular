import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

/**
 * El componente HeaderComponent es responsable de mostrar el encabezado de la aplicación.
 * Permite la selección de idioma y provee eventos para cerrar sesión y acceder al perfil.
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  /**
   * @Input name - Nombre del usuario que se muestra en el encabezado.
   */
  @Input() name: string | undefined;

  /**
   * @Input avatar - URL del avatar del usuario. Puede ser undefined o null.
   */
  @Input() avatar: string | undefined | null;

  /**
   * @Input teamName - Nombre del equipo al que pertenece el usuario. Puede ser undefined o null.
   */
  @Input() teamName: string | undefined | null;

  /**
   * @Input languages - Lista de idiomas disponibles para selección. Por defecto: ["es", "en", "fr", "it"].
   */
  @Input() languages: string[] = ["es", "en", "fr", "it"];

  /**
   * @Input languageSelected - Idioma seleccionado actualmente. Por defecto: "es".
   */
  @Input() languageSelected: string = "es";

  /**
   * @Output onSignout - Evento emitido cuando el usuario cierra sesión.
   */
  @Output() onSignout = new EventEmitter<void>();

  /**
   * @Output onProfile - Evento emitido cuando el usuario accede a su perfil.
   */
  @Output() onProfile = new EventEmitter<void>();

  /**
   * @Output onLanguage - Evento emitido cuando el usuario cambia de idioma.
   */
  @Output() onLanguage = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {}

  /**
   * Cambia el idioma seleccionado y emite el evento correspondiente.
   * @param lang - El idioma seleccionado.
   */
  setLanguage(lang: string) {
    this.languageSelected = lang;
    this.onLanguage.emit(lang);
  }
}