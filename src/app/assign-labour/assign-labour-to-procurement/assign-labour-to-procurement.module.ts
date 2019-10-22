import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AssignLabourToProcurementPage } from './assign-labour-to-procurement.page';

const routes: Routes = [
  {
    path: '',
    component: AssignLabourToProcurementPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule
  ],
  declarations: [AssignLabourToProcurementPage]
})
export class AssignLabourToProcurementPageModule {}
