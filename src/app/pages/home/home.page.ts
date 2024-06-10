import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../services/player.service';
import { Player } from 'src/app/interfaces/player';
import { Match } from 'src/app/interfaces/match';
import { IonModal, ModalController, } from '@ionic/angular';
import { MatchFormComponent } from 'src/app/components/match-components/match-form/match-form.component';
import { Squad } from 'src/app/interfaces/squad';
import { SquadService } from 'src/app/services/squad.service';
import { AuthService } from 'src/app/services/api/auth.service';
import { MatchService } from 'src/app/services/match.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  maxGoalsPlayer:Player | undefined
  maxAssistsPlayer:Player | undefined
  maxYellowPlayer:Player | undefined
  maxRedPlayer:Player | undefined
  squads:Squad[] | undefined
  match:Match | undefined
  finishedMatches:Match[] = []
  user:any
  forwards:Player[] = []
  midfielders:Player[] = []
  defenses:Player[] = []
  goalkeeper:Player | undefined
  openModal:boolean = false

  constructor(
    public players:PlayerService,
    public squadSvc:SquadService,
    public matchSvc:MatchService,
    private modal:ModalController,
    public authSvc:AuthService
  ) {
    this.authSvc.user$.subscribe(u => {
      this.user = u
      this.onLoadSquads(u)
      this.onLoadMatch(u)
      this.onLoadPlayerStats(u)
    })
  }

  ngOnInit() {}

  setOpen(open:boolean) {
    this.openModal = open
  }

  hasFinishedMatches(user:any):boolean {
    var matches:Match[] = []
    this.matchSvc.matches$.subscribe(_matches => {
      matches = [..._matches]
    })
    return matches.filter(m => (m.coachId == user.id || m.coachId == user.coachId ) && m.finished == true).length > 0
  }

  onLoadMatch(user:any) {
    this.matchSvc.matches$.subscribe(matches => {
      this.finishedMatches = [...matches].filter(m => (m.coachId == user.id || m.coachId == user.coachId) && m.finished == true)
      this.match = [...matches].find(_match => (_match.coachId == user.id || _match.coachId == user.coachId) && _match.finished == false)
      switch(this.match?.squad.lineUp) {
        case "4-3-3":{
          this.forwards = this.match?.squad.players.slice(0,3)
          this.midfielders = this.match?.squad.players.slice(3,6)
          this.defenses = this.match?.squad.players.slice(6,10)
          this.goalkeeper = this.match?.squad.players[10]
        }
        break;
        case "4-4-2":{
          this.forwards = this.match?.squad.players.slice(0,2)
          this.midfielders = this.match?.squad.players.slice(2,6)
          this.defenses = this.match?.squad.players.slice(6,10)
          this.goalkeeper = this.match?.squad.players[10]
        }
        break;
        case "3-4-3":{
          this.forwards = this.match?.squad.players.slice(0,3)
          this.midfielders = this.match?.squad.players.slice(3,7)
          this.defenses = this.match?.squad.players.slice(7,10)
          this.goalkeeper = this.match?.squad.players[10]
        }
      }
    })
  }

  onLoadSquads(user:any) {
    this.squadSvc.squads$.subscribe(_squads => {
      const sqs = [..._squads]
      this.squads = sqs.filter(s => user.id == s.coachId || user.coachId == s.coachId)
    })
  }

  onLoadPlayerStats(user:any) {
    this.players.players$.subscribe(players => {
      const _players = [...players].filter(p => user.id == p.coachId || user.coachId == p.coachId)
      if(_players.length > 0) {
        var maxGoals = 0
        var maxAssists = 0
        var maxYellowCards = 0
        var maxRedCards = 0
        _players.forEach(player => {
          if(player.goals!! >= maxGoals) {
            maxGoals = player.goals!!
            this.maxGoalsPlayer = player
          }
          if(player.assists!! >= maxAssists) {
            maxAssists = player.assists!!
            this.maxAssistsPlayer = player
          }
          if(player.yellowCards!! >= maxYellowCards) {
            maxYellowCards = player.yellowCards!!
            this.maxYellowPlayer = player
          }
          if(player.redCards!! >= maxRedCards) {
            maxRedCards = player.redCards!!
            this.maxRedPlayer = player
          }
        })
      } else {
        this.maxGoalsPlayer = undefined
        this.maxAssistsPlayer = undefined
        this.maxRedPlayer = undefined
        this.maxYellowPlayer = undefined
      }
    })
  }

  async presentForm(data: Match | null, onDismiss: (result: any) => void) {
    const modal = await this.modal.create({
      component: MatchFormComponent,
      componentProps: {
        match: data,
        squads: this.squads
      },
    })
    modal.present()
    modal.onDidDismiss().then(result => {
      if (result?.data) {
        onDismiss(result)
      }
    })
  }

  onNewMatch() {
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

  onEditMatch(match:Match) {
    var onDismiss = async (info:any) => {
      switch (info.role) {
        case 'ok':{
          if(match.coachId == this.user.id || match.coachId == this.user.coachId) {
            const squad:Squad = await lastValueFrom(this.squadSvc.getSquadByName(info.data.squad))
            match = {
              id:match.id,
              date:info.data.date,
              opponent:info.data.opponent,
              result:info.data.result,
              squad:squad,
              coachId:match.coachId,
              finished:false
            }
            this.matchSvc.editMatch(match, this.user).subscribe(_=> {
              this.onLoadMatch(this.user)
            })
          }
        }
        break;
      }
    }
    this.presentForm(match, onDismiss)
  }

  finishMatch(match:Match) {
    match.finished = true
    this.matchSvc.editMatch(match, this.user).subscribe(_=> {
      this.onLoadMatch(this.user)
    })
  }

  deleteMatch(match:Match, modal:IonModal) {
    if(match.finished) {
      this.matchSvc.deleteMatch(match, this.user).subscribe(_=> {
        this.onLoadMatch(this.user)
      })
      if(this.finishedMatches.length <= 1) {
        modal.dismiss()
      }
    }
  }
}
