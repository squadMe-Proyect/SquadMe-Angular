import { NgModule } from '@angular/core';

import { TrainingPageRoutingModule } from './training-routing.module';

import { TrainingPage } from './training.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    TrainingPageRoutingModule
  ],
  declarations: [TrainingPage]
})
export class TrainingPageModule {}
