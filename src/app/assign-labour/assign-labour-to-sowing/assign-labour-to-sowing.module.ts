import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AssignLabourToSowingPage } from './assign-labour-to-sowing.page';

const routes: Routes = [
  {
    path: '',
    component: AssignLabourToSowingPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AssignLabourToSowingPage]
})
export class AssignLabourToSowingPageModule {}
