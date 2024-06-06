import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Coach } from 'src/app/interfaces/coach';
import { Player } from 'src/app/interfaces/player';

@Component({
  selector: 'app-user-component',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent  implements OnInit {

  @Input() user:Player | Coach | null = null
  @Output() onEditClick = new EventEmitter<void>()
  @Output() onChangePasswordClick = new EventEmitter<void>()
  constructor() { }

  ngOnInit() {}

  onEditClicked(ev:Event) {
    ev.stopPropagation()
    this.onEditClick.emit()
  }

  onChangePasswordClicked(ev:Event) {
    ev.stopPropagation()
    this.onChangePasswordClick.emit()
  }

}
