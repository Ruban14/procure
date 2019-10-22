import { Component, OnInit, Input } from '@angular/core';
import { HttpServiceService } from '../../http-service.service';
// import { st } from '@angular/core/src/render3';
import { NavParams, ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-assign-labour-to-sowing',
  templateUrl: './assign-labour-to-sowing.page.html',
  styleUrls: ['./assign-labour-to-sowing.page.scss'],
})
export class AssignLabourToSowingPage implements OnInit {
  @Input() value: number;
  labour_types: any = null;
  labour_teams: any = null;
  sowing_operation_types: any = null;
  sowing_id: number = null;
  todate: any;
  labour_type_id: any = null;
  labour_team_id: any;

  constructor(private httpService: HttpServiceService, private navParams: NavParams,
              private modalCtrl: ModalController, private toastCtrl: ToastController) {
    this.sowing_id = this.navParams.data['sowing_id'];
    console.log(this.sowing_id);
    this.getLabourType();
    this.getSowingOperationType();

    this.todate = new Date().toISOString().split('T')[0];
    console.log(this.todate);
  }

  getLabourType() {
    this.httpService.getLabourTypes().subscribe((data) => {
      console.log(data);
      this.labour_types = data['labour_type_data'];
      this.labour_teams = data['labour_team_data'];
    }, (error) => {
      console.log(error);
    });
  }

  getSowingOperationType() {
    this.httpService.getSowingOperationTypes().subscribe((data) => {
      console.log(data);
      this.sowing_operation_types = data;
    }, (error) => {
      console.log(error);
    });
  }

  assignLabourToSowingOperation(labour_type_id, sowing_operation_type_id, start_date) {
    console.log(start_date);
    let modified_start_date: any = start_date;
    let modified_to_date: any = start_date;
    if (start_date.hasOwnProperty('year')) {
      modified_start_date = start_date['year']['value']  + '-' + start_date['month']['value'] + '-' + start_date['day']['value'];
      modified_to_date = start_date['year']['value'] + '-' + start_date['month']['value'] + '-' + start_date['day']['value'];
    }
    console.log(modified_start_date);
    console.log(modified_to_date);
    const data_dict = {
      'sowing_id': this.sowing_id,
      'labour_team_id': labour_type_id,
      'sowing_operation_type_id': sowing_operation_type_id,
      'start_date': modified_start_date,
      'to_date': modified_to_date
    };
    console.log(data_dict);
    this.httpService.assignLabourToSowingOperation(data_dict).subscribe((res_data) => {
      console.log(res_data);
      this.presentToast('Assign labour to sowing process successfully!', 'middle');
      this.modalCtrl.dismiss({is_changed: true});
    }, (error) => {
      console.log(error);
    });
  }

  async presentToast(message, position) {
    const toast = await this.toastCtrl.create({
      message: message,
      'position': position,
      duration: 3000
    });
    toast.present();
  }

  closePopup() {
    this.modalCtrl.dismiss();
  }

  ngOnInit() {
  }

  onLaboutTypeChanged() {
    this.labour_team_id = null;
  }

}
