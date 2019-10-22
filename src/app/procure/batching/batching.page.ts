import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpServiceService } from '../../http-service.service';
import { AlertController, IonSlides, LoadingController, ToastController, NavController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-batching',
  templateUrl: './batching.page.html',
  styleUrls: ['./batching.page.scss'],
})

export class BatchingPage implements OnInit {
    // slides options
    @ViewChild('slider', {'static' : false}) slides: IonSlides;
    slideOpts = {
      effect: 'flip',
      allowTouchMove: false
    };
  pickup_trip: any = null;
  list_of_trucks: any = [];
  edit_quantity: any[][] = [[], []];
  edit_quantity_storage: any[][] = [[], []];
  selected_index = null;
  collected_procurement_objects: any[] = [];
  batch_incharge: any;
  batch_product_cvs: any;
  collected_quantity: number = 0;
  batch_product_id: any = null;
  batch_incharge_id: any = null;
  notes: any = '';
  collected_grades: any[] = [];
  selected_crop_id: any = null;
  crops: any = [];
  grades_and_channels: any;
  selected_grades: any = [];
  selected_channels: any = [];
  list_of_storage: any = [];
  storage_wise_data: any;
  business_short_name: string = null;

  constructor(private httpService: HttpServiceService, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private toastCtrl: ToastController,
              private navCtrl: NavController, private platform: Platform, private storage: Storage) {
    this.platform.ready().then(() => {
      this.storage.get('user_profile').then((user_profile) => {
        console.log(user_profile);
        this.business_short_name = user_profile['business']['shortname'];
      });
    });
  }

  ngOnInit() {
    // this.slider.stopAutoplay();
  }

  ionViewWillEnter() {
    this.httpService.getBatchProductCVS().subscribe((data) => {
      console.log(data);
      this.batch_product_cvs = data;
    }, (error) => {
      console.error(error);
    });

    this.httpService.getBatchIncharge().subscribe((data) => {
      console.log(data);
      this.batch_incharge = data;
    }, (error) => {
      console.error(error);
    });

    this.httpService.getBusinessCrop().subscribe((data) => {
      console.log(data);
      this.crops = data;
    }, (error) => {
      console.error(error);
    });

    this.httpService.getGradeAndChannelForCrop().subscribe((data) => {
      console.log(data);
      this.grades_and_channels = data;
    }, (error) => {
      console.error(error);
    });
  }

  slideTo(slide_index: number) {
    this.slides.slideTo(slide_index);
  }

  showProcurement(truck_index: number) {
    this.list_of_trucks[truck_index]['show_list'] = !this.list_of_trucks[truck_index]['show_list'];
  }

  showStorageStock(storage_index: number) {
    this.list_of_storage[storage_index]['show_list'] = !this.list_of_storage[storage_index]['show_list'];
  }

  async gradeAlert(added_grade, adding_grade) {
    const alert = await this.alertCtrl.create({
      header: 'Alert',
      subHeader: 'You trying to ADD two different Grades',
      message: 'Selected Grade is ' + added_grade + ', and you trying to add ' + adding_grade,
      buttons: ['OK']
    });

    await alert.present();
  }

  onGradeSelected(grade) {
    console.log(grade);
    if (this.selected_grades.includes(grade)) {
      this.arraySplice(this.selected_grades, grade);
    } else {
      this.selected_grades.push(grade);
    }
    console.log(this.selected_grades);
  }

  onChannelSelected(channel) {
    console.log(channel);
    if (this.selected_channels.includes(channel)) {
      this.arraySplice(this.selected_channels, channel);
    } else {
      this.selected_channels.push(channel);
    }
    console.log(this.selected_channels);
  }

  arraySplice(selected_list: Array<any>, args) {
    let index = selected_list.indexOf(args);
    selected_list.splice(index, 1);
  }

