import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { MediaService } from '../api/media.service';
import { Observable } from 'rxjs';

/**
 * Servicio para la gestión de medios utilizando Firebase Storage.
 * Implementa métodos para cargar imágenes en Firebase Storage.
 */
@Injectable({
  providedIn: 'root'
})
export class MediaFirebaseService extends MediaService {

  constructor(
    private fbSvc: FirebaseService
  ) {
    super();
  }

  /**
   * Sube un archivo blob a Firebase Storage.
   * @param blob Archivo blob a cargar.
   * @returns Observable que emite un array de números representando el estado de la carga.
   */
  public override upload(blob: Blob): Observable<number[]> {
    return new Observable<number[]>(obs => {
      // Realiza la carga de la imagen utilizando el servicio FirebaseService
      this.fbSvc.imageUpload(blob).then(object => {
        obs.next(object); // Emite el objeto resultante de la carga
        obs.complete(); // Completa el observable
      }).catch(err => {
        obs.error(err); // Emite un error si ocurre algún problema durante la carga
      });
    });
  }
}
