import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonButton, IonCheckbox, IonFabButton } from '@ionic/angular';
import { Training } from 'src/app/interfaces/training';

/**
 * Componente TrainingComponent
 * 
 * Este componente muestra los detalles de un entrenamiento y permite realizar acciones como
 * edición, eliminación y marcado de ejercicios como completados.
 */
@Component({
  selector: 'app-training-component',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss'],
})
export class TrainingComponent implements OnInit {

  /**
   * Objeto que representa el entrenamiento a mostrar.
   */
  @Input() training: Training | undefined;

  /**
   * Indica si el usuario actual tiene permisos de administrador.
   */
  @Input() isAdmin: boolean = false;

  /**
   * Evento emitido cuando se hace clic en el botón de edición.
   */
  @Output() onEditClick = new EventEmitter<void>();

  /**
   * Evento emitido cuando se hace clic en el botón de eliminación.
   */
  @Output() onDeleteClick = new EventEmitter<void>();

  /**
   * Evento emitido cuando se marca un ejercicio como completado o incompleto.
   * Emite un valor booleano indicando si todos los ejercicios han sido completados.
   */
  @Output() onFinishedTraining = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {}

  /**
   * Método invocado cuando se hace clic en el botón de edición.
   * Emite el evento onEditClick.
   * @param ev Evento de clic
   */
  onEditClicked(ev: Event) {
    ev.stopPropagation();
    this.onEditClick.emit();
  }

  /**
   * Método invocado cuando se hace clic en el botón de eliminación.
   * Emite el evento onDeleteClick.
   * @param ev Evento de clic
   */
  onDeleteClicked(ev: Event) {
    ev.stopPropagation();
    this.onDeleteClick.emit();
  }

  /**
   * Método invocado cuando se marca un ejercicio como completado o incompleto.
   * Actualiza el estado del botón basado en el estado del checkbox y emite el evento onFinishedTraining.
   * @param ev Evento de cambio del checkbox
   * @param checkbox Referencia al checkbox del ejercicio
   * @param button Referencia al botón de acción relacionado con el ejercicio
   */
  checkExercise(ev: Event, checkbox: IonCheckbox, button: IonFabButton) {
    ev.stopPropagation();
    const newValue = !checkbox.checked;

    // Habilita o deshabilita el botón según el estado del checkbox
    button.disabled = !newValue;

    // Emite el evento onFinishedTraining con el valor actualizado de completitud del entrenamiento
    this.onFinishedTraining.emit(newValue);
  }
}