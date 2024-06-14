import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonInput, IonPopover, ModalController } from '@ionic/angular';
import { Player } from 'src/app/interfaces/player';
import { PasswordValidation } from 'src/app/validators/password';

/**
 * El componente PlayerFormComponent es responsable de manejar el formulario para crear o editar la información de un jugador.
 */
@Component({
  selector: 'app-player-form',
  templateUrl: './player-form.component.html',
  styleUrls: ['./player-form.component.scss'],
})
export class PlayerFormComponent implements OnInit {
  
  /**
   * Indica si la posición del jugador no es portero.
   */
  isNotGoalkeeper: boolean = false;

  /**
   * El formulario para ingresar la información del jugador.
   */
  form: FormGroup;

  /**
   * Modo del formulario: 'New' para nuevo jugador, 'Edit' para editar un jugador existente.
   */
  mode: 'New' | 'Edit' = 'New';

  /**
   * El jugador a editar (si se proporciona).
   */
  @Input('player') player: Player | undefined;

  constructor(
    private formB: FormBuilder,
    private modal: ModalController,
  ) {
    // Inicializa el formulario con los controles necesarios y sus validaciones.
    this.form = this.formB.group({
      id: [null],
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      email: ['', [Validators.required]],
      position: ['', [Validators.required]],
      nation: ['', [Validators.required]],
      number: [0, [Validators.required]],
      picture: [''],
      password: ['', [Validators.required, PasswordValidation.passwordProto('password')]],
      confirm: ['', [Validators.required, PasswordValidation.passwordProto('confirm')]]
    });
  }

  ngOnInit() {
    if (this.player) {
      this.mode = 'Edit';
      this.form = this.formB.group({
        id: [this.player.id],
        name: [this.player.name, [Validators.required]],
        surname: [this.player.surname, [Validators.required]],
        position: [this.player.position, [Validators.required]],
        nation: [this.player.nation, [Validators.required]],
        number: [this.player.number, [Validators.required]],
        goals: [this.player.goals],
        assists: [this.player.assists],
        yellowCards: [this.player.yellowCards],
        redCards: [this.player.redCards],
        picture: [this.player.picture]
      });
      this.isNotGoalkeeper = (this.player.position != 'Portero');
    }
  }

  /**
   * Maneja la acción de enviar el formulario.
   * Cierra el modal con los datos del formulario.
   */
  onSubmit() {
    this.modal.dismiss(this.form.value, 'ok');
  }

  /**
   * Maneja la acción de cancelar el formulario.
   * Cierra el modal sin enviar datos.
   */
  onCancel() {
    this.modal.dismiss(null, 'cancel');
  }

  /**
   * Selecciona la posición del jugador y actualiza el formulario.
   * @param popover - El popover utilizado para seleccionar la posición.
   * @param input - El input para mostrar la posición seleccionada.
   * @param position - La posición seleccionada.
   */
  onSelectPosition(popover: IonPopover, input: IonInput, position: string) {
    this.form.controls['position'].setValue(position);
    input.value = position;
    this.isNotGoalkeeper = (position != 'Portero');
    popover.dismiss();
  }
}