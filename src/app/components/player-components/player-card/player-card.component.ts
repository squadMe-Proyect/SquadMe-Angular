import { Component, EventEmitter, Input, OnInit, Output, forwardRef } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Player } from 'src/app/interfaces/player';
import { PlayerSearcherComponent } from '../player-searcher/player-searcher.component';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const PLAYER_CARD_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => PlayerCardComponent),
  multi: true
}

/**
 * El componente PlayerCardComponent es responsable de mostrar una tarjeta de jugador y permite seleccionar un jugador mediante un popover.
 * Implementa ControlValueAccessor para integrarse con formularios reactivos.
 */
@Component({
  selector: 'app-player-card',
  templateUrl: './player-card.component.html',
  styleUrls: ['./player-card.component.scss'],
  providers: [PLAYER_CARD_VALUE_ACCESSOR]
})
export class PlayerCardComponent implements OnInit, ControlValueAccessor {

  /**
   * El jugador actual que se muestra en la tarjeta.
   */
  @Input() player: Player | null = null;

  /**
   * Lista de jugadores ya añadidos.
   */
  @Input() pAdded: Player[] = [];

  /**
   * ID del entrenador asociado.
   */
  @Input() coachId: string | undefined;

  /**
   * Evento emitido cuando se selecciona un jugador.
   */
  @Output() onPlayerSelected = new EventEmitter();

  /**
   * Función de callback para cambios en el valor.
   */
  onChange?: (obj: any) => void;

  /**
   * Indica si el componente está deshabilitado.
   */
  disable: boolean = false;

  constructor(private popover: PopoverController) { }

  /**
   * Escribe el valor en el componente.
   * @param obj - El valor a escribir.
   */
  writeValue(obj: any): void {
    this.player = obj;
  }

  /**
   * Registra una función que se llamará cuando el valor cambie.
   * @param fn - La función de callback.
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * Registra una función que se llamará cuando el componente sea tocado.
   * @param fn - La función de callback.
   */
  registerOnTouched(fn: any): void {}

  /**
   * Habilita o deshabilita el componente.
   * @param isDisabled - Indica si el componente está deshabilitado.
   */
  setDisabledState?(isDisabled: boolean): void {
    this.disable = isDisabled;
  }

  ngOnInit() {}

  /**
   * Presenta el selector de jugador utilizando un popover.
   */
  async presentSelector() {
    const popover = await this.popover.create({
      component: PlayerSearcherComponent,
      componentProps: {
        player: this.player,
        playersSelected: this.pAdded,
        coachId: this.coachId
      },
    });
    await popover.present();
    const { data, role } = await popover.onDidDismiss();
    if (role === 'ok') {
      this.onPlayerSelected.emit(data);
      this.onChange?.(data);
    }
  }
}
