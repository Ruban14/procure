import { Component } from '@angular/core';
import { ModalController, NavParams, ToastController, LoadingController } from '@ionic/angular';
import { HttpServiceService } from '../../http-service.service';

@Component({
  selector: 'app-processed-product-to-store',
  templateUrl: './processed-product-to-store.page.html',
  styleUrls: ['./processed-product-to-store.page.scss'],
})
export class ProcessedProductToStorePage {
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

  // slides options
  slideOpts = {
    // effect: 'flip',
    allowTouchMove: false
  };
  batch_id: any = null;
  crop_id: any = null;
  processed_products: any[] = [];
  crop_groups: any = null;
  selected_crop_group: any = null;
  selected_processed_product: any = null;
  crop_units: any = null;
  storage_quantity_unit: any[] = []

  constructor(private modalController: ModalController, private httpService: HttpServiceService, private navParms: NavParams,
    private toastCtrl: ToastController, private loadingCtrl: LoadingController) { }


  ionViewWillEnter() {
    this.batch_id = this.navParms.data['value']['batch_id'];
    this.crop_id = this.navParms.data['value']['crop_id'];
    this.processed_products = this.navParms.data['value']['processed_products'];
    console.log(this.batch_id);
    console.log(this.crop_id);
    console.log(this.processed_products);
    if (this.processed_products.length != 0) {
      this.processed_products.forEach(element => {
        this.storage_quantity_unit.push(
          {
            'batch_id': parseInt(this.batch_id),
            'processed_product_id': element['processed_product_id'],
            'processed_product': element['processed_product_name'],
            'quantity': null,
            'unit_id': null,
            'selected_section_id': null,
            'new_lot': false,
            'selected_lot': null,
            'new_lot_value': null
          });
      });
      console.log(this.storage_quantity_unit);
    }
    this.httpService.getStorageSectionAndProcessedProductLot().subscribe((data) => {
      console.log(data);
      this.storage_section_lot = data;
    }, (error) => {
      console.error(error);
    });

    // this.httpService.serveProcessedProductByBusiness().subscribe((data) => {
    //   console.log(data);
    //   this.processed_products = data['processed_product'];
    //   this.crop_groups = data['crop_groups'];
    // }, (error) => {
    //   console.error(error);
    // });

    this.httpService.serveCropUnit({ 'instance_crop_id': this.crop_id }).subscribe((data) => {
      console.log(data);
      this.crop_units = data;
    }, (error) => {
      console.error(error);
    })
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  slideTo(slide_index: number) {
    // this.storage_slider.slideTo(slide_index);
  }

  checkEssential() {
    if (this.selected_storage != null && this.selected_crop_group != null) {
      if (this.selected_processed_product != null && this.selected_processed_product.length != 0) {
        this.slideTo(1)
      } else {
        alert('Select at least One Product!');
      }
    } else {
      alert('Select Storage/ Crop Group!');
    }
  }

  // checkEssential() {
  //   if (this.selected_storage != null && this.selected_section != null) {
  //     if (this.new_lot) {
  //       if (this.new_lot_value != null) {
  //         this.slideTo(1);
  //       } else {
  //         alert('Enter Lot Number');
  //       }
  //     } else {
  //       if (this.selected_lot != null) {
  //         this.slideTo(1);
  //       } else {
  //         alert('Select Lot!')
  //       }
  //     }
  //   } else {
  //     alert('Select Storage/Section!');
  //   }
  // }



  onStoreChange() {
    console.log(this.selected_storage);
    this.storage_quantity_unit.forEach((element) => {
      console.log(element);
      element.selected_section_id = null;
    });
  }

  onSectionChange(processed_product_index) {
    console.log(this.storage_quantity_unit[processed_product_index]);
    this.storage_quantity_unit[processed_product_index]['selected_lot'] = null;
  }

  onLotChange(processed_product_index) {
    console.log(this.storage_quantity_unit[processed_product_index]);
  }

  onCropGroupChange() {
    console.log(this.selected_crop_group);
    this.selected_processed_product = null;
  }

  toStorageClicked() {
    console.log(this.storage_quantity_unit);
    for (let obj of this.storage_quantity_unit) {
      console.log(obj);
      if (obj.quantity == null || obj.quantity == '') {
        alert('Enter Quantity for ' + obj['processed_product']);
        return false;
      }
      if (obj.unit_id == null) {
        alert('Select Unit for ' + obj['processed_product']);
        return false;
      }
      if (obj.selected_section_id == null) {
        alert('Select Storage Section for ' + obj['processed_product']);
        return false;
      }
      if (obj.new_lot) {
        if (obj.new_lot_value == null || obj.new_lot_value == '') {
          alert('Enter Lot Number for ' + obj['processed_product']);
          return false;
        }
      } else {
        if (obj.selected_lot == null) {
          alert('Select Lot Number for ' + obj['processed_product']);
          return false;
        }
      }
    }
    this.httpService.registerProcessedProductToStorage(this.storage_quantity_unit).subscribe((data) => {
      console.log(data);
      this.displayToast('The Product(s) are stored in the respective Storage!');
      this.dismissModal();
    }, (error) => {
      console.error(error);
      this.displayToast('Error while Store the Product');
      this.dismissModal();
    });
  }

  onProcessedProductSelected() {
    console.log(this.selected_processed_product);
    this.storage_quantity_unit = [];
    if (this.selected_processed_product != null) {
      this.selected_processed_product.forEach(element => {
        this.storage_quantity_unit.push(
          {
            'processed_product': element,
            'quantity': null,
            'unit_id': null,
            'selected_section_id': null,
            'new_lot': false,
            'selected_lot': null,
            'new_lot_value': null
          });
      });
    }
    console.log(this.storage_quantity_unit)
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
