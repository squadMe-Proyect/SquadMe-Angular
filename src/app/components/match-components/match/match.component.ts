import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Match } from 'src/app/interfaces/match';
import { Player } from 'src/app/interfaces/player';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss'],
})
export class MatchComponent  implements OnInit {

  @Input() match:Match | null = null
  @Input() user:any
  @Output() onEditClick = new EventEmitter<void>()
  @Output() onFinishedClick = new EventEmitter<void>()
  @Input() forwards:Player[] = []
  @Input() midfielders:Player[] = []
  @Input() defenses:Player[] = []
  @Input() goalkeeper:Player | undefined

  constructor() {}

  ngOnInit() {}

  onEditClicked(ev:Event) {
    ev.stopPropagation()
    this.onEditClick.emit()
  }

  onFinishedClicked(ev:Event) {
    ev.stopPropagation()
    this.onFinishedClick.emit()
  }

}
