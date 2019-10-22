import { Component } from '@angular/core';
import { HttpServiceService } from '../../http-service.service';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-harvest',
  templateUrl: './harvest.page.html',
  styleUrls: ['./harvest.page.scss'],
})
export class HarvestPage {
  harvest_form: FormGroup;
  units: any = [];
  constructor(private httpService: HttpServiceService, private navParams: NavParams, private formBuilder: FormBuilder,
              private modalCtrl: ModalController, private toastCtrl: ToastController) {
    console.log(this.navParams.data);
    this.harvest_form = this.formBuilder.group({
      sowing_id: [this.navParams.data['sowing_id'], Validators.compose([Validators.required])],
      date_of_harvest: [null, Validators.compose([Validators.required])],
      value: [null, Validators.compose([Validators.required])],
      unit: [null, Validators.compose([Validators.required])],
      device_datacapture_datetime: [new Date()],
    });
    this.getHarvestUnits(this.navParams.data['sowing_id']);
  }

  getHarvestUnits(sowing_id: number) {
    this.httpService.getHarvestUnits({sowing_id: sowing_id}).subscribe((data) => {
      console.log(data);
      this.units = data;
    }, (error) => {
      console.log(error);
    });
  }


  closePopup() {
    this.modalCtrl.dismiss();
  }

  logHarvest() {
    let harvest_data = Object.assign({}, this.harvest_form.value);
    console.log(harvest_data);
    // harvest_data['date_of_harvest'] = harvest_data['date_of_harvest']['day']['value'] + '-' +
    //     harvest_data['date_of_harvest']['month']['value'] + '-' +
  //     harvest_data['date_of_harvest']['year']['value'];

    harvest_data['date_of_harvest'] = moment(harvest_data['date_of_harvest']).format('DD-MM-YYYY');
    this.httpService.logHarvest(harvest_data).subscribe((data) => {
      // console.log(data);
      this.displayToast('Harvest saved successfully', 'middle');
      this.modalCtrl.dismiss({
        'status': 'success', 'sowing_id': this.navParams.data['sowing_id']
      })
      // this.closePopup();
    }, (error) => {
      console.log(error);
    });
  }

  async  displayToast(message: string, display_position) {
    const toast = await this.toastCtrl.create({
      position: display_position,
      message: message,
      duration: 3000
    });
    toast.present();
  }

}
