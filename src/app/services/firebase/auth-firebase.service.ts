import { Observable, lastValueFrom } from 'rxjs';
import { UserCredentials } from '../../interfaces/user-credentials';
import { UserRegisterInfo } from '../../interfaces/user-register-info';
import { AuthService } from '../api/auth.service';
import { FirebaseService } from './firebase.service';
import { Player } from 'src/app/interfaces/player';
import { Coach } from 'src/app/interfaces/coach';

/**
 * Servicio de autenticación y gestión de usuarios mediante Firebase.
 * Implementa métodos para login, registro, logout, y gestión de la sesión del usuario.
 */
export class AuthFirebaseService extends AuthService {

  constructor(
    private fbSvc: FirebaseService,
  ) {
    super();
    // Suscribe al estado de autenticación de Firebase para actualizar el usuario y conexión
    fbSvc.isLogged$.subscribe(logged => {
      if (logged) {
        // Cuando el usuario está autenticado, carga sus datos
        this.me().subscribe(user => {
          this._user.next(user);
        });
      } else {
        // Cuando el usuario no está autenticado, establece el usuario como nulo
        this._user.next(null);
      }
      // Actualiza el estado de conexión
      this._connected.next(logged);
    });
  }
 
  /**
   * Realiza el inicio de sesión con credenciales de usuario.
   * @param credentials Credenciales de usuario (email y contraseña).
   * @returns Observable que emite el usuario autenticado (Player o Coach).
   */
  public login(credentials: UserCredentials): Observable<Coach | Player> {
    return new Observable<Coach | Player>(obs => {
      let user: Player | Coach | null = null;
      // Conecta al usuario usando Firebase Authentication
      this.fbSvc.connectUserWithEmailAndPassword(credentials.email, credentials.password)
        .then(async fbCredentials => {
          const user_id = fbCredentials?.user.user.uid;
          if (user_id) {
            user = await lastValueFrom(this.me());
          }
          if (user) {
            // Actualiza el estado de conexión y el usuario actual
            this._connected.next(true);
            this._user.next(user);
            obs.next(user);
            obs.complete();
          } else {
            // Elimina el usuario si no existe en la base de datos
            await this.fbSvc.deleteUser();
            obs.error("ERROR user does not exists in the database");
          }
        }).catch(err => {
          obs.error(err);
          console.log(err);
        });
    });
  }

  /**
   * Realiza el cierre de sesión del usuario.
   * @returns Observable que indica la finalización del cierre de sesión.
   */
  logout(): Observable<void> {
    return new Observable<void>(obs => {
      this.fbSvc.signOut(false).then(fn => {
        obs.next(fn);
        obs.complete();
        // Actualiza el estado de conexión y establece el usuario como nulo
        this._connected.next(false);
        this._user.next(null);
      }).catch(err => {
        obs.error(err);
      });
    });
  }

  /**
   * Registra un nuevo usuario con la información proporcionada.
   * @param info Información del usuario a registrar.
   * @returns Observable que emite el usuario registrado (Player o Coach).
   */
  register(info: UserRegisterInfo): Observable<Coach | Player> {
    return new Observable<Coach | Player>(obs => {
      const user = this.fbSvc.getUser();
      const auth = this.fbSvc.getAuth()!!;
      // Crea un nuevo usuario usando Firebase Authentication
      this.fbSvc.createUserWithEmailAndPassword(info.email, info.password)
        .then(credentials => {
          const _user = credentials?.user.user;
          const _extendedUser: any = {
            id: _user?.uid,
            name: info.name,
            surname: info.surname,
            teamName: info.teamName,
            email: _user?.email!!,
            picture: "",
            nation: info.nation,
            role: info.role
          };
          if (user) {
            // Actualiza el usuario actual en Firebase Authentication
            auth.updateCurrentUser(user).then(_ => {
              // Si no hay usuario actualmente conectado, establece el nuevo usuario y conexión
              if (!this._user.value && !(this._connected.value || this._connected.value == false)) {
                this._user.next(_extendedUser);
                this._connected.next(true);
              }
              obs.next(_extendedUser);
              obs.complete();
            }).catch(er => {
              obs.error(er);
            });
          } else {
            // Establece el nuevo usuario y conexión
            this._user.next(_extendedUser);
            this._connected.next(true);
            obs.next(_extendedUser);
            obs.complete();
          }
        }).catch(err => {
          obs.error(err);
        });
    });
  }

  /**
   * Establece el usuario actual en el servicio de autenticación.
   * @param user Usuario (Player o Coach) a establecer.
   * @returns Observable que indica la finalización de la operación.
   */
  public setUser(user: Coach | Player | null): Observable<void> {
    return new Observable<void>(_ => {
      this._user.next(user);
    });
  }

  /**
   * Reinicia la contraseña del usuario actual.
   * @returns Observable que indica la finalización del reinicio de contraseña.
   */
  public override resetPassword(): Observable<void> {
    return new Observable<void>(obs => {
      this.fbSvc.resetPassword().then(fn => {
        obs.next(fn);
        obs.complete();
      }).catch(err => {
        obs.error(err);
      });
    });
  }

  /**
   * Reinicia la contraseña del usuario con el email proporcionado.
   * @param email Email del usuario para reiniciar la contraseña.
   * @returns Observable que indica la finalización del reinicio de contraseña.
   */
  public override resetPasswordWithEmail(email: string): Observable<void> {
    return new Observable<void>(obs => {
      this.fbSvc.resetPasswordWithEmail(email).then(fn => {
        obs.next(fn);
        obs.complete();
      }).catch(err => {
        obs.error(err);
      });
    });
  }

  /**
   * Obtiene los datos del usuario actual autenticado.
   * @returns Observable que emite el usuario autenticado (Player o Coach).
   */
  public me(): Observable<Coach | Player | null> {
    return new Observable<Coach | Player | null>(obs => {
      if (!this._user.value) {
        if (this.fbSvc.getUser()?.uid) {
          const id: string = this.fbSvc.getUser()?.uid!!;
          // Obtiene los datos del usuario desde Firebase Firestore (primero busca en 'coaches', luego en 'players')
          this.fbSvc.getDocument("coaches", id).then(coach => {
            const data: any = coach.data;
            const _user: Coach | Player = {
              id: coach.id,
              name: data['name'],
              surname: data['surname'],
              teamName: data['teamName'],
              email: data['email'],
              nation: data['nation'],
              role: data['role'],
              picture: data['picture']
            };
            // Establece el usuario actual y completa el observable
            this._user.next(_user);
            obs.next(_user);
            obs.complete();
          }).catch(_ => {
            // Si no se encuentra en 'coaches', busca en 'players'
            this.fbSvc.getDocument("players", id).then(player => {
              const data: any = player.data;
              const _user: Coach | Player = {
                id: player.id,
                name: data['name'],
                surname: data['surname'],
                teamName: data['teamName'],
                email: data['email'],
                nation: data['nation'],
                role: data['role'],
                coachId: data['coachId'],
                picture: data['picture']
              };
              // Establece el usuario actual y completa el observable
              this._user.next(_user);
              obs.next(_user);
              obs.complete();
            }).catch(_ => {
              // Si no se encuentra en 'players' ni en 'coaches', emite null y completa el observable
              obs.next(null);
              obs.complete();
            });
          });
        }
      }
    });
  }
}