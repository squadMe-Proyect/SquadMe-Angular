import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Servicio abstracto para manejar operaciones relacionadas con medios (como imágenes, videos, etc.).
 * Implementado por servicios concretos de medios.
 */
@Injectable({
  providedIn: 'root'
})
export abstract class MediaService {

  /**
   * Método abstracto para subir un blob (objeto binario grande) a un servidor de medios.
   * @param blob Blob que se va a subir al servidor de medios.
   * @returns Observable que emite un array de números representando el progreso de la carga.
   */
  public abstract upload(blob: Blob): Observable<number[]>;

}
