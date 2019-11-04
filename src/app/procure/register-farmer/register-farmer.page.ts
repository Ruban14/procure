import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpServiceService } from '../../http-service.service';
import { FarmerRegisterValidator } from './farmer-register-validate';
import { ActivatedRoute } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LoadingController, NavController, Platform } from '@ionic/angular';
import { GlobalService } from '../../global.service';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'app-register-farmer',
  templateUrl: './register-farmer.page.html',
  styleUrls: ['./register-farmer.page.scss'],
})
export class RegisterFarmerPage {

  farmer_register_form: FormGroup;
  states: any = [];
  language_list: any;
  districts: any = {};
  taluks: any = {};
  villages: any = {};
  revenue_villages: any = {};
  blocks: any = {};
  action: string = null;
  farmer_id: any = null;
  gps_distance = '';
  latitude: any = null;
  longitude: any = null;
  caste_list: any;
  form_holding_size_list: any;
  timestamp: number;
  changed_unit_values: any = [];
  whatsapp_number: number;
  selected_state: any;
  sorted_district: any = null;

  constructor(
    private formBuilder: FormBuilder, private httpService: HttpServiceService, private activatedRoute: ActivatedRoute,
    private geolocation: Geolocation, private loadingCtrl: LoadingController, private global: GlobalService,
    private navCtrl: NavController, private platform: Platform, private storage: Storage) {
    // Farmer Register Form
    this.farmer_register_form = this.formBuilder.group({
      first_name: [null, Validators.compose([FarmerRegisterValidator.checkFirstName, Validators.required])],
      last_name: [null, Validators.compose([FarmerRegisterValidator.checkLastName, Validators.required])],
      mobile: [null, Validators.compose([FarmerRegisterValidator.checkMobileNumber, Validators.required])],
      alternate_mobile: [null],
      state_id: [null, Validators.compose([Validators.required])],
      district_id: [null, Validators.compose([Validators.required])],
      street: [null],
      village: [null],
      pincode: [null, Validators.compose([FarmerRegisterValidator.checkPincode])],
      language_id: [1, Validators.compose([])],
      latitude: [null],
      longitude: [null],
      timestamp: [null],
    });
    this.serveLatLong();
    this.getStateAndDistricts();
  }


  getStateAndDistricts() {
    this.httpService.getStatesAndDistrticts().subscribe((data) => {
      console.log(data);
      this.districts = data['districts'];
      this.states = data['states'];
    }, (error) => {
      console.log(error);
    });
  }

  onStateChanged(state_id) {
    console.log(state_id);
    this.farmer_register_form.value['district'] = null;
    this.selected_state = state_id;
    this.sorted_district = this.districts[this.selected_state];
  }

  async ionViewWillEnter() {
    this.global.checkGPSPermission();
    this.getStateDistrict();
    this.getLanguages();
  }

  change_whatsapp_number(event) {
    console.log(event);
  }

  async registerFarmer() {
    const loading = await this.loadingCtrl.create({
      animated: true,
      spinner: 'lines-small',
    });
    loading.present();
    const current_position = await this.global.getCurrentPosition();
    const data_dict = {
      'form_data': this.farmer_register_form.value,
      'latitude': current_position.coords['latitude'],
      'longitude': current_position.coords['longitude'],
      'timestamp': current_position['timestamp']
    };
    console.log(data_dict)
    this.httpService.registerFarmer(data_dict).subscribe((data) => {
      this.navCtrl.pop();
      loading.dismiss();
      this.global.displayToast('Farmer Added Successfully!', 'middle', 2000);
      loading.dismiss();
    }, (error) => {
      loading.dismiss();
      console.log(error);
    });
  }



  async getStateDistrict() {
    const loading = await this.loadingCtrl.create({
      animated: true,
      spinner: 'lines-small',
    });
    loading.present();
    this.httpService.getStatesAndDistrticts().subscribe((data) => {
      console.log(data);
      loading.dismiss();
    }, (error) => {
      console.log(error);
      loading.dismiss();
    });
  }


  serveLatLong() {
    this.geolocation.getCurrentPosition().then((gps) => {
      console.log(gps);
      this.latitude = gps.coords.latitude;
      this.longitude = gps.coords.longitude;
    }).catch((error) => {
      this.serveLatLong();
      console.log('Error getting location', error);
    });
  }


  getCurrentLocation() {
    this.geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 5000 }).then((gps) => {
      console.log(gps);
      let previous_latitude = null;
      let previous_longitude = null;
      if (this.farmer_register_form.value.latitude !== null) {
        previous_latitude = this.farmer_register_form.value.latitude;
        previous_longitude = this.farmer_register_form.value.longitude;
      }
      this.farmer_register_form.get('latitude').setValue(gps.coords.latitude);
      this.farmer_register_form.get('longitude').setValue(gps.coords.longitude);
      this.farmer_register_form.get('timestamp').setValue(gps.timestamp);
      // if (previous_latitude !== null) {
      //   this.calculateDistance(previous_latitude, this.farmer_register_form.value.latitude, previous_longitude, this.farmer_register_form.value.longitude);
      // }
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }


  resetFarmerField() {
    this.storage.get('selected_farmer').then((farmer) => {
      this.farmer_register_form.get('first_name').setValue(null);
      this.farmer_register_form.get('last_name').setValue(null);
      this.farmer_register_form.get('mobile').setValue(null);
      this.farmer_register_form.get('alternate_mobile').setValue(1);
      this.farmer_register_form.get('state_id').setValue(null);
      this.farmer_register_form.get('district_id').setValue(null);
      this.farmer_register_form.get('street').setValue(null);
      this.farmer_register_form.get('village').setValue(null);
      this.farmer_register_form.get('pincode').setValue(null);
      this.farmer_register_form.get('language_id').setValue(null);
      this.farmer_register_form.get('latitude').setValue(null);
      this.farmer_register_form.get('longitude').setValue(null);
      this.farmer_register_form.get('timestamp').setValue(null);
    });
  }

  getLanguages() {
    this.httpService.serveLanguages().subscribe((data) => {
      console.log(data);
      this.language_list = data;
      console.log(this.language_list);
    }, (error) => {
      console.error(error);
    });
  }

}
