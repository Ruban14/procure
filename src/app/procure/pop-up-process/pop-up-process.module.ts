import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PopUpProcessPage } from './pop-up-process.page';

const routes: Routes = [
  {
    path: '',
    component: PopUpProcessPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PopUpProcessPage]
})
export class PopUpProcessPageModule {}
