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

  form:FormGroup
  mode:'New' | 'Edit' = 'New'
  @Input('player') player:Player|undefined /*{
    if(_player) {
      this.mode = 'Edit'
      /*this.form.controls['id'].setValue(_player.id)
      this.form.controls['name'].setValue(_player.name)
      this.form.controls['surname'].setValue(_player.surname)
      this.form.controls['position'].setValue(_player.position)
      this.form.controls['nation'].setValue(_player.nation)
      this.form.controls['picture'].setValue(_player.picture)
    }
  }*/
  constructor(
    private formB:FormBuilder,
    private modal:ModalController
  ) {
    this.form = this.formB.group({
      id:[null],
      name:['',[Validators.required]],
      surname:['',[Validators.required]],
      email:['',[Validators.required]],
      position:['',[Validators.required]],
      nation:['',[Validators.required]],
      picture:[''],
      password:['',[Validators.required, PasswordValidation.passwordProto('password')]],
      confirm:['',[Validators.required, PasswordValidation.passwordProto('confirm')]]
    })
  }

  ngOnInit() {
    if(this.player) {
      this.mode = 'Edit'
      this.form = this.formB.group({
        id:[this.player?.id],
        name:[this.player?.name,[Validators.required]],
        surname:[this.player?.surname,[Validators.required]],
        position:[this.player?.position,[Validators.required]],
        nation:[this.player?.nation,[Validators.required]],
        picture:[this.player?.picture]
      })
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
    popover.dismiss()
  }
}