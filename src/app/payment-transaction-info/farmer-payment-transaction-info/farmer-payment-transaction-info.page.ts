import { Component } from '@angular/core';
import { ActivatedRoute, } from '@angular/router';
import { HttpServiceService } from '../../http-service.service';
import { ModalController } from '@ionic/angular';
import { FarmerPaymentTransactionUpdatePage } from '../farmer-payment-transaction-update/farmer-payment-transaction-update.page';

@Component({
  selector: 'app-farmer-payment-transaction-info',
  templateUrl: './farmer-payment-transaction-info.page.html',
  styleUrls: ['./farmer-payment-transaction-info.page.scss'],
})
export class FarmerPaymentTransactionInfoPage {
  transactions: any = [];
  farmer_id = null;

  constructor(private activateRoute: ActivatedRoute, private httpService: HttpServiceService, private modalCtrl: ModalController) {
    this.farmer_id = this.activateRoute.snapshot.paramMap.get('farmer_id');
    console.log(this.farmer_id);
    this.getFarmerTransaction();
  }

  getFarmerTransaction() {
    const data = {'farmer_id': this.farmer_id};
    this.httpService.getFarmerTransaction(data).subscribe((res_data) => {
      console.log(res_data);
      this.transactions = res_data;
    }, (error) => {
      console.log(error);
    });
  }

  async showFarmerTransactionEditModel(transaction, transaction_index) {
    const modal = await this.modalCtrl.create({
      component: FarmerPaymentTransactionUpdatePage,
      componentProps: {'farmer_id': this.farmer_id, 'transaction': transaction, 'transaction_index': transaction_index},
      cssClass: 'inset-modal'
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    console.log(data);
    if (data !== undefined) {
      if (data['status'] === 'success') {
        this.getFarmerSingleTransaction(data['transaction_id'], data['transaction_index']);
      }
    }
  }

  getFarmerSingleTransaction(transaction_id, transaction_index) {
    const data = {'transaction_id': transaction_id};
    this.httpService.getFarmerTransaction(data).subscribe((res_data) => {
      console.log(res_data);
      this.transactions[transaction_index] = res_data[0];
    }, (error) => {
      console.log(error);
    });
  }
}
