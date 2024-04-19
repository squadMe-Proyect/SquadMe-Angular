import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase/firebase.service';
import { Observable } from 'rxjs';
import { Coach } from '../interfaces/coach';

@Injectable({
  providedIn: 'root'
})
export class CoachService {

  constructor(
    private fbSvc:FirebaseService
  ) {}

  createCoach(user:Coach):Observable<void> {
    return new Observable<void>(obs => {
      var userWithoutId = {...user}
      delete userWithoutId.id
      this.fbSvc.createDocumentWithId("coaches", userWithoutId, user?.id!!).then().catch(err => {
        obs.error(err)
      })
    })
  }

  updateCoach(user:Coach):Observable<Coach> {
    return new Observable<Coach>(obs => {
      this.fbSvc.updateDocument("coaches", user.id!!, user).then(_=>{
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
      this.fbSvc.deleteDocument("coaches", user.id!!).then().catch(err => {
        obs.error(err)
      })
      this.fbSvc.deleteUser().then().catch(err => {
        obs.error(err)
      })
    })
  }
}
