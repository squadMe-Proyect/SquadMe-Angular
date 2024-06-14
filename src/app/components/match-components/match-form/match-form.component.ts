import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonDatetime, IonInput, IonPopover, ModalController, ToastController, ToastOptions } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { Match } from 'src/app/interfaces/match';
import { Squad } from 'src/app/interfaces/squad';
import { CustomTranslateService } from 'src/app/services/auxiliar/custom-translate.service';

/**
 * El componente MatchFormComponent es responsable de gestionar el formulario de creación y edición de partidos.
 */
@Component({
  selector: 'app-match-form',
  templateUrl: './match-form.component.html',
  styleUrls: ['./match-form.component.scss'],
})
export class MatchFormComponent implements OnInit {
  /**
   * El formulario reactivo utilizado para gestionar el formulario del partido.
   */
  form: FormGroup;

  /**
   * Modo del formulario, puede ser 'Edit' para edición de un partido existente o 'New' para creación de un nuevo partido.
   */
  mode: 'Edit' | 'New' = 'New';

  /**
   * Lista de escuadrones disponibles para seleccionar.
   */
  @Input() squads: Squad[] | undefined;

  /**
   * Partido a ser editado. Si se proporciona, el formulario se inicializa en modo 'Edit'.
   */
  @Input('match') match: Match | null = null;

  constructor(
    private formB: FormBuilder,
    private modal: ModalController,
    public translate: CustomTranslateService,
    private toast: ToastController
  ) {
    // Inicialización del formulario con validadores requeridos.
    this.form = this.formB.group({
      id: [null],
      opponent: ['', [Validators.required]],
      date: ['', [Validators.required]],
      squad: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    // Si se proporciona un partido, el formulario se inicializa con sus valores y se cambia el modo a 'Edit'.
    if (this.match) {
      this.mode = 'Edit';
      const first: any = this.match.result.charAt(0);
      const second: any = this.match.result.charAt(2);
      this.form = this.formB.group({
        id: [this.match.id],
        opponent: [this.match.opponent, [Validators.required]],
        date: [this.match.date, [Validators.required]],
        squad: [this.match.squad.name, [Validators.required]],
        result: [this.match.result, [Validators.required]],
        teamResult: [first],
        opponentResult: [second]
      });
    }
  }

  /**
   * Maneja el evento de envío del formulario.
   * Si el modo es 'Edit', se establece el resultado del partido.
   */
  onSubmit() {
    if (this.mode == 'Edit') this.onSetResult();
    this.modal.dismiss(this.form.value, 'ok');
  }

  /**
   * Maneja el evento de cancelación del formulario.
   */
  onCancel() {
    this.modal.dismiss(null, 'cancel');
  }

  /**
   * Maneja la selección de escuadrón.
   * @param popover - El popover que contiene la lista de escuadrones.
   * @param input - El input donde se muestra el nombre del escuadrón seleccionado.
   * @param squad - El escuadrón seleccionado.
   */
  onSelectSquad(popover: IonPopover, input: IonInput, squad: Squad) {
    this.form.controls['squad'].setValue(squad.name);
    input.value = squad.name;
    popover.dismiss();
  }

  /**
   * Maneja la selección de fecha.
   * @param popover - El popover que contiene el IonDatetime.
   * @param input - El input donde se muestra la fecha seleccionada.
   * @param dateTime - El IonDatetime utilizado para seleccionar la fecha.
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
   * Establece el resultado del partido basado en los resultados del equipo y del oponente.
   */
  private onSetResult() {
    const teamResult: number = this.form.controls['teamResult'].value;
    const opponentResult: number = this.form.controls['opponentResult'].value;
    this.form.controls['result'].setValue(teamResult + "-" + opponentResult);
  }
}
