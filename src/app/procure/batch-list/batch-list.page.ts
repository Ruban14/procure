import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';
import { HttpServiceService } from '../../http-service.service';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-batch-list',
  templateUrl: './batch-list.page.html',
  styleUrls: ['./batch-list.page.scss'],
})
export class BatchListPage implements OnInit {
  batch_list: any = [];

  constructor(private navCtrl: NavController, private httpService: HttpServiceService, private loadingCtrl: LoadingController, private router: Router) {

  }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    let loading = await this.loadingCtrl.create({
      animated: true,
      spinner: 'dots',
    });
    loading.present();
    this.httpService.getBatches().subscribe((data) => {
      loading.dismiss();
      this.batch_list = data;
      console.log(data);
    }, (error) => {
      loading.dismiss();
      console.error(error);
    });
  }

  onBatchClicked(batch, crop_id) {
    console.log(batch);
    console.log(crop_id);
    let data_obj: any;
    data_obj = {
      id: batch['id'],
      status: batch['status'],
      batch_code: batch['batch_code']
    }
    if (batch['start_date'] != null && batch['start_date'] !== 'NaT') {
      data_obj['start_date'] = batch['start_date'];
    }
    if (batch['end_date'] != null && batch['end_date'] !== 'NaT') {
      data_obj['end_date'] = batch['end_date'];
    }
    let navigationExtras: NavigationExtras = {
      queryParams: data_obj
    }
    console.log(navigationExtras);
    // this.navCtrl.navigateForward('batch-processing/' + batch_id + '/' + crop_id);
    this.router.navigate(['batch-processing', batch.id, crop_id], navigationExtras);
  }

  onAddBatch() {
    this.navCtrl.navigateForward('batching');
  }

  toStorage() {
    this.navCtrl.navigateForward('store-list');
  }

  checkStatus(status_id: number) {
    if (status_id == 1) {
      return 'blue';
    }
    if (status_id == 2) {
      return 'tomato';
    }
    if (status_id == 3) {
      return 'green';
    }
  }
}
