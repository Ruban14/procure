import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AdvisoryMessagePage } from './advisory-message.page';

const routes: Routes = [
  {
    path: '',
    component: AdvisoryMessagePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AdvisoryMessagePage]
})
export class AdvisoryMessagePageModule {}
