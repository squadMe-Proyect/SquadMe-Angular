import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Coach } from 'src/app/interfaces/coach';
import { Player } from 'src/app/interfaces/player';

/**
 * Componente UserComponent
 * 
 * Este componente muestra los detalles de un usuario, ya sea un jugador (Player) o un entrenador (Coach).
 * Proporciona funcionalidades para editar la información del usuario y cambiar la contraseña.
 */
@Component({
  selector: 'app-user-component',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {

  /**
   * Usuario a mostrar (puede ser un jugador o un entrenador).
   */
  @Input() user: Player | Coach | null = null;

  /**
   * Evento emitido al hacer clic en el botón de edición de usuario.
   */
  @Output() onEditClick = new EventEmitter<void>();

  /**
   * Evento emitido al hacer clic en el botón de cambio de contraseña.
   */
  @Output() onChangePasswordClick = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {}

  /**
   * Maneja el evento de clic en el botón de edición.
   * Detiene la propagación del evento y emite el evento `onEditClick`.
   * @param ev Evento de clic
   */
  onEditClicked(ev: Event) {
    ev.stopPropagation();
    this.onEditClick.emit();
  }

  /**
   * Maneja el evento de clic en el botón de cambio de contraseña.
   * Detiene la propagación del evento y emite el evento `onChangePasswordClick`.
   * @param ev Evento de clic
   */
  onChangePasswordClicked(ev: Event) {
    ev.stopPropagation();
    this.onChangePasswordClick.emit();
  }
}