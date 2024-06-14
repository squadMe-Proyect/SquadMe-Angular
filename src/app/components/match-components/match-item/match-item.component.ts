import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Match } from 'src/app/interfaces/match';

/**
 * El componente MatchItemComponent es responsable de mostrar un ítem de partido.
 * Permite a los administradores eliminar el partido.
 */
@Component({
  selector: 'app-match-item',
  templateUrl: './match-item.component.html',
  styleUrls: ['./match-item.component.scss'],
})
export class MatchItemComponent implements OnInit {

  /**
   * El partido que se muestra.
   */
  @Input() match: Match | null = null;

  /**
   * Nombre del equipo que participa en el partido.
   */
  @Input() teamName: string = "";

  /**
   * Indica si el usuario actual es administrador.
   */
  @Input() isAdmin: boolean = false;

  /**
   * @Output onDeleteClick - Evento emitido cuando se hace clic en el botón de eliminar partido.
   */
  @Output() onDeleteClick = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {}

  /**
   * Maneja el evento de clic en el botón de eliminar partido.
   * @param ev - El evento de clic.
   */
  onDeleteClicked(ev: Event) {
    ev.stopPropagation();
    this.onDeleteClick.emit();
  }
}