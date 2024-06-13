import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Player } from 'src/app/interfaces/player';

@Component({
  selector: 'app-player-info',
  templateUrl: './player-info.component.html',
  styleUrls: ['./player-info.component.scss'],
})
export class PlayerInfoComponent  implements OnInit {

  @Input() player:Player | undefined
  constructor(
    private modal:ModalController
  ) { }

  ngOnInit() {}

  onDismiss() {
    this.modal.dismiss()
  }
}
