import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonModal, ToastController, ToastOptions } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { Coach } from 'src/app/interfaces/coach';
import { Player } from 'src/app/interfaces/player';
import { AuthService } from 'src/app/services/api/auth.service';
import { MediaService } from 'src/app/services/api/media.service';
import { CustomTranslateService } from 'src/app/services/auxiliar/custom-translate.service';
import { CoachService } from 'src/app/services/model/coach.service';
import { PlayerService } from 'src/app/services/model/player.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {
  form:FormGroup
  user:Player | Coach | null = null
  openModal:boolean = false
  constructor(
    public authSvc:AuthService,
    private formB:FormBuilder,
    public coachSvc:CoachService,
    public playerSvc:PlayerService,
    public mediaSvc: MediaService,
    private toast:ToastController,
    public translate:CustomTranslateService
  ) {
    this.authSvc.user$.subscribe(u => {
      this.user = u
    })
    this.form = this.formB.group({})
  }

  ngOnInit() {}

  private dataURLtoBlob(dataUrl: string, callback: (blob: Blob) => void) {
    var req = new XMLHttpRequest;

    req.open('GET', dataUrl);
    req.responseType = 'arraybuffer';

    req.onload = function fileLoaded(e) {
      var mime = this.getResponseHeader('content-type');

      callback(new Blob([this.response], { type: mime || undefined }));
    };

    req.send();
  }

  setOpen(open:boolean) {
    this.form = this.formB.group({
      id:[this.user?.id],
      name:[this.user?.name, [Validators.required]],
      surname:[this.user?.surname, [Validators.required]],
      nation:[this.user?.nation, [Validators.required]],
      picture:[this.user?.picture]
    })
    this.openModal = open
  }

  async onSubmit(modal:IonModal) {
    const previousTeam = this.user?.teamName
    var updatedCoach = {
      id:this.form.controls['id'].value,
      name:this.form.controls['name'].value,
      surname:this.form.controls['surname'].value,
      teamName:this.user?.teamName!!,
      nation:this.form.controls['nation'].value,
      picture:this.form.controls['picture'].value,
      role:this.user?.role!!,
      email:this.user?.email!!
    }
    if(updatedCoach.picture == null) {
      updatedCoach.picture = ""
      this.authSvc.setUser(updatedCoach).subscribe()
      this.coachSvc.updateCoach(this.form.value).subscribe()
      modal.dismiss()
    } else {
      if(updatedCoach.picture.substring(0,4) == "data") {
        this.dataURLtoBlob(updatedCoach.picture, (blob:Blob) => {
          this.mediaSvc.upload(blob).subscribe((media:any) => {
            updatedCoach.picture = media.file
            this.authSvc.setUser(updatedCoach).subscribe()
            this.coachSvc.updateCoach(updatedCoach).subscribe()
            modal.dismiss()
          })
        })
      } else {
        this.authSvc.setUser(updatedCoach).subscribe()
        this.coachSvc.updateCoach(updatedCoach).subscribe()
        modal.dismiss()
      }
    }
  }

  resetPassword() {
    this.authSvc.resetPassword().subscribe(async _=>{
      const message = await lastValueFrom(this.translate.get('user-card.password-message'))
      const options:ToastOptions = {
        message:message,
        duration:1000,
        position:'bottom',
        color:'tertiary',
        cssClass:'red-toast'
      }
      this.toast.create(options).then(toast=>toast.present())
    })
  }

  onCancel(modal:IonModal) {
    modal.dismiss()
  }
}
