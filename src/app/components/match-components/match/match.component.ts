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
  @Output() onDeleteClick = new EventEmitter<void>()
  forwards:Player[] = []
  midfielders:Player[] = []
  defenses:Player[] = []
  goalkeeper:Player | undefined

  constructor() {}

  ngOnInit() {
    this.match?.squad.players.forEach(player => {
      if(player.position == "Delantero") {
        this.forwards.push(player)
      } else if(player.position == "Centrocampista") {
        this.midfielders.push(player)
      } else if(player.position == "Defensa") {
        this.defenses.push(player)
      } else {
        this.goalkeeper = player
      }
    })
  }

  onEditClicked(ev:Event) {
    ev.stopPropagation()
    this.onEditClick.emit()
  }

  onDeleteClicked(ev:Event) {
    ev.stopPropagation()
    this.onDeleteClick.emit()
  }

}
