import { Injectable } from '@angular/core';
import { FirebaseDocument, FirebaseService } from './firebase/firebase.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Match } from '../interfaces/match';
import { Unsubscribe } from 'firebase/firestore';
import { Coach } from '../interfaces/coach';

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
        }
      }
    } else {
      const squad:any = {
        id:el.id,
        date:el.data['date'],
        opponent:el.data['opponent'],
        result:el.data['result'],
        coachId:el.data['coachId']
      }
      return squad
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
