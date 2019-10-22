import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FarmersPage } from './farmers.page';
import { SearchFarmerPipe } from '../../global-pipe/search-farmer.pipe';
const routes: Routes = [
  {
    path: '',
    component: FarmersPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FarmersPage, SearchFarmerPipe]
})
export class FarmersPageModule {}
