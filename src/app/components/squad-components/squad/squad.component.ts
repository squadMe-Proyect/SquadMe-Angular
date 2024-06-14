import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Squad } from 'src/app/interfaces/squad';

/**
 * Componente SquadComponent
 * 
 * Este componente muestra información detallada sobre un escuadrón (Squad) y proporciona opciones para
 * edición y eliminación si el usuario tiene permisos de administrador.
 */
@Component({
  selector: 'app-squad',
  templateUrl: './squad.component.html',
  styleUrls: ['./squad.component.scss'],
})
export class SquadComponent implements OnInit {

  /**
   * Objeto Squad que representa el escuadrón a mostrar.
   */
  @Input() squad: Squad | undefined;

  /**
   * Indica si el usuario tiene permisos de administrador para editar o eliminar el escuadrón.
   * Por defecto, es falso (no es administrador).
   */
  @Input() isAdmin: boolean = false;

  /**
   * Evento emitido cuando se hace clic en el botón de edición del escuadrón.
   * Solo se emite si el usuario tiene permisos de administrador.
   */
  @Output() onEditClicked: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Evento emitido cuando se solicita eliminar el escuadrón.
   * Solo se emite si el usuario tiene permisos de administrador.
   */
  @Output() onDeleteSquad: EventEmitter<void> = new EventEmitter<void>();

  constructor() { }

  /**
   * Maneja el evento de clic en el botón de edición del escuadrón.
   * Emite el evento `onEditClicked` si el usuario es administrador.
   * @param ev Evento de clic del navegador.
   */
  onEditClick(ev: Event) {
    ev.stopPropagation();  // Evita la propagación del evento.
    if (this.isAdmin) {
      this.onEditClicked.emit();  // Emite el evento de edición del escuadrón.
    }
  }

  /**
   * Maneja el evento de eliminación del escuadrón.
   * Emite el evento `onDeleteSquad` si el usuario es administrador.
   * @param ev Evento de clic del navegador.
   */
  deleteSquad(ev: Event) {
    ev.stopPropagation();  // Evita la propagación del evento.
    if (this.isAdmin) {
      this.onDeleteSquad.emit();  // Emite el evento de eliminación del escuadrón.
    }
  }

  ngOnInit() {
    // Método del ciclo de vida de Angular que se ejecuta cuando el componente se inicializa.
  }

}