import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../services/model/player.service';
import { Player } from 'src/app/interfaces/player';
import { Match } from 'src/app/interfaces/match';
import { IonModal, ModalController } from '@ionic/angular';
import { MatchFormComponent } from 'src/app/components/match-components/match-form/match-form.component';
import { Squad } from 'src/app/interfaces/squad';
import { SquadService } from 'src/app/services/model/squad.service';
import { AuthService } from 'src/app/services/api/auth.service';
import { MatchService } from 'src/app/services/model/match.service';
import { lastValueFrom } from 'rxjs';

/**
 * Componente HomePage.
 * Este componente maneja la lógica para la página principal de la aplicación.
 */
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  /**
   * Jugador con más goles.
   */
  maxGoalsPlayer: Player | undefined;
  /**
   * Jugador con más asistencias.
   */
  maxAssistsPlayer: Player | undefined;
  /**
   * Jugador con más tarjetas amarillas.
   */
  maxYellowPlayer: Player | undefined;
  /**
   * Jugador con más tarjetas rojas.
   */
  maxRedPlayer: Player | undefined;
  /**
   * Lista de escuadrones disponibles para el usuario actual.
   */
  squads: Squad[] | undefined;
  /**
   * Partido actual en juego.
   */
  match: Match | undefined;
  /**
   * Lista de partidos finalizados.
   */
  finishedMatches: Match[] = [];
  /**
   * Información del usuario actual.
   */
  user: any;
  /**
   * Lista de jugadores en la posición de delanteros.
   */
  forwards: Player[] = [];
  /**
   * Lista de jugadores en la posición de mediocampistas.
   */
  midfielders: Player[] = [];
  /**
   * Lista de jugadores en la posición de defensas.
   */
  defenses: Player[] = [];
  /**
   * Jugador en la posición de portero.
   */
  goalkeeper: Player | undefined;
  /**
   * Estado para controlar la apertura del modal.
   */
  openModal: boolean = false;

  /**
   * Constructor del componente HomePage.
   * @param players Servicio de jugadores (`PlayerService`).
   * @param squadSvc Servicio de escuadrones (`SquadService`).
   * @param matchSvc Servicio de partidos (`MatchService`).
   * @param modal Controlador de modales (`ModalController`).
   * @param authSvc Servicio de autenticación (`AuthService`).
   */
  constructor(
    public players: PlayerService,
    public squadSvc: SquadService,
    public matchSvc: MatchService,
    private modal: ModalController,
    public authSvc: AuthService
  ) {
    // Suscribe al observable de usuario para cargar la información necesaria cuando cambie.
    this.authSvc.user$.subscribe(u => {
      this.user = u;
      this.onLoadSquads(u);
      this.onLoadMatch(u);
      this.onLoadPlayerStats(u);
    });
  }

  /**
   * Método del ciclo de vida de Angular que se llama al inicializarse el componente.
   */
  ngOnInit() {}

  /**
   * Establece el estado del modal.
   * @param open `true` para abrir el modal, `false` para cerrarlo.
   */
  setOpen(open: boolean) {
    this.openModal = open;
  }

  /**
   * Verifica si el usuario tiene partidos finalizados.
   * @param user Información del usuario actual.
   * @returns `true` si el usuario tiene partidos finalizados, de lo contrario `false`.
   */
  hasFinishedMatches(user: any): boolean {
    let matches: Match[] = [];
    this.matchSvc.matches$.subscribe(_matches => {
      matches = [..._matches];
    });
    return matches.filter(m => (m.coachId == user.id || m.coachId == user.coachId) && m.finished == true).length > 0;
  }

  /**
   * Cierra el modal de partidos finalizados.
   * @param modal Instancia del modal de Ionic.
   */
  dismissFinishedMatches(modal: IonModal) {
    modal.dismiss();
  }

  /**
   * Carga el partido actual del usuario.
   * @param user Información del usuario actual.
   */
  onLoadMatch(user: any) {
    this.matchSvc.matches$.subscribe(matches => {
      this.finishedMatches = [...matches].filter(m => (m.coachId == user.id || m.coachId == user.coachId) && m.finished == true);
      this.match = [...matches].find(_match => (_match.coachId == user.id || _match.coachId == user.coachId) && _match.finished == false);
      switch (this.match?.squad.lineUp) {
        case "4-3-3":
          this.forwards = this.match?.squad.players.slice(0, 3);
          this.midfielders = this.match?.squad.players.slice(3, 6);
          this.defenses = this.match?.squad.players.slice(6, 10);
          this.goalkeeper = this.match?.squad.players[10];
          break;
        case "4-4-2":
          this.forwards = this.match?.squad.players.slice(0, 2);
          this.midfielders = this.match?.squad.players.slice(2, 6);
          this.defenses = this.match?.squad.players.slice(6, 10);
          this.goalkeeper = this.match?.squad.players[10];
          break;
        case "3-4-3":
          this.forwards = this.match?.squad.players.slice(0, 3);
          this.midfielders = this.match?.squad.players.slice(3, 7);
          this.defenses = this.match?.squad.players.slice(7, 10);
          this.goalkeeper = this.match?.squad.players[10];
          break;
      }
    });
  }

  /**
   * Carga los escuadrones disponibles para el usuario.
   * @param user Información del usuario actual.
   */
  onLoadSquads(user: any) {
    this.squadSvc.squads$.subscribe(_squads => {
      const sqs = [..._squads];
      this.squads = sqs.filter(s => user.id == s.coachId || user.coachId == s.coachId);
    });
  }

  /**
   * Carga las estadísticas de los jugadores para el usuario.
   * @param user Información del usuario actual.
   */
  onLoadPlayerStats(user: any) {
    this.players.players$.subscribe(players => {
      const _players = [...players].filter(p => user.id == p.coachId || user.coachId == p.coachId);
      if (_players.length > 0) {
        let maxGoals = 0;
        let maxAssists = 0;
        let maxYellowCards = 0;
        let maxRedCards = 0;
        _players.forEach(player => {
          if (player.goals!! >= maxGoals) {
            maxGoals = player.goals!!;
            this.maxGoalsPlayer = player;
          }
          if (player.assists!! >= maxAssists) {
            maxAssists = player.assists!!;
            this.maxAssistsPlayer = player;
          }
          if (player.yellowCards!! >= maxYellowCards) {
            maxYellowCards = player.yellowCards!!;
            this.maxYellowPlayer = player;
          }
          if (player.redCards!! >= maxRedCards) {
            maxRedCards = player.redCards!!;
            this.maxRedPlayer = player;
          }
        });
      } else {
        this.maxGoalsPlayer = undefined;
        this.maxAssistsPlayer = undefined;
        this.maxRedPlayer = undefined;
        this.maxYellowPlayer = undefined;
      }
    });
  }

  /**
   * Presenta un formulario modal para crear o editar un partido.
   * @param data Datos del partido para editar o `null` para crear uno nuevo.
   * @param onDismiss Función que se llama cuando se cierra el modal.
   */
  async presentForm(data: Match | null, onDismiss: (result: any) => void) {
    const modal = await this.modal.create({
      component: MatchFormComponent,
      componentProps: {
        match: data,
        squads: this.squads
      },
    });
    modal.present();
    modal.onDidDismiss().then(result => {
      if (result?.data) {
        onDismiss(result);
      }
    });
  }

  /**
   * Abre un formulario modal para crear un nuevo partido.
   */
  onNewMatch() {
    /**
     * Función que se llama cuando se cierra el formulario modal de creación de partido.
     * @param info Información retornada por el modal.
     */
    var onDismiss = async (info:any) => {
      switch(info.role) {
        case 'ok': {
          const squad:Squad = await lastValueFrom(this.squadSvc.getSquadByName(info.data.squad))
          const _match:Match = {
            date:info.data.date,
            opponent:info.data.opponent,
            result:"0-0",
            squad:squad,
            finished:false
          }
          this.matchSvc.addMatch(_match, this.user).subscribe(_=> {
            this.onLoadMatch(this.user)
          })
        }
      }
    }
    this.presentForm(null, onDismiss)
  }

  /**
   * Abre un formulario modal para editar un partido existente.
   * @param match Partido a editar.
   */
  onEditMatch(match: Match) {
    /**
     * Función que se llama cuando se cierra el formulario modal de edición de partido.
     * @param info Información retornada por el modal.
     */
    const onDismiss = async (info: any) => {
      switch (info.role) {
        case 'ok': {
          if (match.coachId == this.user.id || match.coachId == this.user.coachId) {
            const squad: Squad = await lastValueFrom(this.squadSvc.getSquadByName(info.data.squad));
            match = {
              id: match.id,
              date: info.data.date,
              opponent: info.data.opponent,
              result: info.data.result,
              squad: squad,
              coachId: match.coachId,
              finished: false
            };
            this.matchSvc.editMatch(match, this.user).subscribe(_ => {
              this.onLoadMatch(this.user);
            });
          }
        }
        break;
      }
    };
    this.presentForm(match, onDismiss);
  }

  /**
   * Finaliza un partido.
   * @param match Partido a finalizar.
   */
  finishMatch(match: Match) {
    match.finished = true;
    this.matchSvc.editMatch(match, this.user).subscribe(_ => {
      this.onLoadMatch(this.user);
    });
  }

  /**
   * Elimina un partido.
   * @param match Partido a eliminar.
   * @param modal Instancia del modal de Ionic.
   */
  deleteMatch(match: Match, modal: IonModal) {
    if (match.finished) {
      this.matchSvc.deleteMatch(match, this.user).subscribe(_ => {
        this.onLoadMatch(this.user);
      });
    }
    if (this.finishedMatches.length <= 1) {
      modal.dismiss();
    }
  }
}
