import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, ToastOptions } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { UserCredentials } from 'src/app/interfaces/user-credentials';
import { AuthService } from 'src/app/services/api/auth.service';
import { CustomTranslateService } from 'src/app/services/custom-translate.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    public auth:AuthService,
    private router:Router,
    private toast:ToastController,
    public translate:CustomTranslateService
  ) { }

  ngOnInit() {
  }

  onLogin(credentials:UserCredentials) {
    this.auth.login(credentials).subscribe({
      next: (user:any) => {
        console.log(user)
        this.router.navigate(['/home'])
      },
      error: async (err: any) => {
        const message = await lastValueFrom(this.translate.get('login.error.badCredentials'))
        const options:ToastOptions = {
          message:message,
          duration:1000,
          position:'bottom',
          color:'danger',
          cssClass:'red-toast'
        }
        this.toast.create(options).then(toast=>toast.present())
        console.error(err)
      }
    })
  }
}