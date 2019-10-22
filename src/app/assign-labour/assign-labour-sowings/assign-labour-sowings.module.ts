import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AssignLabourSowingsPage } from './assign-labour-sowings.page';
import { SearchSowingsPipe } from '../search-sowings.pipe';
import { ChangeColorPipe } from '../change-color.pipe';

const routes: Routes = [
  {
    path: '',
    component: AssignLabourSowingsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AssignLabourSowingsPage, SearchSowingsPipe, ChangeColorPipe]
})
export class AssignLabourSowingsPageModule {}
