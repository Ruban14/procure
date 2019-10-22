import { Component, OnInit } from '@angular/core';
import { HttpServiceService } from '../../http-service.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Storage } from '@ionic/storage';
import { ToastController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-supporting-business',
  templateUrl: './supporting-business.page.html',
  styleUrls: ['./supporting-business.page.scss'],
})
export class SupportingBusinessPage implements OnInit {
  supporting_business_types: any;
  supporting_business_type_ids: any;
  supporting_business_form: FormGroup;

  constructor(private httpService: HttpServiceService, private formBuilder: FormBuilder, private geolocation: Geolocation, private camera: Camera,
    private storage: Storage, private toastCtrl: ToastController, private navCtrl: NavController) {
    this.httpService.serveSupportingBusinessTypes().subscribe((data) => {
      console.log(data);
      this.supporting_business_types = data;
      this.supporting_business_type_ids = Object.keys(data);
    }, (error) => {
      console.error(error);
    });

    this.supporting_business_form = this.formBuilder.group({
      business:[null],
      business_type:[null],
      consultant:[null],
      name_of_business:[null],
      name_of_person:[null],
      address:[null],
      taluk:[null],
      district:[null],
      latitude:[null],
      longitude:[null],
      phone:[null],
      mobile:[null],
      alt_mobile: [null],
      from_k2: ['from kultivate 2.0'],
      photo_of_address: [null],
      photo_of_person: [null],
      photo_of_shop: [null]
    });

    this.storage.get('user_profile').then((user_profile) => {
      console.log(user_profile);
      this.supporting_business_form.get('business').setValue(user_profile['business']['name'])
      console.log(this.supporting_business_form.value);
    });
  }

  ngOnInit() {
  }

  onRegisterSupportingBusiness() {
    console.log(this.supporting_business_form.value);
    if (this.supporting_business_form.value['photo_of_address'] == null) {
      delete this.supporting_business_form.value['photo_of_address']
    }
    if (this.supporting_business_form.value['photo_of_person'] == null) {
      delete this.supporting_business_form.value['photo_of_person']
    }
    if (this.supporting_business_form.value['photo_of_shop'] == null) {
      delete this.supporting_business_form.value['photo_of_shop']
    }
    console.log(this.supporting_business_form.value)
    this.httpService.registerSupportingBusiness({static_form_data:this.supporting_business_form.value}).subscribe((data) => {
      console.log(data);
      this.displayToast('Supporting Business added successfully!');
      this.navCtrl.navigateBack('/auth/app/tabs/(home:home)');
    }, (error) => {
      console.error(error);
    });
  }

  getPosition() {
    this.geolocation.getCurrentPosition().then((resp) => {
      // resp.coords.latitude
      // resp.coords.longitude
      console.log(resp);
      this.supporting_business_form.get('latitude').setValue(resp.coords.latitude);
      this.supporting_business_form.get('longitude').setValue(resp.coords.longitude);
    }).catch((error) => {
      console.log('Error getting location', error);
    });

    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      // data can be a set of coordinates, or an error (if an error occurred).
      // data.coords.latitude
      // data.coords.longitude
    });
  }

  getCameraImage(field_value: any, display_name: any) {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };
    
    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64 (DATA_URL):
     this.supporting_business_form.get(field_value).setValue('data:image/jpeg;base64,' + imageData);
     this.displayToast(display_name + ' image captured!');
    }, (err) => {
     // Handle error
    });
  }

  async displayToast(message) {
    const toast = await this.toastCtrl.create({
      message: message,
      position: 'middle',
      duration: 3000
    });
    toast.present();
  }
}
