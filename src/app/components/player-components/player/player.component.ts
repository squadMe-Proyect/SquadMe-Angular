import { Component,  EventEmitter,  Input,  OnInit, Output } from '@angular/core';
import { Player } from 'src/app/interfaces/player';



@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent  implements OnInit {

  @Input() player: Player | null = null
  @Input() isAdmin: boolean = false
  @Output() onDetailsClicked:EventEmitter<void> = new EventEmitter<void>()
  @Output() onDeleteClicked:EventEmitter<void> = new EventEmitter<void>()
  @Output() onEditClicked:EventEmitter<void> = new EventEmitter<void>()
  constructor() { }

  ngOnInit() {}

  onDetailsClick(ev:Event) {
    ev.stopPropagation()
    this.onDetailsClicked.emit()
  }

  onDeleteClick(ev:Event) {
    if(this.isAdmin) {
      ev.stopPropagation()
      this.onDeleteClicked.emit()
    }
  }

  onEditClick(ev:Event) {
    if(this.isAdmin) {
      ev.stopPropagation()
      this.onEditClicked.emit()
    }
  }
}
