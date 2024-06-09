import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController, ToastOptions } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { SquadFormComponent } from 'src/app/components/squad-components/squad-form/squad-form.component';
import { Coach } from 'src/app/interfaces/coach';
import { Squad } from 'src/app/interfaces/squad';
import { AuthService } from 'src/app/services/api/auth.service';
import { CustomTranslateService } from 'src/app/services/custom-translate.service';
import { MatchService } from 'src/app/services/match.service';
import { SquadService } from 'src/app/services/squad.service';

@Component({
  selector: 'app-mysquads',
  templateUrl: './mysquads.page.html',
  styleUrls: ['./mysquads.page.scss'],
})
export class MySquadsPage implements OnInit {
  coachId:string | undefined
  squads: Squad[] = []
  private user:any
  loading:boolean = false
  constructor(
    public squadsSvc:SquadService,
    private modal:ModalController,
    public authSvc:AuthService,
    public matchSvc:MatchService,
    private toast:ToastController,
    public translate:CustomTranslateService
  ) {
    this.loading = true
    this.authSvc.user$.subscribe(u => {
      this.user = u
      this.onLoadSquads(u)
      if(this.user.role == 'ADMIN') {
        this.coachId = this.user.id
      } else {
        this.coachId = this.user.coachId
      }
    })
  }

  ngOnInit() {}

  onLoadSquads(user:any) {
    this.loading = false
    this.squadsSvc.squads$.subscribe(_squads => {
      const sqs = [..._squads]
      this.squads = sqs.filter(s => s.coachId == user.id || s.coachId == user.coachId)
      console.log(this.squads)
    })
  }

  async presentForm(data:Squad | null, onDismiss:(result:any)=>void) {
    const modal = await this.modal.create({
      component:SquadFormComponent,
      componentProps: {
        squad:data,
        coachId:this.coachId
      },
      cssClass:'squad-modal'
    })
    modal.present()
    modal.onDidDismiss().then(result => {
      if(result?.data) {
        onDismiss(result)
      }
    })
  }

  onNewSquad() {
    var onDismiss = (info:any) => {
      this.loading = true
      this.squadsSvc.addSquad(info.data, this.user).subscribe(_=>{
        this.onLoadSquads(this.user)
      })
    }
    this.presentForm(null, onDismiss)
  }

  onEditSquad(squad:Squad) {
    var onDismiss = (info:any) => {
      switch (info.role) {
        case 'ok': {
          this.loading = true
          squad = info.data
          this.squadsSvc.updateSquad(squad, this.user).subscribe(_=>{
            this.onLoadSquads(this.user)
          })
          this.matchSvc.updateSquadOnMatch(squad, this.user).subscribe()
        }
        break;
        case 'cancel': {
          this.loading = true
          this.squadsSvc.getSquad(squad.id!).subscribe(_=> {
            this.onLoadSquads(this.user)
          })
        }
      }
    }
    this.presentForm(squad, onDismiss)
  }

  onDeleteSquad(squad:Squad) {
    this.loading = true
    this.squadsSvc.deleteSquad(squad, this.user).subscribe({
      next: (_:any) => {},
      error: async (err:any) => {
        const message = await lastValueFrom(this.translate.get('squad.squadInMatch'))
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
    this.onLoadSquads(this.user)
  }
}
