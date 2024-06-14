import { Injectable } from '@angular/core';
import { FirebaseDocument, FirebaseService } from '../firebase/firebase.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Training } from '../../interfaces/training';
import { Unsubscribe } from 'firebase/firestore';

/**
 * Servicio para la gestión de entrenamientos.
 * Proporciona métodos para la creación, edición, eliminación y obtención de entrenamientos.
 */
@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  private _trainings = new BehaviorSubject<Training[]>([]); // BehaviorSubject para almacenar la lista de entrenamientos
  public trainings$ = this._trainings.asObservable(); // Observable expuesto para recibir actualizaciones de la lista de entrenamientos

  private unsubs: Unsubscribe | null = null; // Variable para almacenar la función de unsubscribe

  constructor(
    private fbSvc: FirebaseService // Servicio de Firebase para la interacción con Firestore
  ) {
    // Suscribe el BehaviorSubject a la colección 'trainings' en Firebase
    this.unsubs = fbSvc.subscribeToCollection("trainings", this._trainings, this.mapTrainings);
  }

  /**
   * Convierte un documento de Firebase a un objeto Training.
   * @param fd Documento de Firebase que contiene los datos del entrenamiento.
   * @returns Objeto Training generado a partir del documento.
   */
  mapTrainings(fd: FirebaseDocument): Training {
    return {
      id: fd.id,
      date: fd.data['date'],
      exercises: fd.data['exercises'],
      completed: fd.data['completed'],
      coachId: fd.data['coachId']
    };
  }

  /**
   * Obtiene un entrenamiento específico mediante su ID.
   * @param id ID del entrenamiento a obtener.
   * @returns Observable que emite el entrenamiento encontrado una vez completada la operación.
   */
  getTraining(id: string): Observable<Training> {
    return new Observable<Training>(obs => {
      this.fbSvc.getDocument("trainings", id).then(doc => {
        const training = this.mapTrainings(doc);
        obs.next(training);
        obs.complete();
      }).catch(err => {
        obs.error(err);
      });
    });
  }

  /**
   * Crea un nuevo entrenamiento en la colección 'trainings'.
   * @param training Datos del nuevo entrenamiento a crear.
   * @param user Usuario que realiza la operación (debe ser administrador).
   * @returns Observable que emite el entrenamiento creado una vez completada la operación.
   */
  createTraining(training: Training, user: any): Observable<Training> {
    return new Observable<Training>(obs => {
      if (user.role == 'ADMIN') {
        delete training.id;
        training.coachId = user.id;
        training.completed = false;

        // Creación del documento de entrenamiento en Firestore
        this.fbSvc.createDocument("trainings", training).then(_ => {
          this.unsubs = this.fbSvc.subscribeToCollection("trainings", this._trainings, this.mapTrainings);
          obs.next(training);
          obs.complete();
        }).catch(err => {
          obs.error(err);
        });
      }
    });
  }

  /**
   * Actualiza los datos de un entrenamiento existente en la colección 'trainings'.
   * @param training Datos actualizados del entrenamiento.
   * @param user Usuario que realiza la operación (debe ser administrador).
   * @returns Observable que emite el entrenamiento actualizado una vez completada la operación.
   */
  updateTraining(training: Training, user: any): Observable<Training> {
    return new Observable<Training>(obs => {
      if (user.role == 'ADMIN') {
        var trainingWithoutId = { ...training };
        delete trainingWithoutId.id;

        // Actualización del documento de entrenamiento en Firestore
        this.fbSvc.updateDocument("trainings", training.id!!, trainingWithoutId).then(_ => {
          this.unsubs = this.fbSvc.subscribeToCollection("trainings", this._trainings, this.mapTrainings);
          obs.next(training);
          obs.complete();
        }).catch(err => {
          obs.error(err);
        });
      }
    });
  }

  /**
   * Elimina un entrenamiento de la colección 'trainings'.
   * @param training Entrenamiento a eliminar.
   * @param user Usuario que realiza la operación (debe ser administrador).
   * @returns Observable que completa una vez que se ha eliminado el entrenamiento.
   */
  deleteTraining(training: Training, user: any): Observable<void> {
    return new Observable<void>(obs => {
      if (user.role == 'ADMIN') {
        // Eliminación del documento de entrenamiento en Firestore
        this.fbSvc.deleteDocument("trainings", training.id!!).then(_ => {
          this.unsubs = this.fbSvc.subscribeToCollection("trainings", this._trainings, this.mapTrainings);
        }).catch(err => {
          obs.error(err);
        });
      }
    });
  }
}