import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../services/player.service';
import { Player } from 'src/app/interfaces/player';
import { Match } from 'src/app/interfaces/match';
import { ModalController } from '@ionic/angular';
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
  user:any
  constructor(
    public players:PlayerService,
    public squadSvc:SquadService,
    public matchSvc:MatchService,
    private modal:ModalController,
    public authSvc:AuthService,
  ) {
    this.authSvc.user$.subscribe(u => { this.user = u })
    squadSvc.squads$.subscribe(_squads => {
      this.squads = _squads.filter(s => this.user.id == s.coachId)
    })
    players.players$.subscribe(players => {
      const _players = players.filter(p => this.user.id == p.coachId || this.user.coachId == p.coachId)
      var maxGoals = 0
      var maxAssists = 0
      var maxYellowCards = 0
      var maxRedCards = 0
      _players.forEach(player => {
        if(player.numbers!! >= maxGoals) {
          maxGoals = player.numbers!!
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
    })
  }

  ngOnInit(): void {
    this.onLoadMatch()
  }

  onLoadMatch() {
    this.matchSvc.matches$.subscribe(matches => {
      this.match = matches.find(_match => _match.coachId == this.user.id || _match.coachId == this.user.coachId)
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
            squad:squad
          }
          this.matchSvc.addMatch(_match, this.user).subscribe(_=> {
            this.onLoadMatch()
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
              coachId:match.coachId
            }
            this.matchSvc.editMatch(match, this.user).subscribe(_=> {
              this.onLoadMatch()
            })
          }
        }
        break;
      }
    }
    this.presentForm(match, onDismiss)
  }

  finishMatch(match:Match) {
    this.matchSvc.deleteMatch(match, this.user).subscribe(_=> {
      this.onLoadMatch()
    })
  }
}
