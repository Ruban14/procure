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

  constructor(
    private formBuilder: FormBuilder, private httpService: HttpServiceService, private activatedRoute: ActivatedRoute,
    private geolocation: Geolocation, private loadingCtrl: LoadingController, private global: GlobalService,
    private navCtrl: NavController, private platform: Platform, private storage: Storage) {
    // Farmer Register Form
    this.farmer_register_form = this.formBuilder.group({
      first_name: [null, Validators.compose([FarmerRegisterValidator.checkFirstName])],
      last_name: [null, Validators.compose([FarmerRegisterValidator.checkLastName])],
      phone: [null, Validators.compose([FarmerRegisterValidator.checkMobileNumber, Validators.required])],
      is_whatsapp_number: [null],
      alternate_phone: [null, Validators.compose([FarmerRegisterValidator.checkMobileNumber, Validators.required])],
      landmark: [null],
      city: [null],
      street_address: [null, Validators.required],
      village: [null],
      taluk: [null],
      district: [null, Validators.compose([Validators.required])],
      state: [23, Validators.compose([Validators.required])],
      pincode: [null, Validators.compose([Validators.required, Validators.min(100000)])],
      communication_language: [1, Validators.compose([])],
      latitude: [null, Validators.compose([])],
      longitude: [null, Validators.compose([])],
      timestamp: [null, Validators.compose([])],
    });
    this.serveLatLong();
  }

  async ionViewWillEnter() {
    this.global.checkGPSPermission();
    this.getStateDistrictTaluks();
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
    if (this.farmer_register_form.value.selected_unit === 'ac') {
      let area_in_ha = this.farmer_register_form.value.farm_holding_size_in_hectare / 2.4711;
      this.farmer_register_form.get('farm_holding_size_in_hectare').setValue(area_in_ha);
    }

    if (this.farmer_register_form.value.selected_unit === 'cent') {
      let area_in_ha = this.farmer_register_form.value.farm_holding_size_in_hectare / 249.56521739;
      this.farmer_register_form.get('farm_holding_size_in_hectare').setValue(area_in_ha);
    }
    console.log(this.farmer_register_form.value);
    loading.present();
    console.log(this.farmer_register_form.value);
    const current_position = await this.global.getCurrentPosition();
    const data_dict = {
      'form_data': this.farmer_register_form.value,
      'latitude': current_position.coords['latitude'],
      'longitude': current_position.coords['longitude'],
      'timestamp': current_position['timestamp']
    };
    this.httpService.registerFarmer(data_dict).subscribe((data) => {
      console.log(data);
      // this.platform.ready().then(() => {
      this.storage.get('farmers').then((storage_farmers) => {
        // get all farmer from storage
        const farmers = storage_farmers;
        console.log(data);
        console.log(farmers);
        farmers.unshift(data);
        console.log(farmers);

        // append farmer to storage
        this.storage.set('farmers', farmers);

        // add verification info  
        this.storage.get('farmer_verification_info').then((storage_farmer_verification_info) => {
          const farmer_verification_info = storage_farmer_verification_info;
          farmer_verification_info[data['id']] = {
            'is_all_crop_verified': false,
            'is_all_land_verified': false,
            'is_all_water_resource_verified': false,
          };

          // append faremr verification to storage
          this.storage.set('farmer_verification_info', farmer_verification_info)
        });
      }).catch((error) => {
        console.log('error to get storage farmers');
      });
      // }).catch((error) => {
      //   console.log('Platform does not ready yet');
      // })
      this.navCtrl.pop();
      loading.dismiss();
      this.global.displayToast('Farmer Added Successfully!', 'middle', 2000);
      loading.dismiss();
    }, (error) => {
      loading.dismiss();
      console.log(error);
    });
  }

  FarmerAreaVauleChanged() {
    this.changed_unit_values = [];
    if (this.farmer_register_form.value.selected_unit === 'ha') {
      let changed_acre = this.farmer_register_form.value.farm_holding_size_in_hectare * 2.4711;
      let changed_cent = this.farmer_register_form.value.farm_holding_size_in_hectare * 249.56521739;
      this.changed_unit_values.push(
        { 'name': 'in acre', 'value': changed_acre },
        { 'name': 'in cent', 'value': changed_cent }
      );
    }
    if (this.farmer_register_form.value.selected_unit === 'ac') {
      let changed_ha = this.farmer_register_form.value.farm_holding_size_in_hectare / 2.4711;
      let changed_cent = this.farmer_register_form.value.farm_holding_size_in_hectare * 100;
      this.changed_unit_values.push(
        { 'name': 'in ha', 'value': changed_ha },
        { 'name': 'in cent', 'value': changed_cent }
      );
    }
    if (this.farmer_register_form.value.selected_unit === 'cent') {
      let changed_acre = this.farmer_register_form.value.farm_holding_size_in_hectare / 100;
      let changed_ha = this.farmer_register_form.value.farm_holding_size_in_hectare / 249.56521739;
      this.changed_unit_values.push(
        { 'name': 'in acre', 'value': changed_acre },
        { 'name': 'in ha', 'value': changed_ha }
      );
    }
  }

  unitValueChanged() {
    this.changed_unit_values = [];
    this.FarmerAreaVauleChanged();
  }

  async getStateDistrictTaluks() {
    const loading = await this.loadingCtrl.create({
      animated: true,
      spinner: 'lines-small',
    });
    loading.present();
    this.platform.ready().then(() => {
      this.storage.get('state_district_taluk').then((state_district_taluk) => {
        console.log(state_district_taluk);
        this.states = state_district_taluk['states'];
        this.districts = state_district_taluk['districts'];
        this.taluks = state_district_taluk['taluks'];
        this.villages = state_district_taluk['villages'];
        this.revenue_villages = state_district_taluk['revenue_village'];
        this.blocks = state_district_taluk['block'];
        loading.dismiss();
      }).catch(() => {
        loading.dismiss();
      })
      this.storage.get('caste_cv').then((data) => {
        console.log(data)
        this.caste_list = data;
      });
      this.storage.get('farm_holding_size_classification').then((holding_size) => {
        this.form_holding_size_list = holding_size;
        console.log(this.form_holding_size_list);
      });
    }).catch(() => {
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


  calculateDistance(lat1: number, lat2: number, long1: number, long2: number) {
    console.log(lat1);
    console.log(lat2);
    console.log(long1);
    console.log(long2);
    const p = 0.017453292519943295;    // Math.PI / 180
    const c = Math.cos;
    const a = 0.5 - c((lat1 - lat2) * p) / 2 + c(lat2 * p) * c((lat1) * p) * (1 - c(((long1 - long2) * p))) / 2;
    const dis = (12742 * Math.asin(Math.sqrt(a))); // 2 * R; R = 6371 km
    if (dis < .5) {
      this.gps_distance = `${String(dis / 1000)} m distance from previous location`;
    } else {
      this.gps_distance = `${String(dis)} Km distance from previous location`;
    }
    console.log(dis);
  }

  resetFarmerField() {
    this.storage.get('selected_farmer').then((farmer) => {
      this.farmer_register_form.get('first_name').setValue(null);
      this.farmer_register_form.get('last_name').setValue(null);
      this.farmer_register_form.get('village').setValue(null);
      this.farmer_register_form.get('pincode').setValue(null);
      this.farmer_register_form.get('farm_holding_size_in_hectare').setValue(null);
      this.farmer_register_form.get('family_card_number').setValue(null);
      this.farmer_register_form.get('aadhaar_number').setValue(null);
      this.farmer_register_form.get('pan_number').setValue(null);
      this.farmer_register_form.get('state').setValue(1);
      this.farmer_register_form.get('district').setValue(null);
      this.farmer_register_form.get('block').setValue(null);
      this.farmer_register_form.get('revenue_village').setValue(null);
      this.farmer_register_form.get('street').setValue(null);
      this.farmer_register_form.get('email').setValue(null);
      this.farmer_register_form.get('phone').setValue(null);
      this.farmer_register_form.get('communication_language').setValue(null);
      this.farmer_register_form.get('password').setValue(null);
      this.farmer_register_form.get('latitude').setValue(null);
      this.farmer_register_form.get('longitude').setValue(null);
      this.farmer_register_form.get('farm_holding_size_classification').setValue(null);
    });
  }


  getLanguages() {
    this.httpService.serveLanguages().subscribe((data) => {
      console.log(data);
      this.language_list = data;
    }, (error) => {
      console.error(error);
    });
  }

  async watchPincode() {
    console.log(this.farmer_register_form.value.pincode);
    console.log(this.farmer_register_form.value.pincode.toString().length);
    if (this.farmer_register_form.value.pincode.toString().length === 6) {
      const data = { 'pincode': this.farmer_register_form.value.pincode };

      const loading = await this.loadingCtrl.create({
        animated: true,
        message: 'Gathering Pincode Details...',
        spinner: 'lines-small',
      });
      loading.present();

      this.httpService.getPincodeDetails(data).subscribe((pincode_details) => {
        console.log(pincode_details);
        this.farmer_register_form.get('district').setValue(pincode_details['district']);
        this.farmer_register_form.get('block').setValue(pincode_details['block']);
        this.farmer_register_form.get('revenue_village').setValue(pincode_details['revenue_village']);

        loading.dismiss();

      }, (error) => {
        loading.dismiss();
        console.log(error);
      });
    } else if (this.farmer_register_form.value.pincode.toString().length > 6) {
      alert('Pincode should be 6 digit only!');
    }
  }
}
 