import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpServiceService } from '../../http-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController, LoadingController, NavController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-procure-form',
  templateUrl: './procure-form.page.html',
  styleUrls: ['./procure-form.page.scss'],
})
export class ProcureFormPage {
  unit_ids: any;
  channel_ids: any;
  grad_ids: any;
  all_cvs: any;
  procure_form: FormGroup;
  procure_form_array = [];
  is_form_value_update: boolean = false;
  form_update_entry_index: number = null;
  sowing_id;
  buying_officer = 234;
  pickup_trip_id: any;
  instance_crop_id: any;
  farmer: any = null;
  sowing: any = null;
  vehicle: any = null;
  business_short_name: string = null;

  constructor(private route: ActivatedRoute, private httpService: HttpServiceService, private formBuilder: FormBuilder, private toastCtrl: ToastController,
    private loadingCtrl: LoadingController, private navCtrl: NavController, private storage: Storage, private platform: Platform) {
    this.sowing_id = this.route.snapshot.paramMap.get('sowing_id');
    this.pickup_trip_id = this.route.snapshot.paramMap.get('pickup_trip_id');
    this.instance_crop_id = this.route.snapshot.paramMap.get('instance_crop_id');
    const data = { sowing_id: this.sowing_id, instance_crop_id: this.instance_crop_id };
    this.getProcurementCv(data);

    this.procure_form = this.formBuilder.group({
      quantity: [null, Validators.required],
      unit: [null, Validators.required],
      unit_price: [null, Validators.required],
      grade: [null, Validators.required],
      channel: [null, Validators.required],
      date_of_procurement: [new Date().toISOString().split('T')[0], Validators.required],
      date_of_harvest: [new Date().toISOString().split('T')[0], Validators.required],
      sowing: [this.sowing_id, Validators.required],
      notes: [null],
      pickup_trip: [this.pickup_trip_id]
    });
    // this.procure_form = formBuilder.group({
    //   quantity: [null, Validators.required],
    //   unit: [null, Validators.required],
    //   unit_price: [null, Validators.required],
    //   grade: [null, Validators.required],
    //   channel: [null, Validators.required],
    //   date_of_procurement: [new Date(), Validators.required],
    //   date_of_harvest: ['', Validators.required]
    // });
  }

  ionViewWillEnter() {
    this.platform.ready().then(() => {

    this.storage.get('selected_farmer').then((farmer_data) => {
      console.log(farmer_data);
      this.farmer = farmer_data;
    });
    this.storage.get('selected_sowing').then((sowing_data) => {
      console.log(sowing_data);
      this.sowing = sowing_data;
    });

    this.storage.get('selected_vehicle').then((vehicle_data) => {
      console.log(vehicle_data);
      this.vehicle = vehicle_data;
    });

    this.storage.get('user_profile').then((userprofile) => {
      console.log(userprofile);
      this.business_short_name = userprofile['business']['shortname']
    });
  });
  
}

  async getProcurementCv(sowing_data) {
    let loading = await this.loadingCtrl.create({
      animated: true,
      spinner: 'dots',
    });
    loading.present();
    this.httpService.gerProcurementEssentials(sowing_data).subscribe((data) => {
      console.log('success');
      console.log(data);
      loading.dismiss();
      this.unit_ids = Object.keys(data['units']);
      this.channel_ids = Object.keys(data['channels']);
      this.grad_ids = Object.keys(data['grades']);
      this.all_cvs = data;
      this.unit_ids = this.unit_ids.map(Number);
      this.channel_ids = this.channel_ids.map(Number)
      this.grad_ids = this.grad_ids.map(Number)
    }, (error) => {
      console.log(error);
      loading.dismiss();
    });
  }
  
  deleteProcurementEntry(procurement_index: number) {
    console.log(procurement_index);
    this.procure_form_array.splice(procurement_index, 1);
  }

  logForm() {
    console.log('form logged');
    console.log(this.procure_form.value);
    if (this.is_form_value_update) {
      console.log('it is a update function');
      this.procure_form_array[this.form_update_entry_index] = this.procure_form.value;
      this.is_form_value_update = false;
      this.form_update_entry_index = null;
      this.resetProcurementForm();
    } else {
      this.procure_form_array.push(this.procure_form.value);
      this.resetProcurementForm();
    }
  }

  resetProcurementForm() {
    this.procure_form.reset();
    this.procure_form.controls['date_of_procurement'].setValue(new Date().toISOString().split('T')[0]);
    this.procure_form.controls['date_of_harvest'].setValue(new Date().toISOString().split('T')[0]);
    this.procure_form.controls['sowing'].setValue(this.sowing_id);
    this.procure_form.controls['pickup_trip'].setValue(this.pickup_trip_id);
  }

  editProcurementEntry(procurement_form_index: number) {
    this.is_form_value_update = true;
    this.form_update_entry_index = procurement_form_index;
    for (const key in this.procure_form.value) {
      console.log(key);
      this.procure_form.controls[key].setValue(this.procure_form_array[procurement_form_index][key]);
    }
    console.log(this.procure_form.value);
  }

  async uploadProcurements() {
    if (confirm('Are you sure?')) {
      console.log('procurementUploads');
      let loading = await this.loadingCtrl.create({
        animated: true,
        spinner: 'lines',
      });
      loading.present();
      this.httpService.uploadProcurements(this.procure_form_array).subscribe((data) => {
        console.log(data);
        this.displayToast('Procurement Uploaded Successfully!');
        this.procure_form_array = [];
        loading.dismiss();
      }, (error) => {
        console.log(error);
        loading.dismiss();
        alert('Please Check the Internet connection...');
      });
    } else {
      console.log('Please confirm');
    }
  }

  async displayToast(message) {
    const toast = await this.toastCtrl.create({
      message: message,
      showCloseButton: true,
      position: 'middle',
      closeButtonText: 'Done',
      duration: 2000
    });
    toast.present();
  }

  onHomeIconClicked() {
    this.navCtrl.navigateBack('auth/app/tabs/tab1');
  }
}