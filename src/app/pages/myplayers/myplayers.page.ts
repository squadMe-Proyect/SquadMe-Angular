import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ModalController, ToastController, ToastOptions } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { PlayerFormComponent } from 'src/app/components/player-components/player-form/player-form.component';
import { PlayerInfoComponent } from 'src/app/components/player-components/player-info/player-info.component';
import { Player } from 'src/app/interfaces/player';
import { UserRegisterInfo } from 'src/app/interfaces/user-register-info';
import { AuthService } from 'src/app/services/api/auth.service';
import { MediaService } from 'src/app/services/api/media.service';
import { CustomTranslateService } from 'src/app/services/custom-translate.service';
import { ExportDataService } from 'src/app/services/firebase/export-data.service';
import { MatchService } from 'src/app/services/match.service';
import { PlayerService } from 'src/app/services/player.service';
import { SquadService } from 'src/app/services/squad.service';

@Component({
  selector: 'app-myplayers',
  templateUrl: './myplayers.page.html',
  styleUrls: ['./myplayers.page.scss'],
})
export class MyplayersPage implements OnInit {

  loading: boolean = false
  players:Player[] = []
  user:any
  constructor(
    public playerSvc: PlayerService,
    public squadSvc: SquadService,
    public matchSvc: MatchService,
    private modal: ModalController,
    public mediaSvc: MediaService,
    private toast:ToastController,
    public authSvc:AuthService,
    public translate:CustomTranslateService,
    public exportDataSvc:ExportDataService
  ) {
    this.loading = true 
    this.authSvc.user$.subscribe(u => {
      this.user = u
      this.onLoadPlayers(u)
    })
  }

  ngOnInit() {}

  async onLoadPlayers(user:any) {
    this.loading = false;
    this.playerSvc.players$.subscribe(_players => {
      const ps = [..._players]
      this.players = ps.filter(p => p.coachId == user.id || p.coachId == user.coachId)
    })
  }

  onFilter(evt:any) {
    this.filter(evt.target.value.toLowerCase())
  }

  private async filter(value:string) {
    const query = value
    this.playerSvc.players$.subscribe(_players => {
      var userPlayers = [..._players.filter(p => p.coachId == this.user.id || p.coachId == this.user.coachId)]
      this.players = userPlayers.filter(p => p.name.toLowerCase().includes(query) || p.surname.toLowerCase().includes(query))
    })
  }

  async presentForm(data: Player | null, onDismiss: (result: any) => void) {
    const modal = await this.modal.create({
      component: PlayerFormComponent,
      cssClass:"form-modal",
      componentProps: {
        player: data
      }
    })
    modal.present()
    modal.onDidDismiss().then(result => {
      if (result?.data) {
        onDismiss(result)
      }
    })
  }

  async seeDetailsPlayer(data: Player | undefined) {
    const modal = await this.modal.create({
      component: PlayerInfoComponent,
      cssClass:"form-modal",
      componentProps: {
        player: data
      }
    })
    modal.present()
  }

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

  onNewPlayer() {
    var onDismiss = async (info: any) => {
      switch (info.role) {
        case 'ok': {
          this.loading = true
          const user = this.user
          var userReg:UserRegisterInfo = {
            email:info.data.email,
            name:info.data.name,
            surname:info.data.surname,
            password:info.data.password,
            teamName:this.user.teamName,
            nation:info.data.nation,
            number:info.data.number,
            role:'PLAYER'
          }
          const pCreated = await lastValueFrom(this.authSvc.register(userReg))
          var player:any = {
            id:pCreated.id,
            name:pCreated.name,
            surname:pCreated.surname,
            email:pCreated.email,
            nation:pCreated.nation,
            position:info.data.position,
            teamName:pCreated.teamName,
            number:info.data.number,
            picture:info.data.picture,
            role:pCreated.role
          }
          if (info.data.picture) {
            this.dataURLtoBlob(info.data.picture, (blob: Blob) => {
              this.mediaSvc.upload(blob).subscribe(async (media: any) => {
                player.picture = media.file
                this.playerSvc.addPlayer(player, user).subscribe(_=>{ 
                  this.onLoadPlayers(user)
                })
              })
            })
          } else if (info.data.picture == "") {
            this.playerSvc.addPlayer(player, user).subscribe(_=>{ 
              this.onLoadPlayers(user)
            })
          }
        }
        break;
      }
    }
    this.presentForm(null, onDismiss)
  }

  onDeletePlayer(player: Player) {
    this.loading = true
    this.playerSvc.deletePlayer(player, this.user).subscribe({
      next: (player:any) => {
        console.log(player)
      },
      error: async (err:any) => {
        const message = await lastValueFrom(this.translate.get('player.playerInSquad'))
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
    this.onLoadPlayers(this.user);
  }

  onEditPlayer(player: Player) {
    var onDismiss = async (info: any) => {
      switch (info.role) {
        case 'ok': {
          this.loading = true
          var _player = {
            id:info.data.id,
            name:info.data.name,
            surname:info.data.surname,
            position:info.data.position,
            email:player.email,
            nation:info.data.nation,
            role:player.role,
            picture:"",
            teamName:player.teamName,
            number:info.data.number,
            goals:info.data.numbers,
            assists:info.data.assists,
            yellowCards:info.data.yellowCards,
            redCards:info.data.redCards
          }
          if (info.data.picture) {
            const _picture:string = info.data.picture
            if(_picture.substring(0,4) == 'data') {
              this.dataURLtoBlob(info.data.picture, (blob: Blob) => {
                this.mediaSvc.upload(blob).subscribe((media: any) => {
                  _player.picture = media.file
                  console.log(_player)
                  this.playerSvc.updatePlayer(_player, this.user).subscribe(_=>{
                    this.onLoadPlayers(this.user);
                  })
                  this.squadSvc.updatePlayerInSquad(_player, this.user).subscribe()
                  this.matchSvc.updatePlayerOnSquadMatch(_player, this.user).subscribe()
                })
              })
            } else {
              player = info.data
              this.playerSvc.updatePlayer(player, this.user).subscribe(p=>{
                this.onLoadPlayers(this.user);
                this.squadSvc.updatePlayerInSquad(p, this.user).subscribe()
                this.matchSvc.updatePlayerOnSquadMatch(p, this.user).subscribe()
              })
            }
          } else if (info.data.picture == null || info.data.picture == "") {
            this.playerSvc.updatePlayer(_player, this.user).subscribe(_=>{
              this.onLoadPlayers(this.user);
            })
            this.squadSvc.updatePlayerInSquad(_player, this.user).subscribe()
            this.matchSvc.updatePlayerOnSquadMatch(_player, this.user).subscribe()
          }
        }
          break;
      }
    }
    this.presentForm(player, onDismiss)
  }

  exportCsvData() {
    this.exportDataSvc.exportToCsv("players", this.user)
  }
}