import { Injectable } from '@angular/core';
import { FirebaseDocument, FirebaseService } from '../firebase/firebase.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Match } from '../../interfaces/match';
import { Unsubscribe } from 'firebase/firestore';
import { Coach } from '../../interfaces/coach';
import { Squad } from '../../interfaces/squad';
import { Player } from '../../interfaces/player';

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  private _matches:BehaviorSubject<Match[]> = new BehaviorSubject<Match[]>([])
  public matches$:Observable<Match[]> = this._matches.asObservable()
  private unsubs:Unsubscribe | null = null
  private errorNotAdmin = "ERROR user not admin"
  constructor(
    private fbSvc:FirebaseService
  ) { 
    this.unsubs = fbSvc.subscribeToCollection("matches", this._matches, this.mapMatches)
  }

  mapMatches(el:FirebaseDocument):Match {
    if(el.data['squad']) {
      return {
        id:el.id,
        date:el.data['date'],
        opponent:el.data['opponent'],
        result:el.data['result'],
        coachId:el.data['coachId'],
        squad:{
          id:el.data['squad'].id,
          name:el.data['squad'].name,
          lineUp:el.data['squad'].lineUp,
          players:el.data['squad'].players
        },
        finished:el.data['finished']
      }
    } else {
      const match:any = {
        id:el.id,
        date:el.data['date'],
        opponent:el.data['opponent'],
        result:el.data['result'],
        coachId:el.data['coachId']
      }
      return match
    }
  }

  addMatch(match:Match, user:any):Observable<Match> {
    return new Observable<Match>(obs => {
      if(user.role == 'ADMIN') {
        delete match.id
        match.coachId = user.id
        delete match.squad.coachId
        match.squad.players = match.squad.players.map(player => {
          const _player:any = {
            id:player.id,
            name:player.name,
            surname:player.surname,
            position:player.position
          }
          return _player
        })
        this.fbSvc.createDocument("matches", match).then(_=> {
          this.unsubs = this.fbSvc.subscribeToCollection("matches", this._matches, this.mapMatches)
          obs.next(match)
          obs.complete()
        }).catch(err => {
          obs.error(err)
        })
      } else {
        obs.error(this.errorNotAdmin)
      }
    })
  }

  editMatch(match:Match, user:Coach):Observable<Match> {
    return new Observable<Match>(obs => {
      if(user.role == 'ADMIN') {
        match.squad.players = match.squad.players.map(player => {
          const _player:any = {
            id:player.id,
            name:player.name,
            surname:player.surname,
            position:player.position
          }
          return _player
        })
        this.fbSvc.updateDocument("matches", match.id!!, match).then(_=> {
          this.unsubs = this.fbSvc.subscribeToCollection("matches", this._matches, this.mapMatches)
          obs.next(match)
          obs.complete()
        }).catch(err => {
          obs.error(err)
        })
      } else {
        obs.error(this.errorNotAdmin)
      }
    })
  }

  updateSquadOnMatch(squad:Squad, user:any):Observable<Match> {
    return new Observable<Match>(obs => {
      if(user.role == 'ADMIN') {
        this.fbSvc.getDocuments("matches").then(docs => {
          docs.map(doc => {
            const match:Match = this.mapMatches(doc)
            if(match.squad.id == squad.id && !match.finished) {  
              match.squad = squad
              this.editMatch(match, user).subscribe()
              obs.next(match)
            }
            obs.complete()
          })
        }).catch(err => {
          obs.error(err)
        })
      }
    })
  }

  updatePlayerOnSquadMatch(player:Player, user:any):Observable<Match> {
    return new Observable<Match>(obs => {
      if(user.role == 'ADMIN') {
        this.fbSvc.getDocuments("matches").then(docs => {
          docs.map(doc => {
            const match:Match = this.mapMatches(doc)
            const index = match.squad.players.findIndex(p => p.id == player.id)
            if(index > -1 && !match.finished) {
              match.squad.players[index] = player
              this.editMatch(match, user).subscribe()
              obs.next(match)
            }
            obs.complete()
          })
        }).catch(err => {
          obs.error(err)
        })
      }
    })
  }

  deleteMatch(match:Match, user:Coach):Observable<void> {
    return new Observable<void>(obs => {
      if(user.role=='ADMIN') {
        this.fbSvc.deleteDocument("matches",match.id!!).then(_=> {
          this.unsubs = this.fbSvc.subscribeToCollection("matches", this._matches, this.mapMatches)
          obs.complete()
        }).catch(err => {
          obs.error(err)
        })
      } else {
        obs.error(this.errorNotAdmin)
      }
    })
  }
}
