import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Squad } from '../../interfaces/squad';
import { FirebaseDocument, FirebaseService } from '../firebase/firebase.service';
import { Player } from '../../interfaces/player';
import { Unsubscribe } from 'firebase/firestore';

/**
 * Servicio para la gestión de equipos (squads).
 * Proporciona métodos para la creación, edición, eliminación y obtención de equipos.
 */
@Injectable({
  providedIn: 'root'
})
export class SquadService {

  private _squads = new BehaviorSubject<Squad[]>([]); // BehaviorSubject para almacenar la lista de equipos
  public squads$ = this._squads.asObservable(); // Observable expuesto para recibir actualizaciones de la lista de equipos

  private unsubscr: Unsubscribe | null = null; // Variable para almacenar la función de unsubscribe

  constructor(
    private fbSvc: FirebaseService // Servicio de Firebase para la interacción con Firestore
  ) {
    // Suscribe el BehaviorSubject a la colección 'squads' en Firebase
    this.unsubscr = this.fbSvc.subscribeToCollection('squads', this._squads, this.mapSquads);
  }

  /**
   * Convierte un documento de Firebase a un objeto Squad.
   * @param el Documento de Firebase que contiene los datos del equipo.
   * @returns Objeto Squad generado a partir del documento.
   */
  mapSquads(el: FirebaseDocument): Squad {
    return {
      id: el.id,
      name: el.data['name'],
      lineUp: el.data['lineUp'],
      players: el.data['players'].map((player: Player) => ({
        id: player.id,
        name: player.name,
        surname: player.surname,
        position: player.position,
        picture: player.picture
      })),
      coachId: el.data['coachId']
    };
  }

  /**
   * Añade un nuevo equipo a la colección 'squads'.
   * @param squad Datos del nuevo equipo a crear.
   * @param user Usuario que realiza la operación (debe ser administrador).
   * @returns Observable que emite el equipo creado una vez completada la operación.
   */
  addSquad(squad: Squad, user: any): Observable<Squad> {
    return new Observable<Squad>(obs => {
      if (user.role == 'ADMIN') {
        delete squad.id;
        squad.coachId = user.id;
        squad.players = squad.players.map(player => {
          const _player:any = {
            id: player.id,
            name: player.name,
            surname: player.surname,
            position: player.position,
            picture: player.picture
          }
          return _player
        });
        // Creación del documento de equipo en Firestore
        this.fbSvc.createDocument("squads", squad).then(_ => {
          this.unsubscr = this.fbSvc.subscribeToCollection('squads', this._squads, this.mapSquads);
          obs.next(squad);
          obs.complete();
        }).catch(err => {
          obs.error(err);
        });
      }
    });
  }

  /**
   * Obtiene un equipo específico mediante su ID.
   * @param id ID del equipo a obtener.
   * @returns Observable que emite el equipo encontrado una vez completada la operación.
   */
  getSquad(id: string): Observable<Squad> {
    return new Observable<Squad>(squad => {
      this.fbSvc.getDocument("squads", id).then(doc => {
        const data: Squad = this.mapSquads(doc);
        squad.next(data);
        squad.complete();
      });
    });
  }

  /**
   * Obtiene un equipo específico mediante su nombre.
   * @param name Nombre del equipo a obtener.
   * @returns Observable que emite el equipo encontrado una vez completada la operación.
   */
  getSquadByName(name: String): Observable<Squad> {
    return new Observable<Squad>(obs => {
      this.fbSvc.getDocumentsBy("squads", "name", name).then(docs => {
        const data: Squad = this.mapSquads(docs[0]);
        obs.next(data);
        obs.complete();
      });
    });
  }

  /**
   * Actualiza los datos de un equipo existente en la colección 'squads'.
   * @param squad Datos actualizados del equipo.
   * @param user Usuario que realiza la operación (debe ser administrador).
   * @returns Observable que emite el equipo actualizado una vez completada la operación.
   */
  updateSquad(squad: Squad, user: any): Observable<Squad> {
    return new Observable<Squad>(obs => {
      if (user.role == 'ADMIN') {
        squad.players = squad.players.map(player => {
          const _player:any = {
            id: player.id,
            name: player.name,
            surname: player.surname,
            position: player.position,
            picture: player.picture
          }
          return _player
        });

        // Actualización del documento de equipo en Firestore
        this.fbSvc.updateDocument("squads", squad.id!!, squad).then(_ => {
          this.unsubscr = this.fbSvc.subscribeToCollection('squads', this._squads, this.mapSquads);
          obs.next(squad);
          obs.complete();
        }).catch(err => {
          obs.error(err);
        });
      }
    });
  }

  /**
   * Actualiza los datos de un jugador dentro de todos los equipos que lo contengan.
   * @param player Jugador con los datos actualizados.
   * @param user Usuario que realiza la operación (debe ser administrador).
   * @returns Observable que emite el equipo actualizado una vez completada la operación.
   */
  updatePlayerInSquad(player: Player, user: any): Observable<Squad> {
    return new Observable<Squad>(obs => {
      if (user.role == 'ADMIN') {
        // Obtener todos los equipos (squads)
        this.fbSvc.getDocuments('squads').then(docs => {
          docs.map(doc => {
            const squad = this.mapSquads(doc);
            const index = squad.players.findIndex(p => p.id == player.id);
            if (index > -1) {
              squad.players[index] = player;
              // Actualizar el equipo con el jugador actualizado
              this.updateSquad(squad, user).subscribe();
              obs.next(squad);
            }
            obs.complete();
          });
        }).catch(err => {
          obs.error(err);
        });
      }
    });
  }

  /**
   * Elimina un equipo de la colección 'squads'.
   * @param squad Equipo a eliminar.
   * @param user Usuario que realiza la operación (debe ser administrador).
   * @returns Observable que completa una vez que se ha eliminado el equipo.
   */
  deleteSquad(squad: Squad, user: any): Observable<void> {
    return new Observable<void>(obs => {
      if (user.role == 'ADMIN') {
        // Verificar si hay partidos asociados al equipo antes de proceder con la eliminación
        this.fbSvc.getDocuments("matches").then(docs => {
          if (docs.length > 0) {
            var squads: Squad[] = [];
            docs.forEach(doc => {
              if (!doc.data['finished']) {
                const squadFound: Squad = doc.data['squad'];
                if (squadFound.id == squad.id) {
                  squads.push(squadFound);
                }
              }
            });
            // Si no se encontraron partidos asociados al equipo, proceder con la eliminación
            if (squads.length <= 0) {
              this.fbSvc.deleteDocument("squads", squad.id!!).then(_ => {
                this.unsubscr = this.fbSvc.subscribeToCollection('squads', this._squads, this.mapSquads);
              }).catch(err => {
                obs.error(err);
              });
            } else {
              obs.error("No se pudo borrar");
            }
          } else {
            // Si no hay partidos, proceder con la eliminación del equipo
            this.fbSvc.deleteDocument("squads", squad.id!!).then(_ => {
              this.unsubscr = this.fbSvc.subscribeToCollection('squads', this._squads, this.mapSquads);
            }).catch(err => {
              obs.error(err);
            });
          }
        }).catch(err => obs.error(err));
      }
    });
  }
}
