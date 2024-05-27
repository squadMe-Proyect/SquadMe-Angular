import { Injectable } from '@angular/core';
import { FirebaseDocument, FirebaseService } from './firebase/firebase.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Coach } from '../interfaces/coach';
import { Unsubscribe } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class CoachService {
  private _coaches = new BehaviorSubject<Coach[]>([])
  public coaches$ = this._coaches.asObservable()
  private unsubs:Unsubscribe | null = null
  constructor(
    private fbSvc:FirebaseService,
  ) {
    this.unsubs = fbSvc.subscribeToCollection("coaches", this._coaches, this.mapCoaches)
  }

  private mapCoaches(el:FirebaseDocument):Coach {
    return {
      id:el.id,
      name:el.data['name'],
      surname:el.data['surname'],
      teamName:el.data['teamName'],
      email:el.data['email'],
      role:el.data['role'],
      nation:el.data['nation']
    }
  }

  createCoach(user:Coach):Observable<void> {
    return new Observable<void>(obs => {
      var userWithoutId = {...user}
      delete userWithoutId.id
      this.fbSvc.createDocumentWithId("coaches", userWithoutId, user?.id!!).then(_=>{
        this.unsubs = this.fbSvc.subscribeToCollection("coaches", this._coaches, this.mapCoaches)
      }).catch(err => {
        obs.error(err)
      })
    })
  }

  updateCoach(user:Coach):Observable<Coach> {
    return new Observable<Coach>(obs => {
      this.fbSvc.updateDocument("coaches", user.id!!, user).then(_=>{
        this.unsubs = this.fbSvc.subscribeToCollection("coaches", this._coaches, this.mapCoaches)
        obs.next(user)
        obs.complete()
      }).catch(err => {
        obs.error(err)
      })
    })
  }

  deleteCoach(user:Coach):Observable<void> {
    return new Observable<void>(obs => {
      var fbUser:any = user
      this.fbSvc.deleteDocument("coaches", user.id!!).then(_=>{
        this.unsubs = this.fbSvc.subscribeToCollection("coaches", this._coaches, this.mapCoaches)
      }).catch(err => {
        obs.error(err)
      })
      this.fbSvc.deleteUser().then().catch(err => {
        obs.error(err)
      })
    })
  }
}
