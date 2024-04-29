import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonDatetime, IonDatetimeButton, IonInput, IonPopover, ModalController, ToastController, ToastOptions } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { Match } from 'src/app/interfaces/match';
import { Squad } from 'src/app/interfaces/squad';
import { CustomTranslateService } from 'src/app/services/custom-translate.service';

@Component({
  selector: 'app-match-form',
  templateUrl: './match-form.component.html',
  styleUrls: ['./match-form.component.scss'],
})
export class MatchFormComponent implements OnInit {
  form:FormGroup
  mode:'Edit' | 'New' = 'New'
  @Input() squads:Squad[] | undefined
  @Input('match') set match(_match:Match|null) {
    if(_match) {
      this.mode = 'Edit'
      this.form.controls['id'].setValue(_match.id)
      this.form.controls['opponent'].setValue(_match.opponent)
      this.form.controls['date'].setValue(_match.date)
      this.form.controls['squad'].setValue(_match.squad.name+" ("+_match.squad.lineUp+")")
    }
  }
  constructor(
    private formB:FormBuilder,
    private modal:ModalController,
    public translate:CustomTranslateService,
    private toast:ToastController
  ) { 
    this.form = formB.group({
      id:[null],
      opponent:['',[Validators.required]],
      date:['',[Validators.required]],
      squad:['',[Validators.required]]
    })
  }

  ngOnInit() {}

  onSubmit() {
    this.modal.dismiss(this.form.value, 'ok')
  }

  onCancel() {
    this.modal.dismiss(null, 'cancel')
  }

  onSelectSquad(popover:IonPopover, input:IonInput, squad:Squad) {
    this.form.controls['squad'].setValue(squad.name)
    input.value = squad.name
    popover.dismiss()
  }

  async onSelectDate(popover:IonPopover, input:IonInput, dateTime:IonDatetime) {
    if(!dateTime.value) {
      const message = await lastValueFrom(this.translate.get('match.error.dateNotSelected'))
      const options:ToastOptions = {
        message:message,
        duration:1000,
        position:'bottom',
        color:'danger',
        cssClass:'red-toast'
      }
      this.toast.create(options).then(toast=>toast.present())
    } else {
      const day = dateTime.value?.slice(0,10)
      const hour = dateTime.value?.slice(day?.length!! + 1, dateTime.value.length - 3)
      console.log(day)
      console.log(hour)
      this.form.controls['date'].setValue(day+" - "+hour)
      input.value = day+" - "+hour
      popover.dismiss()
    }
  }
}
