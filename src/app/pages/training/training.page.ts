import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { TrainingFormComponent } from 'src/app/components/trainings/training-form/training-form.component';
import { Training } from 'src/app/interfaces/training';
import { AuthService } from 'src/app/services/api/auth.service';
import { TrainingService } from 'src/app/services/model/training.service';

@Component({
  selector: 'app-training',
  templateUrl: './training.page.html',
  styleUrls: ['./training.page.scss'],
})
export class TrainingPage implements OnInit {
  private user:any
  trainings:Training[] = []
  constructor(
    private modal:ModalController,
    public authSvc:AuthService,
    public trainingSvc:TrainingService
  ) { 
    authSvc.user$.subscribe(u => {
      this.user = u
      this.onLoadTrainings(u)
    })
  }

  ngOnInit() {}

  onLoadTrainings(user:any) {
    this.trainingSvc.trainings$.subscribe(ts => {
      const _trainings = [...ts]
      this.trainings = _trainings.filter(t => t.coachId == user.id || t.coachId == user.coachId)
    })
  }

  async presentForm(data: Training | null, onDismiss: (result: any) => void) {
    const modal = await this.modal.create({
      component: TrainingFormComponent,
      cssClass:"form-modal",
      componentProps: {
        training: data
      }
    })
    modal.present()
    modal.onDidDismiss().then(result => {
      if (result?.data) {
        onDismiss(result)
      }
    })
  }

  onNewTraining() {
    var onDismiss = (info:any) => {
      switch (info.role) {
        case 'ok': {
          this.trainingSvc.createTraining(info.data, this.user).subscribe(_=>{
            this.onLoadTrainings(this.user)
          })
        }
        break
      }
    }
    this.presentForm(null, onDismiss)
  }

  onEditTraining(training:Training) {
    var onDismiss = (info:any) => {
      switch (info.role) {
        case 'ok': {
          const _training:Training = {
            id:training.id,
            date:info.data.date,
            exercises:info.data.exercises,
            completed:training.completed,
            coachId:training.coachId
          }
          this.trainingSvc.updateTraining(_training, this.user).subscribe(_=> {
            this.onLoadTrainings(this.user)
          })
        }
        break
        case 'cancel': {
          this.trainingSvc.getTraining(training.id!!).subscribe(_=> this.onLoadTrainings(this.user))
        }
      }
    }
    this.presentForm(training, onDismiss)
  }

  finishTraining(finished:boolean, training:Training) {
    if(training.completed != finished) {  
      training.completed = finished
      this.trainingSvc.updateTraining(training, this.user).subscribe(_=> {
        this.onLoadTrainings(this.user)
      })
    }
  }

  onDeleteTraining(training:Training) {
    this.trainingSvc.deleteTraining(training, this.user).subscribe(_=> this.onLoadTrainings(this.user))
  }
}