  async onArrowClicked() {
    if (this.batch_product_id == null) {
      alert('Select the End Product!');
      return false;
    }

    if (this.batch_incharge_id == null) {
      alert('Select the Batch Incharge!');
      return false;
    }

    if (this.selected_grades.length === 0) {
      alert('Select at Least One Grade!');
      return false;
    }

    let loading = await this.loadingCtrl.create({
      animated: true,
      message: 'Please wait... We are Collecting all the Trucks containing this Grade/Channel',
      spinner: 'lines',
    });
    loading.present();
    let request_data_dict = {
      crop_id: this.selected_crop_id,
      grades: this.selected_grades,
      channels: this.selected_channels
    };

    console.log(request_data_dict);

    this.httpService.getOverallProcurementByVehicle(request_data_dict).subscribe((data) => {
      console.log(data);
      this.list_of_trucks = data['truck'];
      // this.list_of_trucks.forEach(obj => {
      //   obj.show_list = false;
      //   obj.truck_checked = false;
      // });

      this.list_of_storage = data['storage'];
      // this.list_of_storage.forEach(obj => {
      //   obj.show_list = false;
      //   obj.storage_checked = false;
      // });

      this.slideTo(1);
      loading.dismiss();
    }, (error) => {
      loading.dismiss();
      console.error(error);
    });

    this.httpService.getProcurementsByPickupTrip(request_data_dict).subscribe((data) => {
      console.log(data);
      this.pickup_trip = data['truck'];
      this.storage_wise_data = data['storage'];

      loading.dismiss();
      this.editIconInitial();
    }, (error) => {
      loading.dismiss();
      console.error(error);
    });
  }

  editIconInitial() {
    // add initially one key, value in second level two timensional array for editing the quantity
    this.list_of_trucks.forEach((obj, truck_index) => {
      if (this.pickup_trip[obj.pickup_trip_id] !== undefined) {
        this.edit_quantity[truck_index] = [];
        this.pickup_trip[obj.pickup_trip_id].forEach((element, procurement_index) => {
          this.edit_quantity[truck_index][procurement_index] = {edit: false, quantity: element.quantity};
        });
      }
    });
    this.list_of_storage.forEach((obj, storage_index) => {
      if (this.storage_wise_data[obj.storage_section_id] !== undefined) {
        this.edit_quantity_storage[storage_index] = [];
        this.storage_wise_data[obj.storage_section_id].forEach((element, procurement_index) => {
          this.edit_quantity_storage[storage_index][procurement_index] = {edit: false, quantity: element.quantity};
        });
      }
    });
    console.log(this.edit_quantity);
    console.log(this.edit_quantity_storage);
  }

  appendProcurementIds(procurement_id, quantity, instance_crop_id, grade) {
    let batching_obj = {};
    batching_obj['procurement_id'] = procurement_id;
    batching_obj['quantity'] = quantity;
    batching_obj['instance_crop_id'] = instance_crop_id;
    console.log(batching_obj);

    if (this.collected_grades.length === 0) {
      this.collected_grades.push(grade);
    } else {
      if (!this.collected_grades.includes(grade)) {
        this.gradeAlert(this.collected_grades[0], grade);
      }
    }

    let index = this.collected_procurement_objects.map((item) => {
      return item.procurement_id;
    }).indexOf(procurement_id);
    console.log(index);
    if (index === -1) {
      this.collected_procurement_objects.push(batching_obj);
      this.collected_quantity += quantity;
    } else {
      this.collected_procurement_objects.splice(index, 1);
      this.collected_quantity -= quantity;
    }
  }

  getAllProcurementbyTrip(trip_id, show_list) {
    if (!show_list) {
      console.log(trip_id);
      this.pickup_trip[trip_id].forEach(obj => {
        console.log(obj);
        let batching_obj = {};
        batching_obj['procurement_id'] = obj.procurement_id;
        batching_obj['quantity'] = obj.quantity;
        batching_obj['instance_crop_id'] = obj.instance_crop;
        console.log(batching_obj);
        let index = this.collected_procurement_objects.map((item) => {
          return item.procurement_id;
        }).indexOf(obj.procurement_id);
        console.log(index);
        if (index === -1) {
          this.collected_procurement_objects.push(batching_obj);
          this.collected_quantity += obj.quantity;
        } else {
          this.collected_procurement_objects.splice(index, 1);
          this.collected_quantity -= obj.quantity;
        }
      });
      console.log(this.collected_procurement_objects);
    }
  }

  getAllProcurementbyStorage(storage_section_id, show_list) {
    if (!show_list) {
      console.log(storage_section_id);
      this.storage_wise_data[storage_section_id].forEach(obj => {
        console.log(obj);
        let batching_obj = {};
        batching_obj['procurement_id'] = obj.procurement_id;
        batching_obj['quantity'] = obj.quantity;
        batching_obj['instance_crop_id'] = obj.instance_crop;
        console.log(batching_obj);
        let index = this.collected_procurement_objects.map((item) => {
          return item.procurement_id;
        }).indexOf(obj.procurement_id);
        console.log(index);
        if (index === -1) {
          this.collected_procurement_objects.push(batching_obj);
          this.collected_quantity += obj.quantity;
        } else {
          this.collected_procurement_objects.splice(index, 1);
          this.collected_quantity -= obj.quantity;
        }
      });
      console.log(this.collected_procurement_objects);
    }
  }

