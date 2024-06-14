import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Player } from 'src/app/interfaces/player';

/**
 * El componente PlayerComponent es responsable de mostrar la información de un jugador.
 * Permite a los administradores editar y eliminar jugadores, y a cualquier usuario ver los detalles.
 */
@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit {

  /**
   * El jugador cuya información se muestra.
   */
  @Input() player: Player | null = null;

  /**
   * Indica si el usuario actual es administrador.
   */
  @Input() isAdmin: boolean = false;

  /**
   * Evento emitido cuando se hace clic en los detalles del jugador.
   */
  @Output() onDetailsClicked: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Evento emitido cuando se hace clic en eliminar jugador.
   */
  @Output() onDeleteClicked: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Evento emitido cuando se hace clic en editar jugador.
   */
  @Output() onEditClicked: EventEmitter<void> = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {}

  /**
   * Maneja el evento de clic en los detalles del jugador.
   * @param ev - El evento de clic.
   */
  onDetailsClick(ev: Event) {
    ev.stopPropagation();
    this.onDetailsClicked.emit();
  }

  /**
   * Maneja el evento de clic en eliminar jugador.
   * @param ev - El evento de clic.
   */
  onDeleteClick(ev: Event) {
    if (this.isAdmin) {
      ev.stopPropagation();
      this.onDeleteClicked.emit();
    }
  }

  /**
   * Maneja el evento de clic en editar jugador.
   * @param ev - El evento de clic.
   */
  onEditClick(ev: Event) {
    if (this.isAdmin) {
      ev.stopPropagation();
      this.onEditClicked.emit();
    }
  }
}