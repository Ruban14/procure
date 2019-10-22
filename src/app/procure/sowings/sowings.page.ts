import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpServiceService} from '../../http-service.service';
import { LoadingController, NavController, ModalController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AddProcureExpensePage } from '../add-procure-expense/add-procure-expense.page';
import { AddProcurementPayoutPage } from '../add-procurement-payout/add-procurement-payout.page';
import { HarvestPage } from '../../sowing-expense/harvest/harvest.page';
import { AssignLabourToProcurementPage } from '../../assign-labour/assign-labour-to-procurement/assign-labour-to-procurement.page';
@Component({
  selector: 'app-sowings',
  templateUrl: './sowings.page.html',
  styleUrls: ['./sowings.page.scss'],
})
export class SowingsPage {
  farmer: any = null;
  sowings: any = [];
  procurements: any = {};
  harvests: any = [];
  procurements_expenses: any = {};
  procurements_payouts: any = {};
  selected_sowing_id_for_procurement_history: number = null;
  show_sowing_fab_button: string = null;

  constructor(private route: ActivatedRoute, private router: Router, private httpService: HttpServiceService,
              private loadingCtrl: LoadingController, private storage: Storage, private navCtrl: NavController,
              private modalCtrl: ModalController, private toastCtrl: ToastController) {
    console.log('sowings page');
  }

  ionViewWillEnter() {
    console.log(this.route.snapshot.paramMap.get('farmer_id'));
    const data = {'farmer_id': this.route.snapshot.paramMap.get('farmer_id')};
    this.getSowings(data);
    this.storage.get('selected_farmer').then((farmer_data) => {
      console.log(farmer_data);
      this.farmer = farmer_data;
    });
    // this.getFarmerProcurementHistory(data);
  }

  async presentAddExpenseModal(procurement_id, sowing_id) {
    this.show_sowing_fab_button = null;
    const modal = await this.modalCtrl.create({
      component: AddProcureExpensePage,
      cssClass: 'inset-modal',
      componentProps: {'procurement_id': procurement_id, 'sowing_id': sowing_id}
    });
    await modal.present();
    // return await  modal.present();
    console.log('after precent');
    const { data } = await modal.onDidDismiss();
    if (data !== undefined) {
      if (data['status'] === 'success') {
        this.getSowingProcurementHistory(data['sowing_id']);
      }
    }
    console.log(data);
  }

  async presentPayOutModal(procurement_id, sowing_id) {
    this.show_sowing_fab_button = null;
    const modal = await this.modalCtrl.create({
      component: AddProcurementPayoutPage,
      cssClass: 'inset-modal',
      componentProps: {'procurement_id': procurement_id, 'sowing_id': sowing_id}
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data !== undefined) {
      if (data['status'] === 'success') {
        this.getSowingProcurementHistory(data['sowing_id']);
      }
    }
  }

  async presentHarvestModal(sowing_id) {
    this.show_sowing_fab_button = null;
    const modal = await this.modalCtrl.create({
      component: HarvestPage,
      cssClass: 'inset-modal',
      componentProps: {'sowing_id': sowing_id}
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    console.log(data);
    if (data !== undefined) {
      if (data['status'] === 'success') {
        this.showHarvestHistory(data['sowing_id'])
      }
    }
  }

  async presentLabourProcurementMapModal(target_id, target_table) {
    this.show_sowing_fab_button = null;
    const modal = await this.modalCtrl.create({
      component: AssignLabourToProcurementPage,
      cssClass: 'inset-modal',
      componentProps: {'target_id': target_id, 'target_table': target_table}
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data !== undefined) {
      if (data['status'] === 'success') {
        this.displayToast('Operation successfully', 'middle');
      }
    }
  }

  async getSowings(farmer_data) {
    this.show_sowing_fab_button = null;
    const loading = await this.loadingCtrl.create({
      animated: true,
      spinner: 'dots',
    });
    loading.present();
    this.httpService.getFarmerSowings(farmer_data).subscribe((data) => {
      console.log(data);
      loading.dismiss();
      this.sowings = data;
    }, (error) => {
      loading.dismiss();
      console.log(error);
    });
  }

  getSowingProcurementHistory(sowing_id) {
    this.show_sowing_fab_button = null;
    const sowing_data = {'sowing_id': sowing_id};
    this.httpService.getProcurementHistory(sowing_data).subscribe((data) => {
      this.selected_sowing_id_for_procurement_history = sowing_id;
      console.log(data);
      console.log(this.selected_sowing_id_for_procurement_history);
      this.procurements = data['procurements'];
      this.procurements_expenses = data['procurements_expenses'];
      this.procurements_payouts = data['procurements_payouts'];
      this.harvests = [];
    }, (error) => {
      console.log(error);
      this.displayToast('Error to get procurement history', 'middle');
    });
  }

  navPage(page_url: string, sowing_id, instance_crop_id, sowing_obj) {
    console.log(sowing_id);
    this.storage.get('selected_sowing').then((sowing) => {
      console.log(sowing);
      if (sowing != null) {
        console.log('Sowing is not null');
        this.storage.remove('selected_sowing').then(() => {
          this.storage.set('selected_sowing', sowing_obj);
          this.show_sowing_fab_button = null;
          this.router.navigateByUrl(page_url + sowing_id + '/' + instance_crop_id);
        });
      } else {
        console.log('Selected sowing is null');
        this.storage.set('selected_sowing', sowing_obj);
        this.router.navigateByUrl(page_url + sowing_id + '/' + instance_crop_id);
      }
    });
  }

  onHomeIconClicked() {
    this.navCtrl.navigateBack('auth/app/tabs/tab1');
  }

  farmer_overall_payment_information() {
    console.log();
    this.router.navigateByUrl('farmer-payment-transaction-info/' + this.farmer['id']);
  }

  showHarvestHistory(sowing_id) {
    this.show_sowing_fab_button = null;
    console.log(sowing_id);
    const data = {'sowing_id': sowing_id};

    this.httpService.getSowingHarvests(data).subscribe((res_data) => {
      console.log(res_data);
      this.selected_sowing_id_for_procurement_history = sowing_id;  
      this.harvests = res_data;
      this.procurements = {};
    }, (error) => {
      console.log(error);
      this.displayToast('Error to get harvest history', 'middle');
    });
  }

  async displayToast(message, position) {
    const toast = await this.toastCtrl.create({
      message: message,
      position: position,
      duration: 3000
    });
    toast.present();
  }

  fab_clicked(text) {
    console.log(text);
    if (this.show_sowing_fab_button !== null) {
      this.show_sowing_fab_button = null;
    } else {
      this.show_sowing_fab_button = text;
    }
  }

  async register_farmer_payment(farmer_id) {
    const modal = await this.modalCtrl.create({
      component: AddProcurementPayoutPage,
      cssClass: 'inset-modal',
      componentProps: {'farmer_id': farmer_id}
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data !== undefined) {
      if (data['status'] === 'success') {
      }
    }
  }

}
