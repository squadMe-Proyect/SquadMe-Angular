import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController, ToastOptions } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { PlayerFormComponent } from 'src/app/components/player-components/player-form/player-form.component';
import { PlayerInfoComponent } from 'src/app/components/player-components/player-info/player-info.component';
import { Player } from 'src/app/interfaces/player';
import { UserRegisterInfo } from 'src/app/interfaces/user-register-info';
import { AuthService } from 'src/app/services/api/auth.service';
import { MediaService } from 'src/app/services/api/media.service';
import { CustomTranslateService } from 'src/app/services/auxiliar/custom-translate.service';
import { ExportDataService } from 'src/app/services/auxiliar/export-data.service';
import { MatchService } from 'src/app/services/model/match.service';
import { PlayerService } from 'src/app/services/model/player.service';
import { SquadService } from 'src/app/services/model/squad.service';

/**
 * Página para gestionar jugadores.
 * Permite ver, filtrar, editar y eliminar jugadores.
 */
@Component({
  selector: 'app-myplayers',
  templateUrl: './myplayers.page.html',
  styleUrls: ['./myplayers.page.scss'],
})
export class MyplayersPage implements OnInit {

  loading: boolean = false;
  players: Player[] = [];
  user: any;

  /**
   * Constructor de MyplayersPage.
   * @param playerSvc Servicio de gestión de jugadores (`PlayerService`).
   * @param squadSvc Servicio de gestión de escuadras (`SquadService`).
   * @param matchSvc Servicio de gestión de partidos (`MatchService`).
   * @param modal Controlador de modales (`ModalController`).
   * @param mediaSvc Servicio para manejo de medios (`MediaService`).
   * @param toast Controlador de toasts (`ToastController`).
   * @param authSvc Servicio de autenticación (`AuthService`).
   * @param translate Servicio para traducciones personalizadas (`CustomTranslateService`).
   * @param exportDataSvc Servicio para exportación de datos (`ExportDataService`).
   */
  constructor(
    public playerSvc: PlayerService,
    public squadSvc: SquadService,
    public matchSvc: MatchService,
    private modal: ModalController,
    public mediaSvc: MediaService,
    private toast: ToastController,
    public authSvc: AuthService,
    public translate: CustomTranslateService,
    public exportDataSvc: ExportDataService
  ) {
    this.loading = true;
    this.authSvc.user$.subscribe(u => {
      this.user = u;
      this.onLoadPlayers(u);
    });
  }

  /**
   * Método del ciclo de vida de Angular que se llama al inicializarse el componente.
   */
  ngOnInit() { }

  /**
   * Carga los jugadores del usuario actual.
   * @param user Usuario actual.
   */
  async onLoadPlayers(user: any) {
    this.loading = false;
    this.playerSvc.players$.subscribe(_players => {
      const ps = [..._players];
      this.players = ps.filter(p => p.coachId == user.id || p.coachId == user.coachId);
    });
  }

  /**
   * Filtra los jugadores según el valor ingresado.
   * @param evt Evento que contiene el valor del filtro.
   */
  onFilter(evt: any) {
    this.filter(evt.target.value.toLowerCase());
  }

  /**
   * Realiza el filtrado de jugadores según el valor.
   * @param value Valor por el cual filtrar los jugadores.
   */
  private async filter(value: string) {
    const query = value;
    this.playerSvc.players$.subscribe(_players => {
      var userPlayers = [..._players.filter(p => p.coachId == this.user.id || p.coachId == this.user.coachId)];
      this.players = userPlayers.filter(p => p.name.toLowerCase().includes(query) || p.surname.toLowerCase().includes(query));
    });
  }

