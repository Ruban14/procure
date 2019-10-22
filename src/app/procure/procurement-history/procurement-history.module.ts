import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProcurementHistoryPage } from './procurement-history.page';

const routes: Routes = [
  {
    path: '',
    component: ProcurementHistoryPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProcurementHistoryPage]
})
export class ProcurementHistoryPageModule {}
