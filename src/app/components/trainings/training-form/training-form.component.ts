import { Component, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonDatetime, IonInput, IonPopover, ModalController, ToastController, ToastOptions } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { Training } from 'src/app/interfaces/training';
import { CustomTranslateService } from 'src/app/services/auxiliar/custom-translate.service';

/**
 * Componente TrainingFormComponent
 * 
 * Este componente maneja el formulario para la creación y edición de detalles de entrenamientos,
 * incluyendo la fecha y los ejercicios asociados.
 */
@Component({
  selector: 'app-training-form',
  templateUrl: './training-form.component.html',
  styleUrls: ['./training-form.component.scss'],
})
export class TrainingFormComponent implements OnInit, ControlValueAccessor {

  /**
   * Formulario reactivo para la entrada de datos del entrenamiento.
   */
  form: FormGroup;

  /**
   * Modo actual del formulario ('Edit' para edición, 'New' para creación).
   */
  mode: 'Edit' | 'New' = 'New';

  /**
   * Función de cambio de valor para el formulario.
   */
  onChange?: (obj: any) => void;

  /**
   * Indica si el formulario está deshabilitado o no.
   */
  disable: boolean = false;

  /**
   * Arreglo de ejercicios añadidos al formulario.
   */
  exercisesAdded: string[] = [];

  /**
   * Establece el entrenamiento para edición o creación.
   * Actualiza el formulario con los datos del entrenamiento proporcionado.
   */
  @Input() set training(_training: Training | null) {
    if (_training) {
      this.mode = 'Edit';
      this.form.controls['id'].setValue(_training.id);
      this.form.controls['date'].setValue(_training.date);
      this.form.controls['exercises'].setValue(_training.exercises);
      this.exercisesAdded = [..._training.exercises!!];
    }
  }

  constructor(
    private formB: FormBuilder,
    private toast: ToastController,
    private modal: ModalController,
    public translate: CustomTranslateService
  ) {
    // Inicialización del formulario reactivo
    this.form = formB.group({
      id: [null],
      date: ['', [Validators.required]],
      exercises: [[], [Validators.required]]
    });
  }

  ngOnInit() {}

  /**
   * Método para escribir un valor en el formulario.
   * @param obj Objeto a asignar al formulario
   */
  writeValue(obj: any): void {
    this.form.controls['exercises'].setValue(obj);
  }

  /**
   * Registra una función de cambio para el formulario.
   * @param fn Función de cambio a registrar
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * Registra una función de cambio de estado táctil para el formulario.
   * @param fn Función de cambio de estado táctil a registrar
   */
  registerOnTouched(fn: any): void {}

  /**
   * Establece el estado de deshabilitación del formulario.
   * @param isDisabled Indica si el formulario debe estar deshabilitado
   */
  setDisabledState?(isDisabled: boolean): void {
    this.disable = isDisabled;
  }

  /**
   * Maneja la presentación del popover de selección de fecha.
   * Muestra un mensaje de error si no se selecciona una fecha.
   * @param popover Popover de fecha
   * @param input Entrada de fecha
   * @param dateTime Componente IonDatetime de fecha
   */
  async onSelectDate(popover: IonPopover, input: IonInput, dateTime: IonDatetime) {
    if (!dateTime.value) {
      const message = await lastValueFrom(this.translate.get('match.error.dateNotSelected'));
      const options: ToastOptions = {
        message: message,
        duration: 1000,
        position: 'bottom',
        color: 'danger',
        cssClass: 'red-toast'
      };
      this.toast.create(options).then(toast => toast.present());
    } else {
      const day = dateTime.value?.slice(0, 10);
      const hour = dateTime.value?.slice(day?.length!! + 1, dateTime.value.length - 3);
      this.form.controls['date'].setValue(day + " - " + hour);
      input.value = day + " - " + hour;
      popover.dismiss();
    }
  }

  /**
   * Agrega un ejercicio al formulario.
   * Muestra un mensaje de error si no se proporciona un nombre para el ejercicio.
   * @param popover Popover de ejercicio
   * @param input Entrada de ejercicio
   */
  async addExercise(popover: IonPopover, input: IonInput) {
    if (input.value && input.value != "") {
      this.exercisesAdded.push(input.value.toString());
      this.onChange?.(input.value.toString());
      this.form.controls['exercises'].setValue(this.exercisesAdded);
      popover.dismiss();
    } else {
      const message = await lastValueFrom(this.translate.get('training.error.empty-exercise-name'));
      const options: ToastOptions = {
        message: message,
        duration: 1000,
        position: 'bottom',
        color: 'danger',
        cssClass: 'red-toast'
      };
      this.toast.create(options).then(toast => toast.present());
    }
  }

  /**
   * Elimina un ejercicio del formulario.
   * @param exercise Ejercicio a eliminar
   */
  deleteExercise(exercise: string) {
    const index = this.exercisesAdded.findIndex(e => e == exercise);
    if (index > -1) {
      this.exercisesAdded = [...this.exercisesAdded.slice(0, index),
      ...this.exercisesAdded.slice(index + 1, this.exercisesAdded.length)];
      this.form.controls['exercises'].setValue(this.exercisesAdded);
    }
  }

  /**
   * Método invocado al enviar el formulario.
   * Cierra el modal y envía los datos del formulario.
   */
  onSubmit() {
    this.modal.dismiss(this.form.value, 'ok');
  }

  /**
   * Método invocado al cancelar el formulario.
   * Cierra el modal sin enviar datos.
   */
  onCancel() {
    this.modal.dismiss(null, 'cancel');
  }
}