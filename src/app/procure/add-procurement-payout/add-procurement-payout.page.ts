import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import { HttpServiceService } from '../../http-service.service';
import * as moment from 'moment';
@Component({
  selector: 'app-add-procurement-payout',
  templateUrl: './add-procurement-payout.page.html',
  styleUrls: ['./add-procurement-payout.page.scss'],
})
export class AddProcurementPayoutPage {
  expense_payout_form: FormGroup;
  transaction_types: any = [];
  transaction_statuses: any = [];
  users: any = [];

  constructor(public formBuilder: FormBuilder,  private modalCtrl: ModalController, private toastCtrl: ToastController,
              private navParams: NavParams, private httpService: HttpServiceService) {
    this.expense_payout_form = this.formBuilder.group({
      farmer_id: [this.navParams.data['farmer_id'], Validators.compose([])],
      transaction_type_id: [null, Validators.compose([Validators.required])],
      transaction_status_id: [null, Validators.compose([Validators.required])],
      transacted_by_id: [null, Validators.compose([Validators.required])],
      date_time: [null, Validators.compose([Validators.required])],
      amount: [null, Validators.compose([Validators.required])],
    });
    this.getTransactionAndStatusCvs();
  }

  getTransactionAndStatusCvs() {
    this.httpService.getTransactionAndStatusCvs().subscribe((data) => {
      this.transaction_statuses = data['transaction_statuses'];
      this.transaction_types = data['transaction_types'];
      this.users = data['users'];
    });
  }


  addPayOut() {
    console.log(this.expense_payout_form.value);
    const data_dict = Object.assign({}, this.expense_payout_form.value);
    data_dict['date_time'] = moment(this.expense_payout_form.value['date_time']).format('YYYY-MM-DD HH:mm A');
    this.httpService.addProcurementPayOut(data_dict).subscribe((data) => {
      console.log(data);
      this.modalCtrl.dismiss({
        status: 'success', sowing_id: this.navParams.data['sowing_id']
      });
      // this.modalCtrl.dismiss();
      this.displayToast('Farmer Payout Added Successfully ', 'top');
    }, (error) => {
      console.log(error);
      this.displayToast('ERROR', 'top');
    });
  }

  async displayToast(message, position) {
    const toast = await this.toastCtrl.create({
      message: message,
      position: 'top',
      duration: 3000
    });
    toast.present();
  }

  closePopup() {
    this.modalCtrl.dismiss();
  }

}
