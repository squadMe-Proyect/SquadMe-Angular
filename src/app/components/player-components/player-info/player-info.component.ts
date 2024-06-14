import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Player } from 'src/app/interfaces/player';

/**
 * El componente PlayerInfoComponent muestra la información detallada de un jugador en un modal.
 */
@Component({
  selector: 'app-player-info',
  templateUrl: './player-info.component.html',
  styleUrls: ['./player-info.component.scss'],
})
export class PlayerInfoComponent implements OnInit {

  /**
   * El jugador cuya información se está mostrando.
   */
  @Input() player: Player | undefined;

  constructor(
    private modal: ModalController
  ) { }

  ngOnInit() {}

  /**
   * Cierra el modal que muestra la información del jugador.
   */
  onDismiss() {
    this.modal.dismiss();
  }
}
