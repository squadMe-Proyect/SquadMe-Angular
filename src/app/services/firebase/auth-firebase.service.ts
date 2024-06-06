import { Observable, lastValueFrom } from 'rxjs';
import { UserCredentials } from '../../interfaces/user-credentials';
import { UserRegisterInfo } from '../../interfaces/user-register-info';
import { AuthService } from '../api/auth.service';
import { FirebaseService } from './firebase.service';
import { Player } from 'src/app/interfaces/player';
import { Coach } from 'src/app/interfaces/coach';


export class AuthFirebaseService extends AuthService {

  constructor(
    private fbSvc:FirebaseService,
  ) {
    super();
    fbSvc.isLogged$.subscribe(logged => {
      if(logged) {
        this.me().subscribe(user => {
          this._user.next(user)
        })
      } else {
        this._user.next(null)
      }
      this._connected.next(logged)
    })
  }
 
  public login(credentials:UserCredentials):Observable<Coach|Player>{
    return new Observable<Coach|Player>(obs=>{
      var user:Player | Coach | null = null
      this.fbSvc.connectUserWithEmailAndPassword(credentials.email, credentials.password).then(async fbCredentials => {
        const user_id = fbCredentials?.user.user.uid
        if(user_id) {
          user = await lastValueFrom(this.me())
        }
        if(user) {
          this._connected.next(true)
          this._user.next(user)
          obs.next(user)
          obs.complete()
        } else {
          await this.fbSvc.deleteUser()
          obs.error("ERROR user does not exists in the database")
        }
      }).catch(err => {
        obs.error(err)
        console.log(err)
      })
    });
  }

  logout():Observable<void>{
    return new Observable<void>(obs => {
      this.fbSvc.signOut(false).then(fn =>{
        obs.next(fn)
        obs.complete()
        this._connected.next(false)
        this._user.next(null)
      }).catch(err => {
        obs.error(err)
      })
    })
  }

  register(info:UserRegisterInfo):Observable<Coach|Player>{
    return new Observable<Coach|Player>(obs=>{
      const user = this.fbSvc.getUser()
      const auth = this.fbSvc.getAuth()!!
      this.fbSvc.createUserWithEmailAndPassword(info.email, info.password).then(credentials => {
        const _user = credentials?.user.user
        const _extendedUser:any = {
          id:_user?.uid,
          name:info.name,
          surname:info.surname,
          teamName:info.teamName,
          email:_user?.email!!,
          picture:"",
          nation:info.nation,
          role:info.role
        }
        if(user) {
          auth.updateCurrentUser(user).then(_=>{
            if(!this._user.value && !(this._connected.value || this._connected.value == false)) {
              this._user.next(_extendedUser)
              this._connected.next(true)
            }
            obs.next(_extendedUser)
            obs.complete()
          }).catch(er => {
            obs.error(er)
          })
        } else {
          this._user.next(_extendedUser)
          this._connected.next(true)
          obs.next(_extendedUser)
          obs.complete()
        }
      }).catch(err => {
        obs.error(err)
      })
    });
  }

  public setUser(user:Coach|Player|null):Observable<void> {
    return new Observable<void>(_=> {
      this._user.next(user)
    })
  }

  public override resetPassword(): Observable<void> {
    return new Observable<void>(obs => {
      this.fbSvc.resetPassword().then(fn => {
        obs.next(fn)
        obs.complete()
      }).catch(err => {
        obs.error(err)
      })
    })
  }

  public me():Observable<Coach|Player|null>{
    return new Observable<Coach|Player|null>(obs=>{
      if(!this._user.value) {
        if(this.fbSvc.getUser()?.uid) {
          const id:string = this.fbSvc.getUser()?.uid!!
          this.fbSvc.getDocument("coaches",id).then(coach => {
            const data:any = coach.data
            const _user:Coach|Player = {
              id: coach.id,
              name: data['name'],
              surname: data['surname'],
              teamName: data['teamName'],
              email: data['email'],
              nation: data['nation'],
              role: data['role'],
              picture: data['picture']
            }
            this._user.next(_user)
            obs.next(_user)
            obs.complete()
          }).catch(_=> {
            this.fbSvc.getDocument("players",id).then(player => {
              const data:any = player.data
              const _user:Coach|Player = {
                id: player.id,
                name: data['name'],
                surname: data['surname'],
                teamName: data['teamName'],
                email: data['email'],
                nation: data['nation'],
                role: data['role'],
                coachId: data['coachId'],
                picture: data['picture']
              }
              this._user.next(_user)
              obs.next(_user)
              obs.complete()
            }).catch(_=> {
                obs.next(null);
                obs.complete();
              })
          })
        }
      }
    })
  }
}