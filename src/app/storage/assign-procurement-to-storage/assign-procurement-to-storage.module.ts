import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AssignProcurementToStoragePage } from './assign-procurement-to-storage.page';

const routes: Routes = [
  {
    path: '',
    component: AssignProcurementToStoragePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AssignProcurementToStoragePage]
})
export class AssignProcurementToStoragePageModule {}
