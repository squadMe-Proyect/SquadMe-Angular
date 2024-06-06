import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
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
  
  squads: Squad[] = []
  private user:any
  coachId:string | undefined
  loading:boolean = false
  constructor(
    public squadsSvc:SquadService,
    private modal:ModalController,
    public authSvc:AuthService,
    public matchSvc:MatchService
  ) {
    this.authSvc.user$.subscribe(u => {
      this.user = u
      if(this.user.role == 'ADMIN') {
        this.coachId = this.user.id
      } else {
        this.coachId = this.user.coachId
      }
    })
  }

  ngOnInit() {
    this.loading = true
    this.onLoadSquads()
  }

  onLoadSquads(page:number = 0, refresh:any = null) {
    this.loading = false
    this.squadsSvc.squads$.subscribe(_squads => {
      console.log(this.user?.id)
      this.squads = _squads.filter(s => s.coachId == this.coachId)
      console.log(this.squads)
    })
    /*this.squads.query("").subscribe(response => {
      this._squads.next(response)
      if(refresh)
        refresh.complete()
      this.loading = false
    })*/
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
        this.onLoadSquads()
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
            this.onLoadSquads()
          })
          this.matchSvc.updateSquadOnMatch(squad, this.user).subscribe()
        }
        break;
        case 'cancel': {
          this.loading = true
          this.squadsSvc.getSquad(squad.id!).subscribe(_=> {
            this.onLoadSquads()
          })
        }
      }
    }
    this.presentForm(squad, onDismiss)
  }

  onDeleteSquad(squad:Squad) {
    this.loading = true
    this.squadsSvc.deleteSquad(squad, this.user).subscribe()
    this.onLoadSquads()
  }
}
