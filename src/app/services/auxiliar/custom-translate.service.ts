import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BehaviorSubject, lastValueFrom } from 'rxjs';

/**
 * Servicio personalizado para la gestión de traducciones utilizando ngx-translate.
 */
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@Injectable({
  providedIn: 'root'
})
export class CustomTranslateService {

  private _language = new BehaviorSubject<string>("es");
  public language$ = this._language.asObservable();

  constructor(
    private translate: TranslateService
  ) {
    this.init();
  }

  /**
   * Inicializa el servicio de traducción añadiendo idiomas y estableciendo el idioma por defecto.
   */
  private async init() {
    this.translate.addLangs(['es', 'en', 'fr', 'it']);
    this.translate.setDefaultLang(this._language.value);
  }

  /**
   * Cambia el idioma activo utilizado para las traducciones.
   * @param language Código del idioma a utilizar (ej. 'es', 'en', 'fr').
   */
  use(language: string) {
    lastValueFrom(this.translate.use(language)).then(_ => {
      this._language.next(language);
    });
  }

  /**
   * Obtiene la traducción de una clave específica.
   * @param key Clave de la traducción a obtener.
   * @returns Observable que emite la traducción correspondiente a la clave proporcionada.
   */
  get(key: string) {
    return this.translate.get(key);
  }
}