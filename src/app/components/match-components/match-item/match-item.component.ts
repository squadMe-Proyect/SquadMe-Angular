import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Match } from 'src/app/interfaces/match';

@Component({
  selector: 'app-match-item',
  templateUrl: './match-item.component.html',
  styleUrls: ['./match-item.component.scss'],
})
export class MatchItemComponent  implements OnInit {

  @Input() match:Match | null = null
  @Input() teamName:string = ""
  @Input() isAdmin:boolean = false
  @Output() onDeleteClick = new EventEmitter<void>()
  constructor() { }

  ngOnInit() {}

  onDeleteClicked(ev:Event) {
    ev.stopPropagation()
    this.onDeleteClick.emit()
  }
}