  /**
   * Presenta un formulario para agregar o editar un jugador.
   * @param data Datos del jugador para editar o `null` para agregar uno nuevo.
   * @param onDismiss Función a ejecutar cuando se cierra el modal.
   */
  async presentForm(data: Player | null, onDismiss: (result: any) => void) {
    const modal = await this.modal.create({
      component: PlayerFormComponent,
      cssClass: "form-modal",
      componentProps: {
        player: data
      }
    });
    modal.present();
    modal.onDidDismiss().then(result => {
      if (result?.data) {
        onDismiss(result);
      }
    });
  }

  /**
   * Presenta los detalles de un jugador.
   * @param data Datos del jugador para mostrar.
   */
  async seeDetailsPlayer(data: Player | undefined) {
    const modal = await this.modal.create({
      component: PlayerInfoComponent,
      cssClass: "form-modal",
      componentProps: {
        player: data
      }
    });
    modal.present();
  }

  /**
   * Convierte una URL de datos en formato blob.
   * @param dataUrl URL de datos a convertir.
   * @param callback Función de retorno que recibe el blob convertido.
   */
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
  
  /**
   * Agrega un nuevo jugador.
   */
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

  /**
   * Elimina un jugador.
   * @param player Jugador a eliminar.
   */
  onDeletePlayer(player: Player) {
    this.loading = true;
    this.playerSvc.deletePlayer(player, this.user).subscribe({
      next: (player: any) => {
        console.log(player);
      },
      error: async (err: any) => {
        const message = await lastValueFrom(this.translate.get('player.playerInSquad'));
        const options: ToastOptions = {
          message: message,
          duration: 1000,
          position: 'bottom',
          color: 'danger',
          cssClass: 'red-toast'
        };
        this.toast.create(options).then(toast => toast.present());
        console.error(err);
      }
    });
    this.onLoadPlayers(this.user);
  }

  /**
   * Edita un jugador existente.
   * @param player Jugador a editar.
   */
  onEditPlayer(player: Player) {
    var onDismiss = async (info: any) => {
      switch (info.role) {
        case 'ok': {
          this.loading = true;
          var _player = {
            id: info.data.id,
            name: info.data.name,
            surname: info.data.surname,
            position: info.data.position,
            email: player.email,
            nation: info.data.nation,
            role: player.role,
            picture: "",
            teamName: player.teamName,
            number: info.data.number,
            goals: info.data.goals,
            assists: info.data.assists,
            yellowCards: info.data.yellowCards,
            redCards: info.data.redCards
          };
          if (info.data.picture) {
            const _picture: string = info.data.picture;
            if (_picture.substring(0, 4) == 'data') {
              this.dataURLtoBlob(info.data.picture, (blob: Blob) => {
                this.mediaSvc.upload(blob).subscribe((media: any) => {
                  _player.picture = media.file;
                  console.log(_player);
                  this.playerSvc.updatePlayer(_player, this.user).subscribe(_ => {
                    this.onLoadPlayers(this.user);
                  });
                  this.squadSvc.updatePlayerInSquad(_player, this.user).subscribe();
                  this.matchSvc.updatePlayerOnSquadMatch(_player, this.user).subscribe();
                });
              });
            } else {
              player = info.data;
              this.playerSvc.updatePlayer(player, this.user).subscribe(p => {
                this.onLoadPlayers(this.user);
                this.squadSvc.updatePlayerInSquad(p, this.user).subscribe();
                this.matchSvc.updatePlayerOnSquadMatch(p, this.user).subscribe();
              });
            }
          } else if (info.data.picture == null || info.data.picture == "") {
            this.playerSvc.updatePlayer(_player, this.user).subscribe(_ => {
              this.onLoadPlayers(this.user);
            });
            this.squadSvc.updatePlayerInSquad(_player, this.user).subscribe();
            this.matchSvc.updatePlayerOnSquadMatch(_player, this.user).subscribe();
          }
        }
        break;
      }
    };
    this.presentForm(player, onDismiss);
  }

  /**
   * Exporta los datos de los jugadores a un archivo CSV.
   */
  exportCsvData() {
    this.exportDataSvc.exportToCsv("players", this.user);
  }
}