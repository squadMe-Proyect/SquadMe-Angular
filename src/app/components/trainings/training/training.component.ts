import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonButton, IonCheckbox } from '@ionic/angular';
import { Training } from 'src/app/interfaces/training';

@Component({
  selector: 'app-training-component',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss'],
})
export class TrainingComponent  implements OnInit {

  @Input() training:Training | undefined
  @Input() isAdmin:boolean = false
  @Output() onEditClick = new EventEmitter<void>()
  @Output() onDeleteClick = new EventEmitter<void>()
  @Output() onFinishedTraining = new EventEmitter<boolean>()
  constructor() { }

  ngOnInit() {}

  onEditClicked(ev:Event) {
    ev.stopPropagation()
    this.onEditClick.emit()
  }

  onDeleteClicked(ev:Event) {
    ev.stopPropagation()
    this.onDeleteClick.emit()
  }

  checkExercise(ev:Event, checkbox:IonCheckbox, button:IonButton){
    ev.stopPropagation()
    const newValue = !checkbox.checked
    if(newValue) {
      button.disabled = false
      this.onFinishedTraining.emit(true)
    } else {
      button.disabled = true
      this.onFinishedTraining.emit(false)
    }
  }
}
