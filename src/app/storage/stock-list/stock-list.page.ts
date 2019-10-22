import { Component } from '@angular/core';
import {HttpServiceService} from '../../http-service.service';
import { LoadingController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.page.html',
  styleUrls: ['./stock-list.page.scss'],
})
export class StockListPage {
  business_short_name: string = null;

  segment_type: any = 'procurement_segment';
  selected_radio_value: any = 'section';
  storages: any = null;
  storage_proc: any = null;
  storage_product: any = null;
  procurement_crop_wise: any = null;
  product_wise: any = null
  procurement_crops: any = [];
  products_list: any = [];

  constructor(private httpService: HttpServiceService, private loadingCtrl: LoadingController, private platform: Platform, private storage: Storage) { }

  ionViewWillEnter() {
    this.platform.ready().then(() => {
      this.storage.get('user_profile').then((user_profile) => {
        this.business_short_name = user_profile['business']['shortname'];
      });
    });
    this.serveStockList();
  }

  async serveStockList() {
    let loading = await this.loadingCtrl.create({
      animated: true,
      spinner: 'lines',
    });
    loading.present();
    let data_dict = {}
    data_dict['filter_type'] = this.selected_radio_value;
    this.httpService.serveStorageProductDetails(data_dict).subscribe((data) => {
      console.log(data);
      if (data.hasOwnProperty('storage')) {
        this.storages = data['storage'];
        this.storage_proc = data['storage_proc'];
        this.storage_product = data['storage_product'];
        console.log(this.storages);
        console.log(this.storage_proc);
        console.log(this.storage_product);
      }
      if (data.hasOwnProperty('products_list')) {
        this.procurement_crop_wise = data['procurement_crop_wise'];
        this.product_wise = data['product_wise'];
        this.procurement_crops = data['procurement_crops'];
        this.products_list = data['products_list'];

        this.procurement_crops.sort();
        this.products_list.sort();

        console.log(this.procurement_crop_wise);
        console.log(this.product_wise);
        console.log(this.procurement_crops);
        console.log(this.products_list);
      }

      loading.dismiss();
    }, (error) => {
      console.error(error);
      loading.dismiss();
    });
  }

  async onSegmentChanged() {
    console.log(this.segment_type);
  }

  onRadioChanged() {
    console.log(this.selected_radio_value);
    this.serveStockList();
  }

  showStorageStock(storage_index: number) {
    this.storages[storage_index]['show_list'] = !this.storages[storage_index]['show_list'];
  }

  showProcurementCrop(procurement_crop_index) {
    this.procurement_crops[procurement_crop_index]['show_list'] = !this.procurement_crops[procurement_crop_index]['show_list'];
  }

  showProducts(product_index) {
    this.products_list[product_index]['show_list'] = !this.products_list[product_index]['show_list'];
  }
}
