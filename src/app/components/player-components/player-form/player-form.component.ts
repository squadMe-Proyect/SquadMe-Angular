import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonInput, IonPopover, ModalController } from '@ionic/angular';
import { Player } from 'src/app/interfaces/player';
import { PasswordValidation } from 'src/app/validators/password';

@Component({
  selector: 'app-player-form',
  templateUrl: './player-form.component.html',
  styleUrls: ['./player-form.component.scss'],
})
export class PlayerFormComponent  implements OnInit {
  isNotGoalkeeper:boolean = false
  form:FormGroup
  mode:'New' | 'Edit' = 'New'
  @Input('player') player:Player|undefined
  constructor(
    private formB:FormBuilder,
    private modal:ModalController,
  ) {
    this.form = this.formB.group({
      id:[null],
      name:['',[Validators.required]],
      surname:['',[Validators.required]],
      email:['',[Validators.required]],
      position:['',[Validators.required]],
      nation:['',[Validators.required]],
      number:[0,[Validators.required]],
      picture:[''],
      password:['',[Validators.required, PasswordValidation.passwordProto('password')]],
      confirm:['',[Validators.required, PasswordValidation.passwordProto('confirm')]]
    })
  }

  ngOnInit() {
    if(this.player) {
      this.mode = 'Edit'
      this.form = this.formB.group({
        id:[this.player.id],
        name:[this.player.name,[Validators.required]],
        surname:[this.player.surname,[Validators.required]],
        position:[this.player.position,[Validators.required]],
        nation:[this.player.nation,[Validators.required]],
        number:[this.player.number,[Validators.required]],
        goals:[this.player.goals],
        assists:[this.player.assists],
        yellowCards:[this.player.yellowCards],
        redCards:[this.player.redCards],
        picture:[this.player.picture]
      })
      this.isNotGoalkeeper = (this.player.position != 'Portero')
    }
  }

  onSubmit() {
    this.modal.dismiss(this.form.value, 'ok')
  }

  onCancel() {
    this.modal.dismiss(null, 'cancel')
  }

  onSelectPosition(popover:IonPopover, input:IonInput, position:string) {
    this.form.controls['position'].setValue(position)
    input.value = position
    this.isNotGoalkeeper = (position != 'Portero')
    popover.dismiss()
  }
}