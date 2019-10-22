import { Component, OnInit, ViewChild, NgModule } from '@angular/core';
import { ModalController, NavParams, ToastController, LoadingController, IonSlides } from '@ionic/angular';
import { HttpServiceService } from '../../http-service.service';

@Component({
  selector: 'app-assign-procurement-to-storage',
  templateUrl: './assign-procurement-to-storage.page.html',
  styleUrls: ['./assign-procurement-to-storage.page.scss'],
})
export class AssignProcurementToStoragePage implements OnInit {

  // slides options
  @ViewChild('slider', {'static' : false}) slides: IonSlides;
  slideOpts = {
    effect: 'flip',
    allowTouchMove: false
  };

  storage_section_lot: any = null;
  selected_storage: any = null;
  selected_section: any = null;
  selected_lot: any = null;
  new_lot: boolean = false;
  new_lot_value: any = null;

  // select options
  customAlertOptions: any = {
    message: 'Select Storage',
    translucent: true
  };


  
  procurement_list: any = [];
  quantity_by_unit: any = {};
  quantity_keys: any;

  constructor(private modalController: ModalController, private httpService: HttpServiceService, private navParms: NavParams,
    private toastCtrl: ToastController, private loadingCtrl: LoadingController) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.procurement_list = this.navParms.data['value'];
    console.log(this.procurement_list);
    this.procurement_list.forEach((element) => {
      let string_unit_name = String(element.unit) + 's';
      if (string_unit_name in this.quantity_by_unit) {
        this.quantity_by_unit[string_unit_name] += element.quantity        
      } else {
        console.log('in If condition for ', string_unit_name);
        this.quantity_by_unit[string_unit_name] = 0
        this.quantity_by_unit[string_unit_name] += element.quantity
      }
    });
    this.quantity_keys = Object.keys(this.quantity_by_unit);
    console.log(this.quantity_by_unit);
    console.log(this.quantity_keys);
    this.httpService.getStorageSectionAndLot().subscribe((data) => {
      console.log(data);
      this.storage_section_lot = data;
    }, (error) => {
      console.error(error);
    });
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  slideTo(slide_index: number) {
    console.log(slide_index);
    this.slides.slideTo(slide_index);
  }

  checkEssential() {
    if (this.selected_storage != null && this.selected_section != null) {
      if (this.new_lot) {
        if (this.new_lot_value != null) {
          this.slideTo(1);
        } else {
          alert('Enter Lot Number');
        }
      } else {
        if (this.selected_lot != null) {
          this.slideTo(1);
        } else {
          alert('Select Lot!')
        }
      }
    } else {
      alert('Select Storage/Section!');
    }
  }

  onCloseClicked(procurement: any) {
    if (confirm('Are you sure want to Remove?')) {
      console.log(procurement);
      let index = this.procurement_list.map((item) => {
        return item.procurement_id
      }).indexOf(procurement.procurement_id);
      console.log(index);
      let string_unit_name = String(procurement.unit) + 's';
      this.quantity_by_unit[string_unit_name] -= procurement.quantity;
      this.procurement_list.splice(index, 1);
    }
  }

  async toStorageClicked() {
    if (this.procurement_list.length == 0) {
      alert('Select at least one Procurement');
      return false;
    }
    let final_dict = {};
    final_dict['storage_id'] = this.selected_storage['id'];
    final_dict['section_id'] = this.selected_section['id'];
    final_dict['is_new_lot'] = this.new_lot;
    if (this.new_lot) {
      final_dict['new_lot_number'] = this.new_lot_value;
    } else {
      final_dict['lot_id'] = this.selected_lot['id'];
    }
    final_dict['procurements'] = this.procurement_list;
    console.log(final_dict);
    let loading = await this.loadingCtrl.create({
      animated: true,
      spinner: 'lines',
    });
    loading.present();
    let success_dict = {}
    this.httpService.saveProcurementToStorage(final_dict).subscribe((data) => {
      console.log(data);
      success_dict['is_changed'] = true;
      this.modalController.dismiss(success_dict);
      this.displayToast('Assigned to Storage!');
      loading.dismiss()
    }, (error) => {
      console.error(error);
      loading.dismiss()
      success_dict['is_changed'] = false;
      this.modalController.dismiss(success_dict);
      this.displayToast('Error while assigning!');
    });
  }

  onStoreChange() {
    console.log(this.selected_storage);
    this.selected_section = null;
  }

  onSectionChange() {
    console.log(this.selected_section);
    this.selected_lot = null;
  }

  onLotChange() {
    console.log(this.selected_lot);
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
