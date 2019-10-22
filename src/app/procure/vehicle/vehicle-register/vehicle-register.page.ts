import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpServiceService } from '../../../http-service.service';
import { NavController, LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-vehicle-register',
  templateUrl: './vehicle-register.page.html',
  styleUrls: ['./vehicle-register.page.scss'],
})
export class VehicleRegisterPage implements OnInit {
  register_vehicle: FormGroup;
  vehicle_types: any;

  constructor(private formBuilder: FormBuilder, private httpService: HttpServiceService, private navCtrl: NavController, private loadingCtrl: LoadingController,
    private toastCtrl: ToastController) {
    this.register_vehicle = this.formBuilder.group({
      license: [null],
      type: [null],
      contact_person: [null],
      contact_phone: [null],
    });
  }

  async ionViewWillEnter() {
    let loading = await this.loadingCtrl.create({
      animated: true,
      spinner: 'dots',
    });
    loading.present();
    this.httpService.getVehicleTypes().subscribe((data) => {
      console.log(data);
      loading.dismiss();
      this.vehicle_types = data;
    }, (error) => {
      loading.dismiss();
      console.error(error);
    });
  }

  ngOnInit() {
  }

  async onRegisterVehicle() {
    let loading = await this.loadingCtrl.create({
      animated: true,
      spinner: 'lines',
      message: 'Please wait...'
    });
    loading.present();
    console.log(this.register_vehicle.value);
    this.httpService.registerVehicle(this.register_vehicle.value).subscribe((data) => {
      console.log(data);
      this.displayToast('Vehicle Registered!');
      loading.dismiss();
      this.navCtrl.pop();
    }, (error) => {
      loading.dismiss();
      console.error(error);
    });
  }

  async displayToast(message) {
    const toast = await this.toastCtrl.create({
      message: message,
      position: 'top',
      duration: 3000
    });
    toast.present();
  }
}
