import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpServiceService } from '../../http-service.service';
import { ModalController, ToastController, LoadingController, IonSlides, Platform } from '@ionic/angular';
import { AssignProcurementToStoragePage } from '../assign-procurement-to-storage/assign-procurement-to-storage.page';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.page.html',
  styleUrls: ['./vehicles.page.scss'],
})
export class VehiclesPage implements OnInit {

   // slides options
   @ViewChild('slider', {'static' : false}) slides: IonSlides;
   slideOpts = {
     effect: 'flip',
     allowTouchMove: false
   };

  list_of_trucks: any = null;
  pickup_trip: any = null
  collected_procurement_objects: any[] = [];
  collected_quantity: any;
  list_of_storage: any = [];
  storage_wise_data: any;
  business_short_name: string = null;

  processed_product_store_details: any = null;

  constructor(private httpService: HttpServiceService, private modalController: ModalController, private toastCtrl: ToastController,
    private loadingCtrl: LoadingController, private platform: Platform, private storage: Storage) {
    this.getOverAllProcurementVehicleWise();
    this.platform.ready().then(() => {
      this.storage.get('user_profile').then((user_profile) => {
        this.business_short_name = user_profile['business']['shortname'];
      });
    });
  }

  ngOnInit() {
  }

  async getOverAllProcurementVehicleWise() {
    let loading = await this.loadingCtrl.create({
      animated: true,
      spinner: 'lines',
    });
    loading.present();

    this.httpService.getOverallProcurementByVehicle({}).subscribe((data) => {
      console.log(data);
      this.list_of_trucks = data['truck'];
      this.list_of_trucks.forEach(obj => {
        obj.show_list = false;
        obj.truck_checked = false;
      });

      this.list_of_storage = data['storage'];
      this.list_of_storage.forEach(obj => {
        obj.show_list = false;
        obj.storage_checked = false;
      });
    }, (error) => {
      console.log(error);
    });

    this.httpService.getProcurementsByPickupTrip({}).subscribe((data) => {
      console.log(data);
      this.pickup_trip = data['truck'];
      this.storage_wise_data = data['storage'];
      loading.dismiss();
    }, (error) => {
      loading.dismiss();
      console.error(error);
    });

    this.httpService.serveProcessedProcessedStorage().subscribe((data) =>  {
      console.log(data);
      this.processed_product_store_details = data;
    }, (error) => {
      console.error(error);
    });
  }


  showProcurement(truck_index: number) {
    this.list_of_trucks[truck_index]['show_list'] = !this.list_of_trucks[truck_index]['show_list'];
  }

  showStorageStock(storage_index: number) {
    this.list_of_storage[storage_index]['show_list'] = !this.list_of_storage[storage_index]['show_list'];
  }

  showProcessedStoreStock(processed_store_index: number) {
      this.processed_product_store_details['storages'][processed_store_index]['show_list'] = !this.processed_product_store_details['storages'][processed_store_index]['show_list'];
  }

  appendProcurementIds(trip) {
    let index = this.collected_procurement_objects.map((item) => {
      return item.procurement_id
    }).indexOf(trip.procurement_id);
    console.log(index);
    if (index === -1) {
      this.collected_procurement_objects.push(trip);
      this.collected_quantity += trip.quantity;
    } else {
      this.collected_procurement_objects.splice(index, 1)
      this.collected_quantity -= trip.quantity;
    }
  }

  getAllProcurementbyTrip(trip_id, show_list) {
    if (!show_list) {
      console.log(trip_id);
      this.pickup_trip[trip_id].forEach(obj => {
        console.log(obj);
        let index = this.collected_procurement_objects.map((item) => {
          return item.procurement_id
        }).indexOf(obj.procurement_id);
        console.log(index);
        if (index === -1) {
          this.collected_procurement_objects.push(obj);
          this.collected_quantity += obj.quantity;
        } else {
          this.collected_procurement_objects.splice(index, 1);
          this.collected_quantity -= obj.quantity;
        }
      });
      console.log(this.collected_procurement_objects);
    }
  }

  async presentModal() {
    if (this.collected_procurement_objects.length == 0) {
      alert('Select at least one Procurement!');
      return false;
    }
    const modal = await this.modalController.create({
      component: AssignProcurementToStoragePage,
      cssClass: 'inset-modal',
      componentProps: {
        value: this.collected_procurement_objects
      },
    });
    modal.onWillDismiss().then((data) => {
      console.log(data);
      if (data['data'] != null || data['data'] != undefined) {
        console.log(data['data']);
        if (data['data']['is_changed']) {
          this.getOverAllProcurementVehicleWise();
          this.collected_procurement_objects = []
        }
      }
    }).catch((error) => {
      console.error(error)
    });
    return await modal.present();
  }

  async displayToast(message) {
    const toast = await this.toastCtrl.create({
      message: message,
      position: 'top',
      duration: 2000
    });
    toast.present();
  }

  currentStock() {
    this.slideTo(1);
  }

  slideTo(slide_index: number) {
    this.slides.slideTo(slide_index);
  }

}
