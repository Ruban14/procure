import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FarmerPaymentTransactionUpdatePage } from './farmer-payment-transaction-update.page';

const routes: Routes = [
  {
    path: '',
    component: FarmerPaymentTransactionUpdatePage
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
  declarations: [FarmerPaymentTransactionUpdatePage]
})
export class FarmerPaymentTransactionUpdatePageModule {}
