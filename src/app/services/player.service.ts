import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Player } from '../interfaces/player';
import { FirebaseDocument, FirebaseService, FirebaseUserCredential } from './firebase/firebase.service';
import { Unsubscribe } from 'firebase/firestore';
import { AuthService } from './api/auth.service';
import { Coach } from '../interfaces/coach';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private _players = new BehaviorSubject<Player[]>([])
  public players$ = this._players.asObservable()
  private unsubscr:Unsubscribe|null = null;
  constructor(
    private fbSvc:FirebaseService
  ) { 
    this.unsubscr = this.fbSvc.subscribeToCollection('players', this._players, this.mapPlayers);
  }

  mapPlayers(el:FirebaseDocument):Player{
    return {
      id:el.id,
      name:el.data['name'],
      surname:el.data['surname'],
      position:el.data['position'],
      nation:el.data['nation'],
      picture:el.data['picture'],
      email:el.data['email'],
      role:el.data['role'],
      number:el.data['number'],
      goals:el.data['goals'],
      assists:el.data['assists'],
      yellowCards:el.data['yellowCards'],
      redCards:el.data['redCards'],
      coachId:el.data['coachId'],
      teamName:el.data['teamName']
    }
  }

  getPlayer(id:string):Observable<Player> {
    return new Observable<Player>(player => {
      this.fbSvc.getDocument("players",id).then(doc => {
        const data:Player = this.mapPlayers(doc)
        player.next(data)
        player.complete()
      })
    })
  }

  addPlayer(player:any, user:Coach):Observable<Player> {
    return new Observable<Player>(obs => {
      if(user.role == 'ADMIN'){
        const _user = this.fbSvc.getUser()!!
        const auth = this.fbSvc.getAuth()!!
        if(player.picture == null || player.picture == undefined)
          player.picture = ""
        player.assists = 0
        player.goals = 0
        player.yellowCards = 0
        player.redCards = 0
        player.coachId = user.id
        const playerWithoutId = {...player}
        delete playerWithoutId.id
        this.fbSvc.createDocumentWithId("players", playerWithoutId, player.id).then(_=>{
          this.unsubscr = this.fbSvc.subscribeToCollection('players', this._players, this.mapPlayers);
          obs.next(player)
          obs.complete()
        }).catch(err => {
          obs.error(err)
        })
      }
    })
  }

  updatePlayer(player:Player, user:Coach):Observable<Player> {
    return new Observable<Player>(obs => {
      if(user.role == 'ADMIN') {
        const playerWithoutId = {...player}
        delete playerWithoutId.id
        this.fbSvc.updateDocument("players",player.id!!,playerWithoutId).then(_=>{
          this.unsubscr = this.fbSvc.subscribeToCollection('players', this._players, this.mapPlayers);
          obs.next(player)
          obs.complete()
        }).catch(err => {
          obs.error(err)
        })
      }
    })
  }

  deletePlayer(player:Player, user:Coach):Observable<void> {
    return new Observable<void>(obs => {
      if(user.role == 'ADMIN') {
        this.fbSvc.getDocuments("squads").then(docs => {
          if(docs.length > 0) {
            var players:Player[] = []
            docs.forEach(doc => {
              const playerFound:Player = doc.data['players'].find((p:Player) => player.id == p.id)
              if(playerFound && !players.find(p => player.id == p.id)) {
                players.push(playerFound)
              }
            })
            if(players.length <= 0) {
              this.fbSvc.deleteDocument("players",player.id!!).then(_=>{
                this.unsubscr = this.fbSvc.subscribeToCollection('players', this._players, this.mapPlayers);
              }).catch(err => {
                obs.error(err)
              })
            } else {
              obs.error("No se pudo borrar")
            }
          } else {
            this.fbSvc.deleteDocument("players",player.id!!).then(_=>{
              this.unsubscr = this.fbSvc.subscribeToCollection('players', this._players, this.mapPlayers);
            }).catch(err => {
              obs.error(err)
            })
          }
        }).catch(err => obs.error(err))
      }
    })
  }
}
