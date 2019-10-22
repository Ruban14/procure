import { Component, OnInit } from '@angular/core';
import { HttpServiceService } from '../../http-service.service';
import { Router, NavigationExtras } from '@angular/router';
import {
  LoadingController,
  ModalController,
  NavController
} from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AddProcurementPayoutPage } from '../add-procurement-payout/add-procurement-payout.page';

@Component({
  selector: 'app-farmers',
  templateUrl: './farmers.page.html',
  styleUrls: ['./farmers.page.scss']
})
export class FarmersPage implements OnInit {
  farmers: any;
  farmer_villages: string[] = [];
  selected_index = null;

  constructor(
    private httpService: HttpServiceService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private storage: Storage,
    private navCtrl: NavController,
    private modalCtrl: ModalController
  ) {
    console.log('farmers working fine');
  }

  ngOnInit() {}

  async ionViewWillEnter() {
    this.storage.get('farmers').then(
      data => {
        console.log(data);
        if (data != null) {
          this.farmers = data;
          this.farmer_villages = Object.keys(data);
        } else {
          this.farmers = null;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  showFarmers(village_index: number) {
    if (this.selected_index === village_index) {
      this.selected_index = null;
    } else {
      this.selected_index = village_index;
    }
  }

  navPage(farmer_id, farmer_obj) {
    this.storage.get('selected_farmer').then(farmer => {
      console.log(farmer);
      if (farmer != null) {
        console.log('Selected Farmer is Not Null');
        this.storage.remove('selected_farmer').then(() => {
          this.storage.set('selected_farmer', farmer_obj);
          this.navCtrl.navigateForward('/sowings/' + farmer_id);
        });
      } else {
        console.log('Selected Farmer is Null');
        this.storage.set('selected_farmer', farmer_obj);
        this.navCtrl.navigateForward('/sowings/' + farmer_id);
      }
    });
  }

  farmer_overall_payment_information(farmer_id) {
    console.log();
    this.router.navigateByUrl('farmer-payment-transaction-info/' + farmer_id);
  }

  async register_farmer_payment(farmer_id) {
    const modal = await this.modalCtrl.create({
      component: AddProcurementPayoutPage,
      cssClass: 'inset-modal',
      componentProps: { farmer_id: farmer_id }
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data !== undefined) {
      if (data['status'] === 'success') {
      }
    }
  }

  onRouteClickded() {
    console.log('navigate clciked');
    this.navCtrl.navigateForward('/routes');
  }
}
