import { Injectable } from '@angular/core';
import { FirebaseDocument, FirebaseService } from '../firebase/firebase.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Match } from '../../interfaces/match';
import { Unsubscribe } from 'firebase/firestore';
import { Coach } from '../../interfaces/coach';
import { Squad } from '../../interfaces/squad';
import { Player } from '../../interfaces/player';

/**
 * Servicio para la gestión de partidos.
 * Proporciona métodos para la creación, edición, eliminación y obtención de partidos.
 */
@Injectable({
  providedIn: 'root'
})
export class MatchService {

  private _matches: BehaviorSubject<Match[]> = new BehaviorSubject<Match[]>([]); // BehaviorSubject para almacenar la lista de partidos
  public matches$: Observable<Match[]> = this._matches.asObservable(); // Observable expuesto para recibir actualizaciones de la lista de partidos

  private unsubs: Unsubscribe | null = null; // Variable para almacenar la función de unsubscribe
  private errorNotAdmin = "ERROR user not admin"; // Mensaje de error para usuarios que no son administradores

  constructor(
    private fbSvc: FirebaseService // Servicio de Firebase para la interacción con Firestore
  ) {
    // Suscribe el BehaviorSubject a la colección 'matches' en Firebase
    this.unsubs = fbSvc.subscribeToCollection("matches", this._matches, this.mapMatches);
  }

  /**
   * Convierte un documento de Firebase a un objeto Match.
   * @param el Documento de Firebase que contiene los datos del partido.
   * @returns Objeto Match generado a partir del documento.
   */
  mapMatches(el: FirebaseDocument): Match {
    if (el.data['squad']) {
      return {
        id: el.id,
        date: el.data['date'],
        opponent: el.data['opponent'],
        result: el.data['result'],
        coachId: el.data['coachId'],
        squad: {
          id: el.data['squad'].id,
          name: el.data['squad'].name,
          lineUp: el.data['squad'].lineUp,
          players: el.data['squad'].players
        },
        finished: el.data['finished']
      };
    } else {
      const match: any = {
        id: el.id,
        date: el.data['date'],
        opponent: el.data['opponent'],
        result: el.data['result'],
        coachId: el.data['coachId']
      };
      return match;
    }
  }

  /**
   * Añade un nuevo partido a la colección 'matches'.
   * @param match Datos del nuevo partido a crear.
   * @param user Usuario que realiza la operación.
   * @returns Observable que emite el partido creado una vez completada la operación.
   */
  addMatch(match: Match, user: any): Observable<Match> {
    return new Observable<Match>(obs => {
      if (user.role == 'ADMIN') {
        delete match.id;
        match.coachId = user.id;
        delete match.squad.coachId;
        match.squad.players = match.squad.players.map(player => {
          const _player:any = {
            id:player.id,
            name:player.name,
            surname:player.surname,
            position:player.position
          }
          return _player
        });
        this.fbSvc.createDocument("matches", match).then(_ => {
          this.unsubs = this.fbSvc.subscribeToCollection("matches", this._matches, this.mapMatches);
          obs.next(match);
          obs.complete();
        }).catch(err => {
          obs.error(err);
        });
      } else {
        obs.error(this.errorNotAdmin);
      }
    });
  }

  /**
   * Edita los datos de un partido existente en la colección 'matches'.
   * @param match Datos actualizados del partido.
   * @param user Usuario que realiza la operación.
   * @returns Observable que emite el partido actualizado una vez completada la operación.
   */
  editMatch(match: Match, user: Coach): Observable<Match> {
    return new Observable<Match>(obs => {
      if (user.role == 'ADMIN') {
        match.squad.players = match.squad.players.map(player => {
          const _player:any = {
            id:player.id,
            name:player.name,
            surname:player.surname,
            position:player.position
          }
          return _player
        });
        this.fbSvc.updateDocument("matches", match.id!!, match).then(_ => {
          this.unsubs = this.fbSvc.subscribeToCollection("matches", this._matches, this.mapMatches);
          obs.next(match);
          obs.complete();
        }).catch(err => {
          obs.error(err);
        });
      } else {
        obs.error(this.errorNotAdmin);
      }
    });
  }

  /**
   * Actualiza la alineación (squad) en todos los partidos que tienen el mismo ID de squad.
   * @param squad Alineación actualizada.
   * @param user Usuario que realiza la operación.
   * @returns Observable que emite el partido actualizado una vez completada la operación.
   */
  updateSquadOnMatch(squad: Squad, user: any): Observable<Match> {
    return new Observable<Match>(obs => {
      if (user.role == 'ADMIN') {
        this.fbSvc.getDocuments("matches").then(docs => {
          docs.map(doc => {
            const match: Match = this.mapMatches(doc);
            if (match.squad.id == squad.id && !match.finished) {
              match.squad = squad;
              this.editMatch(match, user).subscribe();
              obs.next(match);
            }
          });
          obs.complete();
        }).catch(err => {
          obs.error(err);
        });
      }
    });
  }

  /**
   * Actualiza los datos de un jugador en la alineación de todos los partidos que lo contienen.
   * @param player Jugador con datos actualizados.
   * @param user Usuario que realiza la operación.
   * @returns Observable que emite el partido actualizado una vez completada la operación.
   */
  updatePlayerOnSquadMatch(player: Player, user: any): Observable<Match> {
    return new Observable<Match>(obs => {
      if (user.role == 'ADMIN') {
        this.fbSvc.getDocuments("matches").then(docs => {
          docs.map(doc => {
            const match: Match = this.mapMatches(doc);
            const index = match.squad.players.findIndex(p => p.id == player.id);
            if (index > -1 && !match.finished) {
              match.squad.players[index] = player;
              this.editMatch(match, user).subscribe();
              obs.next(match);
            }
          });
          obs.complete();
        }).catch(err => {
          obs.error(err);
        });
      }
    });
  }

  /**
   * Elimina un partido de la colección 'matches'.
   * @param match Partido a eliminar.
   * @param user Usuario que realiza la operación.
   * @returns Observable que completa una vez que se ha eliminado el partido.
   */
  deleteMatch(match: Match, user: Coach): Observable<void> {
    return new Observable<void>(obs => {
      if (user.role == 'ADMIN') {
        this.fbSvc.deleteDocument("matches", match.id!!).then(_ => {
          this.unsubs = this.fbSvc.subscribeToCollection("matches", this._matches, this.mapMatches);
          obs.complete();
        }).catch(err => {
          obs.error(err);
        });
      } else {
        obs.error(this.errorNotAdmin);
      }
    });
  }
}