import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import * as moment from 'moment';

@Component({
  selector: 'app-pop-up-process',
  templateUrl: './pop-up-process.page.html',
  styleUrls: ['./pop-up-process.page.scss'],
})
export class PopUpProcessPage implements OnInit {
  process_data_dict: any = {};

  constructor(private navParms: NavParams, private modalController: ModalController) {
    let navParms_data = this.navParms.data['value'];
    console.log(navParms_data);
    let todate = new Date().toISOString();
    this.process_data_dict['process_id'] = navParms_data.process_id;
    this.process_data_dict['start_date'] = todate;
    this.process_data_dict['end_date'] = todate;
    this.process_data_dict['description'] = navParms_data.description;
    this.process_data_dict['duration_in_hour'] = navParms_data.duration_in_hour;
    this.process_data_dict['name'] = navParms_data.name;
    this.process_data_dict['status'] = navParms_data.status;
    this.process_data_dict['status_id'] = navParms_data.status_id;
  }

  ngOnInit() {
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  onUpdate() {
    if (this.process_data_dict['start_date'].hasOwnProperty('year')) {
      console.log(this.process_data_dict['start_date']);
      this.process_data_dict['start_date'] = this.process_data_dict['start_date']['year']['value'] + '-' + this.process_data_dict['start_date']['month']['value'] + '-' + this.process_data_dict['start_date']['day']['value'] + ' ' + this.process_data_dict['start_date']['hour']['value'] + ':' + this.process_data_dict['start_date']['minute']['value'];
    }
    if (this.process_data_dict['end_date'].hasOwnProperty('year')) {
      console.log(this.process_data_dict['end_date']);
      this.process_data_dict['end_date'] = this.process_data_dict['end_date']['year']['value'] + '-' + this.process_data_dict['end_date']['month']['value'] + '-' + this.process_data_dict['end_date']['day']['value'] + ' ' + this.process_data_dict['end_date']['hour']['value'] + ':' + this.process_data_dict['end_date']['minute']['value'];
    }
    this.process_data_dict['start_date'] = moment(this.process_data_dict['start_date']).format('YYYY-MM-DD HH:mm')
    this.process_data_dict['end_date'] = moment(this.process_data_dict['end_date']).format('YYYY-MM-DD HH:mm')
    console.log(this.process_data_dict);
    this.modalController.dismiss(this.process_data_dict);
  }
}
