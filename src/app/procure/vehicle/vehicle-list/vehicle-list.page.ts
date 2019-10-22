import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';
import { HttpServiceService } from '../../../http-service.service';
import { ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.page.html',
  styleUrls: ['./vehicle-list.page.scss'],
})
export class VehicleListPage implements OnInit {
  vehicle_list: any = [];
  sowing_id: any;
  instance_crop_id: any;
  farmer: any;
  sowing: any;

  constructor(private navCtrl: NavController, private httpService: HttpServiceService, private route: ActivatedRoute, private loadingCtrl: LoadingController, private storage: Storage) {
  }
  
  ngOnInit() {
  }
  
  async ionViewWillEnter() {
    this.storage.get('selected_farmer').then((farmer_data) => {
      console.log(farmer_data);
      this.farmer = farmer_data;
    });
    this.storage.get('selected_sowing').then((sowing_data) => {
      console.log(sowing_data);
      this.sowing = sowing_data;
    });


    let loading = await this.loadingCtrl.create({
      animated: true,
      spinner: 'dots',
    });
    loading.present();

    this.sowing_id = this.route.snapshot.paramMap.get('sowing_id');
    this.instance_crop_id = this.route.snapshot.paramMap.get('instance_crop_id');
    this.httpService.getVehicleList().subscribe((data) => {
      loading.dismiss();
      console.log(data);
      this.vehicle_list = data;
    }, (error) => {
      loading.dismiss();
      console.error(error);
    });
  }

  onAddClicked() {
    this.navCtrl.navigateForward('/register-pickup-trip');
  }

  onVehicleClicked(vehicle) {
    console.log(vehicle);
    this.storage.get('selected_vehicle').then((storage_vehicle) => {
      console.log(storage_vehicle)
      if (storage_vehicle != null) {
        this.storage.remove('selected_vehicle').then(() => {
          this.storage.set('selected_vehicle', vehicle);
          this.navCtrl.navigateForward('/procure-form/' + vehicle.pickup_id + '/' + this.sowing_id + '/' + this.instance_crop_id);
        });
      } else {
        this.storage.set('selected_vehicle', vehicle);
        this.navCtrl.navigateForward('/procure-form/' + vehicle.pickup_id + '/' + this.sowing_id + '/' + this.instance_crop_id);
      }
    });
  }

  onHomeIconClicked() {
    this.navCtrl.navigateBack('auth/app/tabs/tab1');
  }
}
