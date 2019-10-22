import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { HttpServiceService } from '../../http-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-assign-labour-to-procurement',
  templateUrl: './assign-labour-to-procurement.page.html',
  styleUrls: ['./assign-labour-to-procurement.page.scss'],
})
export class AssignLabourToProcurementPage {
  purpose_cvs: any = [];
  labour_teams: any = [];
  field_operation_form: FormGroup;

  constructor(private modalCtrl: ModalController, private formBuilder: FormBuilder, private httpService: HttpServiceService,
              private navParams: NavParams) {
    console.log(this.navParams.get('target_id'));
    this.field_operation_form = formBuilder.group({
      purpose_id: [null, Validators.compose([Validators.required])],
      labour_team_id: [null, Validators.compose([Validators.required])],
      date: [null, Validators.compose([Validators.required])],
    });
    this.getLabourTypes();
    this.getPurposeCvs();
  }

  closeModalController() {
    this.modalCtrl.dismiss({
      'status': 'fail'
    });
  }

  getPurposeCvs() {
    this.httpService.getPurposeCvs().subscribe((data) => {
      console.log(data);
      this.purpose_cvs = data;
    }, (error) => {
      console.log(error);
    });
  }

  getLabourTypes() {
    this.httpService.getLabourTeams().subscribe((data) => {
      console.log(data);
      this.labour_teams = data;
    }, (error) => {
      console.log(error);
    });
  }

  mapLabourTeamToProcurement() {
    console.log(this.field_operation_form.value);
    const data = Object.assign({}, this.field_operation_form.value);
    data['date'] = data['date']['day']['value'] + '-' + data['date']['month']['value'] + '-' + data['date']['year']['value'];
    data['target_id'] = this.navParams.get('target_id');
    data['target_table'] = this.navParams.get('target_table');
    this.httpService.mapProcurementLabour(data).subscribe((res_data) => {
      console.log(data);
      this.modalCtrl.dismiss({
        'status': 'success'
      });
    }, (error) => {
      console.log(error);
    });
  }

}
