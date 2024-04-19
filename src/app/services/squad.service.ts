import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, lastValueFrom, map } from 'rxjs';
import { Squad } from '../interfaces/squad';
import { FirebaseDocument, FirebaseService } from './firebase/firebase.service';
import { Player } from '../interfaces/player';
import { Unsubscribe } from 'firebase/firestore';
import { AuthService } from './api/auth.service';
import { Coach } from '../interfaces/coach';

@Injectable({
  providedIn: 'root'
})
export class SquadService {

  private _squads = new BehaviorSubject<Squad[]>([])
  public squads$ = this._squads.asObservable()
  private unsubscr:Unsubscribe|null = null;
  private user:any
  constructor(
    private fbSvc:FirebaseService,
    private authSvc:AuthService
  ) { 
    this.authSvc.me().subscribe(u => { this.user = u })
    this.unsubscr = this.fbSvc.subscribeToCollection('squads', this._squads, this.mapSquads);
  }

  mapSquads(el:FirebaseDocument):Squad {
    return {
      id:el.id,
      name:el.data['name'],
      lineUp:el.data['lineUp'],
      players:el.data['players'].map((player:Player) => {
        return {
          idPlayer:player.id,
          name:player.name,
          surname:player.surname,
          position:player.position,
          picture:player.picture
        }
      }),
      coachId:el.data['coachId']
    }
  }

  addSquad(squad:Squad):Observable<Squad> {
    return new Observable<Squad>(obs => {
      if(this.user?.role == 'ADMIN') {
        delete squad.id
        squad.coachId = this.user?.id
        squad.players = squad.players.map (player => {
        const _player:any = {
          idPlayer:player.id,
          name:player.name,
          surname:player.surname,
          position:player.position,
          picture:player.picture
        }
        return _player
      })
      this.fbSvc.createDocument("squads",squad).then(_=>{
        this.unsubscr = this.fbSvc.subscribeToCollection('squads', this._squads, this.mapSquads);
        obs.next(squad)
        obs.complete
      }).catch(err => {
        obs.error(err)
      })
      }
    })
  }

  getSquad(id:string):Observable<Squad> {
    return new Observable<Squad>(squad => {
      this.fbSvc.getDocument("squads",id).then(doc => {
        const data:Squad = this.mapSquads(doc)
        squad.next(data)
        squad.complete()
      })
    })
  }

  updateSquad(squad:Squad):Observable<Squad> {
    return new Observable<Squad>(obs => {
      if(this.user?.role == 'ADMIN') {
        squad.players = squad.players.map (player => {
          const _player:any = {
            idPlayer:player.id,
            name:player.name,
            surname:player.surname,
            position:player.position,
            picture:player.picture
          }
          return _player
        })
        this.fbSvc.updateDocument("squads", squad.id!!, squad).then(_=>{
          this.unsubscr = this.fbSvc.subscribeToCollection('squads', this._squads, this.mapSquads);
          obs.next(squad)
          obs.complete()
        }).catch(err => {
          obs.error(err)
        })
      }
    })
  }

  updatePlayerInSquad(player:Player):Observable<Squad> {
    return new Observable<Squad>(obs => {
      if(this.user?.role == 'ADMIN') {
        this.fbSvc.getDocuments('squads').then(docs => {
          docs.map (doc => {
            const squad = this.mapSquads(doc)
            const index = squad.players.findIndex(p => p.id == player.id)
            if(index > -1) {
              squad.players[index] = player
              this.updateSquad(squad).subscribe()
              obs.next(squad)
            }
            obs.complete()
          })
        })
      }
    })
  }

  deleteSquad(squad:Squad):Observable<void> {
    return new Observable<void>(obs => {
      if(this.user?.role == 'ADMIN') {
        this.fbSvc.deleteDocument("squads", squad.id!!).then(_ => {
          this.unsubscr = this.fbSvc.subscribeToCollection('squads', this._squads, this.mapSquads);
        }).catch(err => {
          obs.error(err)
        })
      }
    })
  }
}
