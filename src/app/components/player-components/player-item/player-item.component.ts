import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Player } from 'src/app/interfaces/player';

/**
 * El componente PlayerItemComponent muestra un elemento de jugador en una lista o vista de ítems.
 */
@Component({
  selector: 'app-player-item',
  templateUrl: './player-item.component.html',
  styleUrls: ['./player-item.component.scss'],
})
export class PlayerItemComponent implements OnInit {

  private _player: Player | undefined;

  /**
   * Establece el jugador que se va a mostrar en el ítem.
   */
  @Input('player') set player(_player: Player | undefined) {
    this._player = _player;
  }

  /**
   * Emite un evento cuando se hace clic en el ítem del jugador.
   */
  @Output('clicked') clicked = new EventEmitter();

  constructor() { }

  /**
   * Devuelve el jugador actualmente configurado para el ítem.
   */
  get player(): Player | undefined {
    return this._player;
  }

  /**
   * Maneja el evento de clic en el ítem del jugador.
   * Emite el jugador asociado con el evento.
   */
  onPlayerClicked() {
    this.clicked.emit(this._player);
  }

  ngOnInit() {}

}