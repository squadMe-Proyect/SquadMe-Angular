import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, ToastOptions } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { UserRegisterInfo } from 'src/app/interfaces/user-register-info';
import { AuthService } from 'src/app/services/api/auth.service';
import { CustomTranslateService } from 'src/app/services/auxiliar/custom-translate.service';
import { CoachService } from 'src/app/services/model/coach.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor(
    private auth:AuthService,
    private cSvc:CoachService,
    private router:Router,
    private toast:ToastController,
    public translate:CustomTranslateService
  ) { }

  ngOnInit() {
  }

  onRegister(info:UserRegisterInfo) {
    this.auth.register(info).subscribe({
      next: (user) => {
        user.role = 'ADMIN'
        this.cSvc.createCoach(user).subscribe()
        this.router.navigate(['/home'])
      },
      error: async (err:any) => {
        console.log(err)
        if(err.code == "auth/email-already-in-use") {
          const messageKey = 'register.error.existingEmail'
          const message = await lastValueFrom(this.translate.get(messageKey))
          const options:ToastOptions = {
            message:message,
            duration:1000,
            position:'bottom',
            color:'danger',
            cssClass:'red-toast'
          }
          this.toast.create(options).then(toast=>toast.present())
        } else if(err.code == "auth/invalid-email") {
          const messageKey = 'register.error.invalidEmail'
          const message = await lastValueFrom(this.translate.get(messageKey))
            const options:ToastOptions = {
              message:message,
              duration:1000,
              position:'bottom',
              color:'danger',
              cssClass:'red-toast'
            }
            this.toast.create(options).then(toast=>toast.present())
        } else {
          const messageKey = 'register.error.errorToRegister'
          const message = await lastValueFrom(this.translate.get(messageKey))
          const options:ToastOptions = {
            message:message,
            duration:1000,
            position:'bottom',
            color:'danger',
            cssClass:'red-toast'
          }
          this.toast.create(options).then(toast=>toast.present())
        }
      } 
    })
  }
}
