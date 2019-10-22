import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { HttpServiceService } from '../../http-service.service';
import { AssignLabourToSowingPage } from '../assign-labour-to-sowing/assign-labour-to-sowing.page';
import { LinkRoutePage } from '../link-route/link-route.page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-assign-labour-sowings',
  templateUrl: './assign-labour-sowings.page.html',
  styleUrls: ['./assign-labour-sowings.page.scss'],
})
export class AssignLabourSowingsPage implements OnInit {
  sowing_villages: string[] = [];
  sowings: any = [];
  selected_index = null;
  legends: any = [];
  regular_suppliers: boolean = true;

  constructor(private httpService: HttpServiceService, private modalCtrl: ModalController, private router: Router,
    private loadingCtrl: LoadingController) {
    this.getSowings();
  }

  ngOnInit() {
  }

  async presentModal(sowing_id) {
    const modal = await this.modalCtrl.create({
      component: AssignLabourToSowingPage,
      cssClass: 'inset-modal',
      componentProps: { sowing_id: sowing_id }
    });
    modal.onWillDismiss().then((data) => {
      console.log(data);
      if (data['data'] != null || data['data'] !== undefined) {
        console.log(data);
        this.getRegularSowings();
      }
    }).catch((error) => {
      console.error(error)
    });
    return await modal.present();
  }

  getRegularSowings() {
    this.regular_suppliers = true;
    this.getSowings();
  }

  async getSowings() {
    let loading = await this.loadingCtrl.create({
      animated: true,
      spinner: 'lines',
    });
    loading.present();
    this.httpService.getSowingListForAssignLabour().subscribe((data) => {
      console.log(data);
      this.sowings = data['sowings'];
      this.legends = data['legends'];
      loading.dismiss();
      // this.sowing_villages = Object.keys(data);
    }, (error) => {
      loading.dismiss();
      console.log(error);
    });
  }

  showSowings(village_index: number) {
    if (this.selected_index === village_index) {
      this.selected_index = null;
    } else {
      this.selected_index = village_index;
    }
  }

  async presentLinkRoute(sowing_id) {
    console.log('present route');
    const route_modal = await this.modalCtrl.create({
      component: LinkRoutePage,
      cssClass: 'inset-modal',
      backdropDismiss: true,
      // showBackdrop: true,
      componentProps: { sowing_id: sowing_id }
    });
    route_modal.onWillDismiss().then((data) => {
      console.log(data);
      if (data['data'] !== null || data['data'] !== undefined) {
        console.log(data);
        this.getRegularSowings();
      }
    }).catch((error) => {
      console.error(error);
    });
    return await route_modal.present();
  }

  async getExcludedSowings() {
    let loading = await this.loadingCtrl.create({
      animated: true,
      spinner: 'lines',
    });
    loading.present();
    console.log('excluded sowings');
    this.regular_suppliers = false;
    this.sowings = [];
    this.httpService.getSowingsForProcurementExclude().subscribe((data) => {
      console.log(data);
      this.sowings = data['sowings'];
      this.legends = data['legends'];
      loading.dismiss();
      // this.sowings = data;
    }, (error) => {
      console.log(error);
      loading.dismiss();
    });
  }
  navPageToProcure(sowing_id, instance_crop_id) {
    console.log(sowing_id);
    console.log(instance_crop_id);
    this.router.navigateByUrl('vehicle-list/' + sowing_id + '/' + instance_crop_id);
  }

}


