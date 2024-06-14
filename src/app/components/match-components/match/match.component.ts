import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Match } from 'src/app/interfaces/match';
import { Player } from 'src/app/interfaces/player';

/**
 * El componente MatchComponent es responsable de mostrar y gestionar un partido de fútbol.
 * Permite a los administradores editar y marcar el partido como finalizado.
 */
@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss'],
})
export class MatchComponent implements OnInit {

  /**
   * El partido que se muestra y gestiona.
   */
  @Input() match: Match | null = null;

  /**
   * Información del usuario actual.
   */
  @Input() user: any;

  /**
   * @Output onEditClick - Evento emitido cuando se hace clic en el botón de editar partido.
   */
  @Output() onEditClick = new EventEmitter<void>();

  /**
   * @Output onFinishedClick - Evento emitido cuando se hace clic en el botón de marcar partido como finalizado.
   */
  @Output() onFinishedClick = new EventEmitter<void>();

  /**
   * Los jugadores que juegan en la posición de delantero.
   */
  @Input() forwards: Player[] = [];

  /**
   * Los jugadores que juegan en la posición de mediocampista.
   */
  @Input() midfielders: Player[] = [];

  /**
   * Los jugadores que juegan en la posición de defensa.
   */
  @Input() defenses: Player[] = [];

  /**
   * El jugador que juega en la posición de portero.
   */
  @Input() goalkeeper: Player | undefined;

  constructor() {}

  ngOnInit() {}

  /**
   * Maneja el evento de clic en el botón de editar partido.
   * Solo permite la acción si el usuario es un administrador.
   * @param ev - El evento de clic.
   */
  onEditClicked(ev: Event) {
    if (this.user.role == 'ADMIN') {
      ev.stopPropagation();
      this.onEditClick.emit();
    }
  }

  /**
   * Maneja el evento de clic en el botón de marcar partido como finalizado.
   * Solo permite la acción si el usuario es un administrador.
   * @param ev - El evento de clic.
   */
  onFinishedClicked(ev: Event) {
    if (this.user.role == 'ADMIN') {
      ev.stopPropagation();
      this.onFinishedClick.emit();
    }
  }
}
