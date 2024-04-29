import { Injectable } from '@angular/core';
import { FirebaseDocument, FirebaseService } from './firebase/firebase.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Match } from '../interfaces/match';
import { Unsubscribe } from 'firebase/firestore';
import { Player } from '../interfaces/player';

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  private _matches:BehaviorSubject<Match[]> = new BehaviorSubject<Match[]>([])
  public matches$:Observable<Match[]> = this._matches.asObservable()
  private unsubs:Unsubscribe | null = null
  constructor(
    private fbSvc:FirebaseService
  ) { 
    this.unsubs = fbSvc.subscribeToCollection("matches", this._matches, this.mapMatches)
  }

  mapMatches(el:FirebaseDocument):Match {
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
        obs.error("ERROR user not admin")
      }
    })
  }
}
