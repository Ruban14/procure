import { Component } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpServiceService } from '../../http-service.service';

@Component({
  selector: 'app-farmer-payment-transaction-update',
  templateUrl: './farmer-payment-transaction-update.page.html',
  styleUrls: ['./farmer-payment-transaction-update.page.scss'],
})

export class FarmerPaymentTransactionUpdatePage {
  transaction_form: FormGroup;
  constructor(private navPrams: NavParams, private formBuilder: FormBuilder, private modalCtrl: ModalController,
              private httpService: HttpServiceService) {
    console.log(this.navPrams.data);
    this.transaction_form = this.formBuilder.group({
      transaction_id: [this.navPrams.data['transaction']['id'], Validators.compose([Validators.required])],
      amount: [this.navPrams.data['transaction']['amount'], Validators.compose([Validators.required])],
      date: [this.navPrams.data['transaction']['date'], Validators.compose([Validators.required])]
    });
  }

  closeModalCtrl() {
    this.modalCtrl.dismiss({
      'status': 'success'
    });
  }

  updateFarmerTransaction() {
    this.httpService.updateFarmerTransaction(this.transaction_form.value).subscribe((data) => {
      console.log(data);
      this.modalCtrl.dismiss({
        'status': 'success',
        'transaction_index': this.navPrams.data['transaction_index'],
        'transaction_id': this.navPrams.data['transaction']['id'],
      });
    }, (error) => {
      console.log(error);
    });
  }

}
