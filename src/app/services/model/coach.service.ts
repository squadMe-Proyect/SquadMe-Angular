import { Injectable } from '@angular/core';
import { FirebaseDocument, FirebaseService } from '../firebase/firebase.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Coach } from '../../interfaces/coach';
import { Unsubscribe } from 'firebase/firestore';

/**
 * Servicio para la gestión de datos de entrenadores.
 * Proporciona métodos para la creación, actualización, eliminación y obtención de datos de entrenadores.
 */
@Injectable({
  providedIn: 'root'
})
export class CoachService {

  private _coaches = new BehaviorSubject<Coach[]>([]); // BehaviorSubject para almacenar la lista de entrenadores
  public coaches$ = this._coaches.asObservable(); // Observable expuesto para recibir actualizaciones de la lista de entrenadores

  private unsubs: Unsubscribe | null = null; // Variable para almacenar la función de unsubscribe

  constructor(
    private fbSvc: FirebaseService, // Servicio de Firebase para la interacción con Firestore
  ) {
    // Suscribe el BehaviorSubject a la colección 'coaches' en Firebase
    this.unsubs = fbSvc.subscribeToCollection("coaches", this._coaches, this.mapCoaches);
  }

  /**
   * Convierte un documento de Firebase a un objeto Coach.
   * @param el Documento de Firebase que contiene los datos del entrenador.
   * @returns Objeto Coach generado a partir del documento.
   */
  private mapCoaches(el: FirebaseDocument): Coach {
    return {
      id: el.id,
      name: el.data['name'],
      surname: el.data['surname'],
      teamName: el.data['teamName'],
      email: el.data['email'],
      role: el.data['role'],
      nation: el.data['nation'],
      picture: el.data['picture']
    };
  }

  /**
   * Obtiene un entrenador específico por su ID.
   * @param id ID del entrenador a obtener.
   * @returns Observable que emite el entrenador encontrado o null si no se encontró.
   */
  getCoach(id: string): Observable<Coach | null> {
    return new Observable<Coach | null>(obs => {
      this.fbSvc.getDocument("coaches", id).then(doc => {
        const coach: Coach = this.mapCoaches(doc);
        obs.next(coach);
        obs.complete();
      }).catch(_ => {
        obs.next(null);
      });
    });
  }

  /**
   * Crea un nuevo entrenador en la colección 'coaches'.
   * @param user Datos del nuevo entrenador a crear.
   * @returns Observable que completa una vez que se ha creado el entrenador.
   */
  createCoach(user: Coach): Observable<void> {
    return new Observable<void>(obs => {
      var userWithoutId = { ...user };
      delete userWithoutId.id;
      this.fbSvc.createDocumentWithId("coaches", userWithoutId, user?.id!!).then(_ => {
        this.unsubs = this.fbSvc.subscribeToCollection("coaches", this._coaches, this.mapCoaches);
        obs.complete();
      }).catch(err => {
        obs.error(err);
      });
    });
  }

  /**
   * Actualiza los datos de un entrenador existente en la colección 'coaches'.
   * @param user Datos actualizados del entrenador.
   * @returns Observable que emite el entrenador actualizado una vez completada la operación.
   */
  updateCoach(user: Coach): Observable<Coach> {
    return new Observable<Coach>(obs => {
      this.fbSvc.updateDocument("coaches", user.id!!, user).then(_ => {
        this.unsubs = this.fbSvc.subscribeToCollection("coaches", this._coaches, this.mapCoaches);
        obs.next(user);
        obs.complete();
      }).catch(err => {
        obs.error(err);
      });
    });
  }

  /**
   * Elimina un entrenador de la colección 'coaches' y también elimina su usuario asociado.
   * @param user Entrenador a eliminar.
   * @returns Observable que completa una vez que se ha eliminado el entrenador.
   */
  deleteCoach(user: Coach): Observable<void> {
    return new Observable<void>(obs => {
      this.fbSvc.deleteDocument("coaches", user.id!!).then(_ => {
        this.unsubs = this.fbSvc.subscribeToCollection("coaches", this._coaches, this.mapCoaches);
        obs.complete();
      }).catch(err => {
        obs.error(err);
      });
      this.fbSvc.deleteUser().then().catch(err => {
        obs.error(err);
      });
    });
  }
}
