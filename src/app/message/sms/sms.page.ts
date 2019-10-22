import { Component, OnInit } from '@angular/core';
import { HttpServiceService } from '../../http-service.service';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-sms',
  templateUrl: './sms.page.html',
  styleUrls: ['./sms.page.scss'],
})
export class SmsPage {
  filter_factors: any = {};
  popup_type: any;
  invite_list: any;
  selected_index: any = null;
  selected_invite: any;

  constructor(private httpService: HttpServiceService, private navParams: NavParams, private modalCtrl: ModalController, private toastCtrl: ToastController,
    private storage: Storage) {
  }

  ionViewWillEnter() {
    console.log(this.navParams.data);
    this.filter_factors = this.navParams.data['filter_factors'];
    this.popup_type = this.navParams.data['popup_type'];
    console.log(this.filter_factors);
    console.log(this.popup_type);
    if(this.popup_type == 'invite') {
      this.storage.get('user_profile').then((user_profile) => {
        console.log(user_profile);
        this.httpService.serveInviteList({business_name: user_profile['business']['name']}).subscribe((data) => {
          console.log(data);
          this.invite_list = data;
        },(error) => {
          console.error(error);
        });
      });
    }
  }

  sendSms(message) {
    const data = { 'message': message, 'filter_factors': this.filter_factors, popup_type: this.popup_type };
    this.httpService.sendSmsToFarmers(data).subscribe((res_data) => {
      // this.modalCtrl.dismiss();
      console.log(res_data);
      this.displayToast(res_data['message']);
      this.closeModalControl();
    }, (error) => {
      console.log(error);
    });
  }

  async displayToast(message) {
    const toast = await this.toastCtrl.create({
      message: message,
      position: 'middle',
      duration: 3000
    });
    toast.present();
  }

  closeModalControl() {
    this.modalCtrl.dismiss();
  }

  showInvite(invite_index) {
    if (this.selected_index === invite_index) {
      this.selected_index = null;
    } else {
      this.selected_index = invite_index;
    }
  }

  onInviteClicked() {
    console.log(this.selected_invite);
    const data = { 'invite': this.selected_invite, 'filter_factors': this.filter_factors, popup_type: this.popup_type };
    this.httpService.sendSmsToFarmers(data).subscribe((res_data) => {
      // this.modalCtrl.dismiss();
      console.log(res_data);
      this.displayToast(res_data['message']);
      this.closeModalControl();
    }, (error) => {
      console.log(error);
    });
  }

}
