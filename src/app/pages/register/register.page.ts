import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Coach } from 'src/app/interfaces/coach';
import { UserRegisterInfo } from 'src/app/interfaces/user-register-info';
import { AuthService } from 'src/app/services/api/auth.service';
import { CoachService } from 'src/app/services/coach.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor(
    private auth:AuthService,
    private cSvc:CoachService,
    private router:Router
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
      error: (err:any) => console.log(err)
    })
  }
}
