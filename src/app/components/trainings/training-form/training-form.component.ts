import { Component, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonDatetime, IonInput, IonPopover, ModalController, ToastController, ToastOptions } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { Training } from 'src/app/interfaces/training';
import { CustomTranslateService } from 'src/app/services/auxiliar/custom-translate.service';

@Component({
  selector: 'app-training-form',
  templateUrl: './training-form.component.html',
  styleUrls: ['./training-form.component.scss'],
})
export class TrainingFormComponent  implements OnInit, ControlValueAccessor {
  form:FormGroup
  mode:'Edit' | 'New' = 'New'
  onChange?:(obj: any) => void
  disable:boolean = false
  exercisesAdded:string[] = []
  @Input() set training(_training:Training | null) {
    if(_training) {
      this.mode = 'Edit'
      this.form.controls['id'].setValue(_training.id)
      this.form.controls['date'].setValue(_training.date)
      this.form.controls['exercises'].setValue(_training.exercises)
      this.exercisesAdded = [..._training.exercises!!]
    }
  }
  constructor(
    private formB:FormBuilder,
    private toast:ToastController,
    private modal:ModalController,
    public translate:CustomTranslateService) {

    this.form = formB.group({
      id:[null],
      date:['',[Validators.required]],
      exercises:[[],[Validators.required]]
    })
  }
  writeValue(obj: any): void {
    this.form.controls['exercises'].setValue(obj)
  }
  registerOnChange(fn: any): void {
    this.onChange = fn
  }
  registerOnTouched(fn: any): void {
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disable = isDisabled
  }

  ngOnInit() {}

  onSubmit() {
    this.modal.dismiss(this.form.value, 'ok')
  }

  onCancel() {
    this.modal.dismiss(null, 'cancel')
  }

  async onSelectDate(popover:IonPopover, input:IonInput, dateTime:IonDatetime) {
    if(!dateTime.value) {
      const message = await lastValueFrom(this.translate.get('match.error.dateNotSelected'))
      const options:ToastOptions = {
        message:message,
        duration:1000,
        position:'bottom',
        color:'danger',
        cssClass:'red-toast'
      }
      this.toast.create(options).then(toast=>toast.present())
    } else {
      const day = dateTime.value?.slice(0,10)
      const hour = dateTime.value?.slice(day?.length!! + 1, dateTime.value.length - 3)
      console.log(day)
      console.log(hour)
      this.form.controls['date'].setValue(day+" - "+hour)
      input.value = day+" - "+hour
      popover.dismiss()
    }
  }

  async addExercise(popover:IonPopover, input:IonInput) {
    if(input.value && input.value != "") {
      this.exercisesAdded.push(input.value.toString())
      this.onChange?.(input.value.toString())
      this.form.controls['exercises'].setValue(this.exercisesAdded)
      popover.dismiss()
    } else {
      const message = await lastValueFrom(this.translate.get('training.error.empty-exercise-name'))
      const options:ToastOptions = {
        message:message,
        duration:1000,
        position:'bottom',
        color:'danger',
        cssClass:'red-toast'
      }
      this.toast.create(options).then(toast=>toast.present())
    }
  }

  deleteExercise(exercise:string) {
    const index = this.exercisesAdded.findIndex(e => e == exercise)
    if(index > -1) {
      this.exercisesAdded = [...this.exercisesAdded.slice(0, index),
         ...this.exercisesAdded.slice(index+1, this.exercisesAdded.length)]
      this.form.controls['exercises'].setValue(this.exercisesAdded)
    }
  }
}
