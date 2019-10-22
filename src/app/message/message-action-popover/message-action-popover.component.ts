import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, PopoverController } from '@ionic/angular';
import { HttpServiceService } from '../../http-service.service';
import { SmsPage } from '../sms/sms.page';

@Component({
  selector: 'app-message-action-popover',
  templateUrl: './message-action-popover.component.html',
  styleUrls: ['./message-action-popover.component.scss']
})
export class MessageActionPopoverComponent implements OnInit {

  constructor(private navPrarams: NavParams, private modalCtrl: ModalController, private popoverCtrl: PopoverController,
              private httpService: HttpServiceService) {
    console.log(this.navPrarams.data);
    // console.log(this.navPrarams.data['crops']);
  }

  ngOnInit() {
  }

  sendMessage() {
    // alert('send message');
    this.popoverCtrl.dismiss();
    this.presentSmsModal('sms');
  }

  async presentSmsModal(popup_type) {
    const modal = await this.modalCtrl.create({
      component: SmsPage,
      cssClass: 'inset-modal',
      componentProps: { 'filter_factors': this.navPrarams.data['data'], popup_type: popup_type }
    });
    return await modal.present();
  }

  sendInvite() {
    this.popoverCtrl.dismiss();
    this.presentSmsModal('invite');
  }

  sendWhatsApp() {
    // alert('send whats app');
    console.log('Whatsapp');
  }

}
