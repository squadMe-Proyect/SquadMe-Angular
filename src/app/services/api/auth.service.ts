import { Injectable } from '@angular/core';
import { Auth } from 'firebase/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { Coach } from 'src/app/interfaces/coach';
import { Player } from 'src/app/interfaces/player';



@Injectable({
  providedIn: 'root'
})
export abstract class AuthService {

  protected _connected = new BehaviorSubject<boolean|null>(null);
  public isConnected$ = this._connected.asObservable();
  protected _user = new BehaviorSubject<Coach|Player|null>(null);
  public user$ = this._user.asObservable();
  
  public abstract login(credentials:Object):Observable<Coach|Player>;

  public abstract register(info:Object):Observable<Coach|Player>;

  public abstract logout():Observable<void>;

  public abstract me():Observable<Coach|Player|null>;
}