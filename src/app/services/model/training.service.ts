import { Injectable } from '@angular/core';
import { FirebaseDocument, FirebaseService } from '../firebase/firebase.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Training } from '../../interfaces/training';
import { Unsubscribe } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  private _trainings = new BehaviorSubject<Training[]>([])
  public trainings$ = this._trainings.asObservable()
  private unsubs:Unsubscribe | null = null;
  constructor(
    private fbSvc:FirebaseService
  ) { 
    this.unsubs = fbSvc.subscribeToCollection("trainings", this._trainings, this.mapTrainings)
  }

  mapTrainings(fd:FirebaseDocument):Training {
    return {
      id:fd.id,
      date:fd.data['date'],
      exercises:fd.data['exercises'],
      completed:fd.data['completed'],
      coachId:fd.data['coachId']
    }
  }

  getTraining(id:string):Observable<Training> {
    return new Observable<Training>(obs => {
      this.fbSvc.getDocument("trainings", id).then(doc => {
        const training = this.mapTrainings(doc)
        obs.next(training)
        obs.complete()
      }).catch(err => {
        obs.error(err)
      })
    })
  }

  createTraining(training:Training, user:any):Observable<Training> {
    return new Observable<Training>(obs => {
      if(user.role == 'ADMIN') {
        delete training.id
        training.coachId = user.id
        training.completed = false
        this.fbSvc.createDocument("trainings", training).then(_=> {
          this.unsubs = this.fbSvc.subscribeToCollection("trainings", this._trainings, this.mapTrainings)
          obs.next(training)
          obs.complete()
        }).catch(err=> {
          obs.error(err)
        })
      }
    })
  }

  updateTraining(training:Training, user:any):Observable<Training> {
    return new Observable<Training>(obs => {
      if(user.role == 'ADMIN') {
        var trainingWithoutId = {...training}
        delete trainingWithoutId.id
        this.fbSvc.updateDocument("trainings", training.id!!, trainingWithoutId).then(_=> {
          this.unsubs = this.fbSvc.subscribeToCollection("trainings", this._trainings, this.mapTrainings)
          obs.next(training)
          obs.complete()
        }).catch(err=> {
          obs.error(err)
        })
      }
    })
  }

  deleteTraining(training:Training, user:any):Observable<void> {
    return new Observable<void>(obs=> {
      if(user.role == 'ADMIN') {
        this.fbSvc.deleteDocument("trainings", training.id!!).then(_=> {
          this.unsubs = this.fbSvc.subscribeToCollection("trainings", this._trainings, this.mapTrainings)
        }).catch(err=> {
          obs.error(err)
        })
      }
    })
  }
}
