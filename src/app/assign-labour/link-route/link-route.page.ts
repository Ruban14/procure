import { Component, OnInit } from '@angular/core';
import { HttpServiceService } from '../../http-service.service';
import { ModalController, NavParams, Platform } from '@ionic/angular';

@Component({
  selector: 'app-link-route',
  templateUrl: './link-route.page.html',
  styleUrls: ['./link-route.page.scss'],
})
export class LinkRoutePage implements OnInit {
  routes: any = [];
  sowing_id: number = null;
  constructor(private httpService: HttpServiceService, private navParams: NavParams,
              private platform: Platform, private modelCtrl: ModalController) {
    console.log('link route page');
    console.log(this.navParams.data['sowing_id']);
    this.sowing_id = this.navParams.data['sowing_id'];
    this.getRoutes(this.sowing_id);
    // this.platform.backButton.subscribe(async () => {
    //   alert('ionic backbutton pressed');
    //   console.log('ionic backbutton pressed');
    //   this.modelCtrl.dismiss();
    // });
  }

  getRoutes(sowing_id) {
    const data = {'sowing_id': sowing_id};

    this.httpService.getRoutesForLinkSowing(data).subscribe((data) => {
      console.log(data);
      if (data.hasOwnProperty('error_message')) {
        alert(data['error_message']);
        this.modelCtrl.dismiss({
          'result': {'sowing_id': this.sowing_id, 'status': 'success'}
        });
      }
      this.routes = data;
    }, (error) => {
      console.log(error);
    });
  }

  closePopUp() {
    this.modelCtrl.dismiss();
  }

  linkSowingWithRoute(route_id: number) {
    const data = {sowing_id: this.sowing_id, route_id: route_id};
    this.httpService.linkSowingWithRoute(data).subscribe((res_data) => {
      console.log(res_data);
      this.modelCtrl.dismiss({
        'result': {'sowing_id': this.sowing_id, 'status': 'fail'}
      });
    }, (error) => {
      alert('Error to link sowing');
    });
  }
  ngOnInit() {
  }

}