  async onBatchInitiated() {
    if (this.collected_procurement_objects.length === 0) {
      alert('Select at least one Procurement!');
      return false;
    }
    let loading = await this.loadingCtrl.create({
      animated: true,
      spinner: 'lines',
    });
    loading.present();

    let final_batching_obj = {};
    final_batching_obj['batch'] = {};
    final_batching_obj['batch']['quantity_in_kg'] = this.collected_quantity;
    final_batching_obj['batch']['product_id'] = this.batch_product_id;
    final_batching_obj['batch']['incharge_id'] = this.batch_incharge_id;
    final_batching_obj['batch']['crop_id'] = this.selected_crop_id;
    final_batching_obj['batch']['notes'] = this.notes;
    final_batching_obj['procurements'] = this.collected_procurement_objects;
    console.log(final_batching_obj);

    this.httpService.createBatch(final_batching_obj).subscribe((data) => {
      console.log(data);
      loading.dismiss();
      this.displayToast('Batch Created!');
      this.batch_product_id = null;
      this.batch_incharge_id = null;
      this.selected_crop_id = null;
      this.navCtrl.pop();
    }, (error) => {
      loading.dismiss();
      console.error(error);
    });
  }

  slideBack() {
    this.collected_quantity = 0;
    this.collected_procurement_objects = [];
    this.slideTo(0);
  }

  onEditClicked(truck_index, procurement_index, quantity) {
    this.edit_quantity[truck_index][procurement_index]['edit'] = true;
    console.log(quantity);
  }

  onStorageEditClicked(storage_index, procurement_index, quantity) {
    this.edit_quantity_storage[storage_index][procurement_index]['edit'] = true;
    console.log(quantity);
  }

  onValueUpdate(truck_index, procurement_index, quantity, original_quantity, procurement_id, instance_crop_id) {
    quantity = parseFloat(quantity);
    original_quantity = parseFloat(original_quantity);
    console.log(quantity);
    console.log(original_quantity);
    if (quantity > original_quantity) {
      alert('Entered Quantity is more then Original Quantity');
      this.edit_quantity[truck_index][procurement_index]['quantity'] = original_quantity;
      return false;
    }
    this.edit_quantity[truck_index][procurement_index]['edit'] = false;
    this.collected_quantity -= original_quantity;
    this.collected_quantity += quantity;
    let index = this.collected_procurement_objects.map((obj) => {
      return obj.procurement_id;
    }).indexOf(procurement_id);
    if (index !== -1) {
      this.collected_procurement_objects.splice(index, 1);
    }
    let batching_obj = {};
    batching_obj['procurement_id'] = procurement_id;
    batching_obj['quantity'] = quantity;
    batching_obj['instance_crop_id'] = instance_crop_id;
    console.log(batching_obj);
    this.collected_procurement_objects.push(batching_obj);
  }

  onStorageValueUpdate(storage_index, procurement_index, quantity, original_quantity, procurement_id, instance_crop_id, storage_lot_id, proc_storage_lot_id, unit_id) {
    quantity = parseFloat(quantity);
    original_quantity = parseFloat(original_quantity);
    console.log(quantity);
    console.log(original_quantity);
    if (quantity > original_quantity) {
      alert('Entered Quantity is more then Original Quantity');
      this.edit_quantity_storage[storage_index][procurement_index]['quantity'] = original_quantity;
      return false;
    }
    this.edit_quantity_storage[storage_index][procurement_index]['edit'] = false;
    this.collected_quantity -= original_quantity;
    this.collected_quantity += quantity;
    let index = this.collected_procurement_objects.map((obj) => {
      return obj.procurement_id;
    }).indexOf(procurement_id);
    console.log(index);
    if (index !== -1) {
      this.collected_procurement_objects.splice(index, 1);
    }
    let batching_obj = {};
    batching_obj['procurement_id'] = procurement_id;
    batching_obj['quantity'] = quantity;
    batching_obj['instance_crop_id'] = instance_crop_id;
    batching_obj['storage_lot_id'] = storage_lot_id;
    batching_obj['proc_storage_lot_id'] = proc_storage_lot_id;
    batching_obj['unit_id'] = unit_id;
    console.log(batching_obj);
    this.collected_procurement_objects.push(batching_obj);
  }

  async displayToast(message) {
    const toast = await this.toastCtrl.create({
      message: message,
      position: 'top',
      duration: 2000
    });
    toast.present();
  }
}
