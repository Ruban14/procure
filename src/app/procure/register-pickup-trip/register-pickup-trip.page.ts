import { Component, OnInit } from '@angular/core';
import { NavController, ToastController, LoadingController, AlertController } from '@ionic/angular';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpServiceService } from '../../http-service.service';
import * as moment from 'moment';


@Component({
  selector: 'app-register-pickup-trip',
  templateUrl: './register-pickup-trip.page.html',
  styleUrls: ['./register-pickup-trip.page.scss'],
})
export class RegisterPickupTripPage implements OnInit {
  register_pickup: FormGroup;
  vehicles: any;
  current_show_form = '';
  segment_type: any = 'pick-up';

  labour_team_form: FormGroup;
  storage_section_form: FormGroup;
  labour_types: any = null;
  storages_list: any = null;

  constructor(private navCtrl: NavController, private formBuilder: FormBuilder, private httpService: HttpServiceService, private toastCtrl: ToastController,
    private loadingCtrl: LoadingController, private alertController: AlertController) {
    let todate: any = new Date().toISOString();
    this.register_pickup = this.formBuilder.group({
      vehicle_id: [null],
      start_time: [todate]
    });
    
    this.labour_team_form = this.formBuilder.group({
      labour_type_map: [null],
      name: [null],
      incharge_name: [null],
      incharge_phone: [null],
    });

    this.storage_section_form = this.formBuilder.group({
      storage: [null],
      name: [null],
      storage_section: ['New Storage Section']
    });
  }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    let loading = await this.loadingCtrl.create({
      animated: true,
      spinner: 'lines',
    });
    loading.present();
    this.httpService.serveVehicles().subscribe((data) => {
      console.log(data);
      this.vehicles = data;
      loading.dismiss();
    }, (error) => {
      console.error(error);
      loading.dismiss();
    });
  }

  async onSegmentChanged() {
    console.log(this.segment_type);
    if (this.segment_type == 'labour') {
      if (this.labour_types == null) {
        this.getLabourTypeMap();
      }
    }

    if (this.segment_type == 'storage') {
      if (this.storages_list == null) {
        this.getStorageSection();
      }
    }
  }

  onAddClicked() {
    this.navCtrl.navigateForward('/vehicle-register');
  }

  async getLabourTypeMap() {
    let loading = await this.loadingCtrl.create({
      animated: true,
      spinner: 'lines',
    });
    loading.present();
    this.httpService.getLabourTypesMap().subscribe((data) => {
      console.log(data);
      this.labour_types = data;
      loading.dismiss();
    }, (error) => {
      console.error(error);
      loading.dismiss();
    });
  }

  async getStorageSection() {
    let loading = await this.loadingCtrl.create({
      animated: true,
      spinner: 'lines',
    });
    loading.present();
    this.httpService.serveStorageSection().subscribe((data) => {
      console.log(data);
      this.storages_list = data;
      loading.dismiss();
    }, (error) => {
      console.error(error);
      loading.dismiss();
    });
  }

  async onRegisterPickup() {
    let loading = await this.loadingCtrl.create({
      animated: true,
      spinner: 'lines',
    });
    loading.present();
    if (this.register_pickup.value['start_time'].hasOwnProperty('year')) {
      console.log(this.register_pickup.value['start_time']);
      this.register_pickup.get('start_time').setValue(this.register_pickup.value['start_time']['year']['value'] + '-' + this.register_pickup.value['start_time']['month']['value'] + '-' + this.register_pickup.value['start_time']['day']['value'] + ' ' + this.register_pickup.value['start_time']['hour']['value'] + ':' + this.register_pickup.value['start_time']['minute']['value']);
    }
    this.register_pickup.value['start_time'] = moment(this.register_pickup.value['start_time']).format('YYYY-MM-DD HH:mm');
    console.log(this.register_pickup.value);
    this.httpService.registerPickupTrip(this.register_pickup.value).subscribe((data) => {
      console.log(data);
      loading.dismiss();
      this.displayToast('Pick-up Trip registered Successfully!');
      this.navCtrl.pop();
    }, (error) => {
      loading.dismiss();
      console.error(error);
    });
  }

  onRegisterLabourTeam() {
    console.log(this.labour_team_form.value);
    this.httpService.registerNewLabourTeam(this.labour_team_form.value).subscribe((data) => {
      console.log(data);
      this.labour_team_form.reset();
      this.displayToast('New Labour Team Added');
    }, (error) => {
      console.error(error);
      let detailed_error = error.error;
      console.log(detailed_error.message)
      alert(detailed_error.message);
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

  async onLabourTypeAdd() {
    const alert = await this.alertController.create({
      header: 'New Labour Team Type!',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Team Type Name'
        },
        {
          name: 'notes',
          type: 'text',
          placeholder: 'Notes'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            console.log('Confirm Ok');
            console.log(data);
            if (data['notes'] == '') {
              data['notes'] = data['name']
              console.log(data);
            }
            this.httpService.registerNewLabourType(data).subscribe((result) => {
              console.log(result);
              this.getLabourTypeMap();
            }, (error) => {
              console.error(error);
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async onRegisterStorageSection() {
    let loading = await this.loadingCtrl.create({
      animated: true,
      spinner: 'lines',
    });
    loading.present();
    this.httpService.registerStorageAndSection(this.storage_section_form.value).subscribe((data) => {
      console.log(data);
      this.storage_section_form.reset();
      this.displayToast('New Storage Section added');
      loading.dismiss()
    }, (error) => {
      console.error(error);
      loading.dismiss()
    });
  }

  async onAddStorageClicked() {
    const alert = await this.alertController.create({
      header: 'New Storage!',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Storage Name',
          value: null
        },
        {
          name: 'address',
          type: 'text',
          placeholder: 'Storage Address',
          value: null
        },
        {
          name: 'incharge_name',
          type: 'text',
          placeholder: 'Incharge Name',
          value: null
        },
        {
          name: 'incharge_phone',
          type: 'number',
          placeholder: 'Incharge Mobile',
          value: null
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            console.log('Confirm Ok');
            console.log(data);
            if (this.checkAllFieldsForStorage(data)) {
              console.log('Fields are Valid');
              this.httpService.registerStorageAndSection(data).subscribe((data) => {
                console.log(data);
                this.getStorageSection();
              }, (error) => {
                console.error(error);
              });
            } 
          }
        }
      ]
    });
    await alert.present();
  }

  checkAllFieldsForStorage(storage_fields: any) {
    console.log(storage_fields)
    if (storage_fields['name'] == '' || storage_fields['name'] == null) {
      alert('Enter Storage Name');
      return false;
    }
    else if (storage_fields['address'] == '' || storage_fields['address'] == null) {
      alert('Enter Address');
      return false;
    }
    else if (storage_fields['incharge_name'] == '' || storage_fields['incharge_name'] == null) {
      alert('Enter Incharge Name');
      return false;
    }
    else if (storage_fields['incharge_phone'] == '' || storage_fields['incharge_phone'] == null) {
      alert('Enter Incharge Mobile Number');
      return false;
    }
    else {
      return true;
    }
  }
}
