import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SowingsPage } from './sowings.page';
import { ProcurePipe } from '../procure.pipe';
// import { ChangeColorPipe } from '../../assign-labour/change-color.pipe';
import { ValidatePipe } from '../../validate.pipe';
import { TimeDiffInYearsPipe } from '../../global-pipe/time-diff-in-years.pipe';
const routes: Routes = [
  {
    path: '',
    component: SowingsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SowingsPage, ProcurePipe, ValidatePipe, TimeDiffInYearsPipe]
})
export class SowingsPageModule {}
