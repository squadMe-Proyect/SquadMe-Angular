import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonModal } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { Coach } from 'src/app/interfaces/coach';
import { Player } from 'src/app/interfaces/player';
import { AuthService } from 'src/app/services/api/auth.service';
import { CoachService } from 'src/app/services/coach.service';
import { PlayerService } from 'src/app/services/player.service';

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
    public playerSvc:PlayerService
  ) {
    this.authSvc.user$.subscribe(u => {
      this.user = u
    })
    this.form = this.formB.group({})
  }

  ngOnInit() {
    this.onLoadUser()
  }

  private async onLoadUser() {
    this.coachSvc.coaches$.subscribe(async coaches => {
      if(this.user?.role == 'ADMIN') {
        const _coach:any = coaches.find(c => c.id == this.user?.id)
        this.user = _coach
      } else {
        this.playerSvc.players$.subscribe(players => {
          const _player:any = players.find(p => p.id == this.user?.id)
          this.user = _player
        })
      }
    })
  }

  setOpen(open:boolean) {
    this.form = this.formB.group({
      id:[this.user?.id],
      name:[this.user?.name, [Validators.required]],
      surname:[this.user?.surname, [Validators.required]],
      teamName:[this.user?.teamName, [Validators.required]],
      nation:[this.user?.nation, [Validators.required]],
      picture:[this.user?.picture]
    })
    this.openModal = open
  }

  onSubmit(modal:IonModal) {
    if(this.form.controls['picture'].value == null) {
      this.form.controls['picture'].setValue("")
    }
    this.coachSvc.updateCoach(this.form?.value).subscribe()
    this.onLoadUser()
    modal.dismiss()
  }
}
