import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonInput, IonPopover, ModalController } from '@ionic/angular';
import { Player } from 'src/app/interfaces/player';
import { Squad } from 'src/app/interfaces/squad';
import { PlayerService } from 'src/app/services/model/player.service';

/**
 * Componente SquadFormComponent
 * 
 * Este componente maneja la creación y edición de formularios relacionados con un escuadrón (Squad),
 * permitiendo la selección de jugadores y la configuración de la alineación del escuadrón.
 */
@Component({
  selector: 'app-squad-form',
  templateUrl: './squad-form.component.html',
  styleUrls: ['./squad-form.component.scss'],
})
export class SquadFormComponent implements OnInit {

  /**
   * Jugadores seleccionados para el escuadrón.
   */
  playersAdded: Player[] = [];

  /**
   * Identificador del entrenador asociado al escuadrón.
   */
  @Input() coachId: string | undefined;

  /**
   * Contador de jugadores seleccionados.
   */
  countPlayers: number = 0;

  /**
   * Formulario Reactivo para manejar los datos del escuadrón.
   */
  form: FormGroup;

  /**
   * Modo de operación del formulario: 'Edit' para editar un escuadrón existente, 'New' para crear uno nuevo.
   */
  mode: 'Edit' | 'New' = 'New';

  /**
   * Alineación seleccionada para el escuadrón.
   */
  lineUp: string | undefined;

  /**
   * Setter para el objeto Squad que se utilizará para editar el formulario.
   */
  @Input() set squad(_squad: Squad | null) {
    if (_squad) {
      this.mode = 'Edit';
      this.form.controls['id'].setValue(_squad.id);
      this.form.controls['name'].setValue(_squad.name);
      this.form.controls['lineUp'].setValue(_squad.lineUp);
      this.form.controls['players'].setValue(_squad.players);
      this.playersAdded = [..._squad.players];
      this.countPlayers = this.playersAdded.length;
    }
  }

  constructor(
    private formB: FormBuilder,
    private modal: ModalController,
    public playerSvc: PlayerService
  ) { 
    this.form = formB.group({
      id: [null],
      name: ['', [Validators.required]],
      lineUp: ['', [Validators.required]],
      players: [, [Validators.required]]
    });
  }

  ngOnInit() {
    console.log(this.form.controls['players'].value);
  }

  /**
   * Método llamado cuando se envía el formulario.
   * Cierra el modal y devuelve los datos del formulario.
   */
  onSubmit() {
    this.modal.dismiss(this.form.value, 'ok');
  }

  /**
   * Método llamado cuando se cancela la edición o creación del escuadrón.
   * Cierra el modal sin devolver ningún dato.
   */
  onCancel() {
    this.modal.dismiss(null, 'cancel');
  }

  /**
   * Método para seleccionar una alineación específica.
   * @param popover IonPopover para mostrar la lista de opciones.
   * @param input IonInput para mostrar la opción seleccionada.
   * @param lineUp Cadena que representa la alineación seleccionada.
   */
  onSelectLineUp(popover: IonPopover, input: IonInput, lineUp: string) {
    this.form.controls['lineUp'].setValue(lineUp);
    this.lineUp = lineUp;
    input.value = lineUp;
    this.form.controls['players'].setValue([]);
    this.countPlayers = 0;
    this.playersAdded = [];
    popover.dismiss();
  }

  /**
   * Método para agregar un jugador al escuadrón.
   * @param player Jugador seleccionado para agregar.
   * @param index Índice de la posición en la lista de jugadores.
   */
  onAddPlayer(player: Player | null, index: number) {
    if (player == null && this.playersAdded[index]) {
      const _players = [...this.playersAdded];
      this.playersAdded = [..._players.slice(0, index), ..._players.slice(index + 1)];
    }
    if (!this.playersAdded[index]) {
      this.countPlayers++;
    }
    this.playersAdded[index] = player!!;
    console.log(this.playersAdded);
    console.log(this.countPlayers);
    if (this.countPlayers == 11) {
      this.form.controls['players'].setValue(this.playersAdded);
    }
  }
}