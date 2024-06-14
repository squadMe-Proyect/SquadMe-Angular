import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Player } from '../../interfaces/player';
import { FirebaseDocument, FirebaseService } from '../firebase/firebase.service';
import { Unsubscribe } from 'firebase/firestore';
import { Coach } from '../../interfaces/coach';

/**
 * Servicio para la gestión de jugadores.
 * Proporciona métodos para la creación, edición, eliminación y obtención de jugadores.
 */
@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private _players = new BehaviorSubject<Player[]>([]); // BehaviorSubject para almacenar la lista de jugadores
  public players$ = this._players.asObservable(); // Observable expuesto para recibir actualizaciones de la lista de jugadores

  private unsubscr: Unsubscribe | null = null; // Variable para almacenar la función de unsubscribe

  constructor(
    private fbSvc: FirebaseService // Servicio de Firebase para la interacción con Firestore
  ) {
    // Suscribe el BehaviorSubject a la colección 'players' en Firebase
    this.unsubscr = this.fbSvc.subscribeToCollection('players', this._players, this.mapPlayers);
  }

  /**
   * Convierte un documento de Firebase a un objeto Player.
   * @param el Documento de Firebase que contiene los datos del jugador.
   * @returns Objeto Player generado a partir del documento.
   */
  mapPlayers(el: FirebaseDocument): Player {
    return {
      id: el.id,
      name: el.data['name'],
      surname: el.data['surname'],
      position: el.data['position'],
      nation: el.data['nation'],
      picture: el.data['picture'],
      email: el.data['email'],
      role: el.data['role'],
      number: el.data['number'],
      goals: el.data['goals'],
      assists: el.data['assists'],
      yellowCards: el.data['yellowCards'],
      redCards: el.data['redCards'],
      coachId: el.data['coachId'],
      teamName: el.data['teamName']
    };
  }

  /**
   * Obtiene un jugador específico mediante su ID.
   * @param id ID del jugador a obtener.
   * @returns Observable que emite el jugador encontrado una vez completada la operación.
   */
  getPlayer(id: string): Observable<Player> {
    return new Observable<Player>(player => {
      this.fbSvc.getDocument("players", id).then(doc => {
        const data: Player = this.mapPlayers(doc);
        player.next(data);
        player.complete();
      });
    });
  }

  /**
   * Añade un nuevo jugador a la colección 'players'.
   * @param player Datos del nuevo jugador a crear.
   * @param user Usuario que realiza la operación (debe ser administrador).
   * @returns Observable que emite el jugador creado una vez completada la operación.
   */
  addPlayer(player: any, user: Coach): Observable<Player> {
    return new Observable<Player>(obs => {
      if (user.role == 'ADMIN') {
        // Configuración inicial del jugador
        if (player.picture == null || player.picture == undefined)
          player.picture = "";
        player.assists = 0;
        player.goals = 0;
        player.yellowCards = 0;
        player.redCards = 0;
        player.coachId = user.id;

        const playerWithoutId = { ...player };
        delete playerWithoutId.id;

        // Creación del documento de jugador en Firestore
        this.fbSvc.createDocumentWithId("players", playerWithoutId, player.id).then(_ => {
          this.unsubscr = this.fbSvc.subscribeToCollection('players', this._players, this.mapPlayers);
          obs.next(player);
          obs.complete();
        }).catch(err => {
          obs.error(err);
        });
      }
    });
  }

  /**
   * Actualiza los datos de un jugador existente en la colección 'players'.
   * @param player Datos actualizados del jugador.
   * @param user Usuario que realiza la operación (debe ser administrador).
   * @returns Observable que emite el jugador actualizado una vez completada la operación.
   */
  updatePlayer(player: Player, user: Coach): Observable<Player> {
    return new Observable<Player>(obs => {
      if (user.role == 'ADMIN') {
        const playerWithoutId = { ...player };
        delete playerWithoutId.id;

        // Actualización del documento de jugador en Firestore
        this.fbSvc.updateDocument("players", player.id!!, playerWithoutId).then(_ => {
          this.unsubscr = this.fbSvc.subscribeToCollection('players', this._players, this.mapPlayers);
          obs.next(player);
          obs.complete();
        }).catch(err => {
          obs.error(err);
        });
      }
    });
  }

  /**
   * Elimina un jugador de la colección 'players'.
   * @param player Jugador a eliminar.
   * @param user Usuario que realiza la operación (debe ser administrador).
   * @returns Observable que completa una vez que se ha eliminado el jugador.
   */
  deletePlayer(player: Player, user: Coach): Observable<void> {
    return new Observable<void>(obs => {
      if (user.role == 'ADMIN') {
        // Verifica si el jugador está asignado a algún equipo antes de proceder con la eliminación
        this.fbSvc.getDocuments("squads").then(docs => {
          if (docs.length > 0) {
            var players: Player[] = [];
            docs.forEach(doc => {
              const playerFound: Player = doc.data['players'].find((p: Player) => player.id == p.id);
              if (playerFound && !players.find(p => player.id == p.id)) {
                players.push(playerFound);
              }
            });
            // Si no se encontraron jugadores asociados a equipos, se procede con la eliminación
            if (players.length <= 0) {
              this.fbSvc.deleteDocument("players", player.id!!).then(_ => {
                this.unsubscr = this.fbSvc.subscribeToCollection('players', this._players, this.mapPlayers);
              }).catch(err => {
                obs.error(err);
              });
            } else {
              obs.error("No se pudo borrar");
            }
          } else {
            // Si no hay equipos, se procede con la eliminación del jugador
            this.fbSvc.deleteDocument("players", player.id!!).then(_ => {
              this.unsubscr = this.fbSvc.subscribeToCollection('players', this._players, this.mapPlayers);
            }).catch(err => {
              obs.error(err);
            });
          }
        }).catch(err => obs.error(err));
      }
    });
  }
}