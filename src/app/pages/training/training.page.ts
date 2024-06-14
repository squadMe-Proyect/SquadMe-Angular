import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TrainingFormComponent } from 'src/app/components/trainings/training-form/training-form.component';
import { Training } from 'src/app/interfaces/training';
import { AuthService } from 'src/app/services/api/auth.service';
import { TrainingService } from 'src/app/services/model/training.service';

/**
 * Página que gestiona los entrenamientos de un usuario.
 */
@Component({
  selector: 'app-training',
  templateUrl: './training.page.html',
  styleUrls: ['./training.page.scss'],
})
export class TrainingPage implements OnInit {
  private user: any; // Usuario actual
  trainings: Training[] = []; // Array de entrenamientos

  /**
   * Constructor de la página TrainingPage.
   * @param modal Controlador de modales de Ionic para mostrar el formulario de entrenamientos.
   * @param authSvc Servicio de autenticación para obtener el usuario actual.
   * @param trainingSvc Servicio de gestión de entrenamientos.
   */
  constructor(
    private modal: ModalController,
    public authSvc: AuthService,
    public trainingSvc: TrainingService
  ) {
    // Suscripción al observable de usuario para cargar los entrenamientos al iniciar
    authSvc.user$.subscribe(u => {
      this.user = u;
      this.onLoadTrainings(u); // Carga los entrenamientos del usuario
    });
  }

  /**
   * Método de ciclo de vida de Angular, se ejecuta al inicializarse el componente.
   */
  ngOnInit() {
    // No realiza ninguna operación específica en este punto
  }

  /**
   * Carga los entrenamientos del usuario actual.
   * @param user Usuario del cual cargar los entrenamientos.
   */
  onLoadTrainings(user: any) {
    this.trainingSvc.trainings$.subscribe(ts => {
      const _trainings = [...ts]; // Copia los entrenamientos para no modificar el original
      // Filtra los entrenamientos por el ID del coach
      this.trainings = _trainings.filter(t => t.coachId == user.id || t.coachId == user.coachId);
    });
  }

  /**
   * Muestra un formulario modal para crear o editar un entrenamiento.
   * @param data Datos del entrenamiento a editar, o null para crear uno nuevo.
   * @param onDismiss Función que se llama al cerrar el modal con un resultado.
   */
  async presentForm(data: Training | null, onDismiss: (result: any) => void) {
    const modal = await this.modal.create({
      component: TrainingFormComponent, // Componente del formulario de entrenamiento
      cssClass: "form-modal",
      componentProps: {
        training: data // Datos del entrenamiento a editar o null para nuevo entrenamiento
      }
    });
    modal.present(); // Muestra el modal
    modal.onDidDismiss().then(result => {
      if (result?.data) {
        onDismiss(result); // Llama a la función de dismiss con el resultado si hay datos
      }
    });
  }

  /**
   * Maneja la creación de un nuevo entrenamiento.
   * Llama a presentForm() para mostrar el formulario modal de creación.
   */
  onNewTraining() {
    var onDismiss = (info: any) => {
      switch (info.role) {
        case 'ok': {
          this.trainingSvc.createTraining(info.data, this.user).subscribe(_ => {
            this.onLoadTrainings(this.user); // Recarga los entrenamientos después de crear uno nuevo
          });
        }
        break;
      }
    };
    this.presentForm(null, onDismiss); // Muestra el formulario modal para nuevo entrenamiento
  }

  /**
   * Maneja la edición de un entrenamiento existente.
   * Llama a presentForm() para mostrar el formulario modal de edición.
   * @param training Entrenamiento que se va a editar.
   */
  onEditTraining(training: Training) {
    var onDismiss = (info: any) => {
      switch (info.role) {
        case 'ok': {
          const _training: Training = {
            id: training.id,
            date: info.data.date,
            exercises: info.data.exercises,
            completed: training.completed, // Mantener el estado completado
            coachId: training.coachId
          };
          this.trainingSvc.updateTraining(_training, this.user).subscribe(_ => {
            this.onLoadTrainings(this.user); // Recarga los entrenamientos después de editar
          });
        }
        break;
        case 'cancel': {
          this.trainingSvc.getTraining(training.id!!).subscribe(_ => this.onLoadTrainings(this.user));
          // Recarga el entrenamiento si se cancela la edición
        }
      }
    };
    this.presentForm(training, onDismiss); // Muestra el formulario modal para editar el entrenamiento
  }

  /**
   * Marca un entrenamiento como completado o no completado.
   * @param finished Estado de completado del entrenamiento.
   * @param training Entrenamiento que se va a marcar como completado o no completado.
   */
  finishTraining(finished: boolean, training: Training) {
    if (training.completed != finished) {
      training.completed = finished; // Actualiza el estado de completado del entrenamiento
      this.trainingSvc.updateTraining(training, this.user).subscribe(_ => {
        this.onLoadTrainings(this.user); // Recarga los entrenamientos después de actualizar
      });
    }
  }

  /**
   * Elimina un entrenamiento.
   * @param training Entrenamiento que se va a eliminar.
   */
  onDeleteTraining(training: Training) {
    this.trainingSvc.deleteTraining(training, this.user).subscribe(_ => this.onLoadTrainings(this.user));
    // Elimina el entrenamiento y recarga la lista después
  }
}
