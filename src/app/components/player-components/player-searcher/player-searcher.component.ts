import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PopoverController, ToastController, ToastOptions } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { Player } from 'src/app/interfaces/player';
import { CustomTranslateService } from 'src/app/services/auxiliar/custom-translate.service';
import { PlayerService } from 'src/app/services/model/player.service';

/**
 * El componente PlayerSearcherComponent permite buscar y seleccionar jugadores de una lista.
 * Proporciona filtrado por nombre y apellido, y emite eventos cuando se selecciona un jugador.
 */
@Component({
  selector: 'app-player-searcher',
  templateUrl: './player-searcher.component.html',
  styleUrls: ['./player-searcher.component.scss'],
})
export class PlayerSearcherComponent implements OnInit {

  /**
   * Lista de todos los jugadores disponibles.
   */
  players: Player[] = [];

  /**
   * Lista de jugadores seleccionados actualmente.
   */
  @Input() playersSelected: Player[] = [];

  /**
   * Jugador seleccionado actualmente (si lo hay).
   */
  @Input() player: Player | null = null;

  /**
   * ID del entrenador actual para filtrar los jugadores.
   */
  @Input() coachId: string | undefined;

  /**
   * Evento que se emite al hacer clic en un jugador.
   * Emite el jugador seleccionado.
   */
  @Output() onPlayerClicked = new EventEmitter();

  /**
   * Evento que indica el estado de visualización de la lista de jugadores.
   * Emite un booleano para indicar si la lista está visible o no.
   */
  @Output() sendStateList = new EventEmitter();

  /**
   * Indica si la lista de jugadores está visible o no.
   */
  showList: boolean = false;

  constructor(
    public plySvc: PlayerService,
    private popover: PopoverController,
    private toast: ToastController,
    public translate: CustomTranslateService
  ) {}

  ngOnInit() {}

  /**
   * Carga todos los jugadores disponibles para el entrenador actual.
   */
  async onLoadPlayers() {
    this.plySvc.players$.subscribe(_players => {
      var userPlayers = [..._players.filter(p => p.coachId == this.coachId)];
      this.players = userPlayers;
      this.showList = true;
      this.sendStateList.emit(true);
    });
  }

  /**
   * Filtra la lista de jugadores según el valor de búsqueda.
   * @param value Valor de búsqueda para filtrar por nombre y apellido de los jugadores.
   */
  onFilter(evt: any) {
    this.filter(evt.target.value.toLowerCase());
  }

  /**
   * Realiza el filtrado de jugadores según el valor proporcionado.
   * @param value Valor de búsqueda para filtrar por nombre y apellido de los jugadores.
   */
  private async filter(value: string) {
    const query = value;
    this.plySvc.players$.subscribe(_players => {
      var userPlayers = [..._players.filter(p => p.coachId == this.coachId)];
      this.players = userPlayers.filter(p => p.name.toLowerCase().includes(query) || p.surname.toLowerCase().includes(query));
    });
  }

  /**
   * Maneja el evento de clic en un jugador.
   * Emite un mensaje si el jugador ya ha sido seleccionado previamente.
   * @param player Jugador seleccionado.
   */
  async onPlayerClick(player: Player) {
    const _player = this.playersSelected.find(p => p?.id == player.id);
    if (_player) {
      const message = await lastValueFrom(this.translate.get('player.beenSelected'));
      const options: ToastOptions = {
        message: message,
        duration: 1000,
        position: 'bottom',
        color: 'danger',
        cssClass: 'red-toast'
      };
      this.toast.create(options).then(toast => toast.present());
    } else {
      this.onPlayerClicked.emit(player);
      this.popover.dismiss(player, "ok");
      this.showList = false;
      this.sendStateList.emit(false);
    }
  }
}