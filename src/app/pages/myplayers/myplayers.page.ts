import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController, ToastOptions } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { PlayerFormComponent } from 'src/app/components/player-components/player-form/player-form.component';
import { Player } from 'src/app/interfaces/player';
import { UserRegisterInfo } from 'src/app/interfaces/user-register-info';
import { AuthService } from 'src/app/services/api/auth.service';
import { MediaService } from 'src/app/services/api/media.service';
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
  private user:any
  constructor(
    public playerSvc: PlayerService,
    public squadSvc: SquadService,
    private modal: ModalController,
    private mediaSvc: MediaService,
    private toast:ToastController,
    private authSvc:AuthService
  ) { 
    this.authSvc.user$.subscribe(u => { this.user = u })
  }

  ngOnInit() {
    this.loading = true
    this.onLoadPlayers()
  }

  async onLoadPlayers(page: number = 0, refresh: any = null) {
    this.loading = false;
    this.playerSvc.players$.subscribe(_players => {
      console.log(this.user?.name)
      this.players = _players.filter(p => p.coachId == this.user?.id || p.coachId == this.user?.coachId)
    })
    /*
    this.playerSvc.query("").subscribe(response => {
      this._players.next(response)
      if (refresh)
        refresh.complete()
      this.loading = false
    })
    */
  }

  async presentForm(data: Player | null, onDismiss: (result: any) => void) {
    const modal = await this.modal.create({
      component: PlayerFormComponent,
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
            role:'PLAYER'
          }
          if (info.data.picture) {
            this.dataURLtoBlob(info.data.picture, (blob: Blob) => {
              this.mediaSvc.upload(blob).subscribe(async (media: any) => {
                const pCreated = await lastValueFrom(this.authSvc.register(userReg))
                var player:any = {
                  id:pCreated.id,
                  name:pCreated.name,
                  surname:pCreated.surname,
                  email:pCreated.email,
                  nation:pCreated.nation,
                  position:info.data.position,
                  teamName:pCreated.teamName,
                  picture:media.file,
                  role:pCreated.role
                }
                this.playerSvc.addPlayer(player, user).subscribe(_=>{ 
                  this.onLoadPlayers()
                })
              })
            })
          } else if (info.data.picture == "") {
            const pCreated = await lastValueFrom(this.authSvc.register(userReg))
            var player:any = {
              id:pCreated.id,
              name:pCreated.name,
              surname:pCreated.surname,
              email:pCreated.email,
              nation:pCreated.nation,
              position:info.data.position,
              teamName:pCreated.teamName,
              picture:info.data.picture,
              role:pCreated.role
            }
            this.playerSvc.addPlayer(player, user).subscribe(_=>{ 
              this.onLoadPlayers()
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
      error: (err:any) => {
        const options:ToastOptions = {
          message:`El jugador que quieres borrar está en una plantilla`,
          duration:1000,
          position:'bottom',
          color:'danger',
          cssClass:'red-toast'
        }
        this.toast.create(options).then(toast=>toast.present())
        console.error(err)
      }
    })
    this.onLoadPlayers();
  }

  onEditPlayer(player: Player) {
    var onDismiss = (info: any) => {
      switch (info.role) {
        case 'ok': {
          this.loading = true
          if (info.data.picture) {
            const _picture:string = info.data.picture
            if(_picture.substring(0,4) == 'data') {
              this.dataURLtoBlob(info.data.picture, (blob: Blob) => {
                this.mediaSvc.upload(blob).subscribe((media: any) => {
                  const _player = {
                    id:info.data.id,
                    name:info.data.name,
                    surname:info.data.surname,
                    position:info.data.position,
                    email:player.email,
                    nation:info.data.nation,
                    role:player.role,
                    picture:media.file,
                    teamName:player.teamName
                  }
                  console.log(_player)
                  this.playerSvc.updatePlayer(_player, this.user).subscribe(_=>{
                    this.onLoadPlayers();
                  })
                  this.squadSvc.updatePlayerInSquad(_player, this.user).subscribe()
                })
              })
            } else {
              player = info.data
              this.playerSvc.updatePlayer(player, this.user).subscribe(p=>{
                this.onLoadPlayers();
                this.squadSvc.updatePlayerInSquad(p, this.user).subscribe()
              })
            }
          } else if (info.data.picture == null || info.data.picture == "") {
            const _player = {
              id:info.data.id,
              name:info.data.name,
              surname:info.data.surname,
              position:info.data.position,
              email:player.email,
              nation:info.data.nation,
              role:player.role,
              picture:"",
              teamName:player.teamName
            }
            this.playerSvc.updatePlayer(_player, this.user).subscribe(_=>{
              this.onLoadPlayers();
            })
            this.squadSvc.updatePlayerInSquad(_player, this.user).subscribe()
          }
        }
          break;
      }
    }
    this.presentForm(player, onDismiss)
  }
}
