import { Component } from '@angular/core';
import { HttpServiceService } from '../../http-service.service';
import { Storage } from '@ionic/storage';
import { NavController, Platform, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.page.html',
  styleUrls: ['./routes.page.scss']
})
export class RoutesPage {
  routes: any = [];

  checked_route_ids: number[] = [];
  business_short_name: string = null;
  constructor(
    private httpService: HttpServiceService,
    private storage: Storage,
    private navCtrl: NavController,
    private platform: Platform,
    private loadingCtrl: LoadingController
  ) {
    console.log('route page');
    this.getRoutes();
    this.platform.ready().then(() => {
      this.storage.get('user_profile').then(user_profile => {
        this.business_short_name = user_profile['business']['shortname'];
      });
    });
  }

  getRoutes(event = null) {
    this.httpService.getRoutes().subscribe(
      routes => {
        console.log(routes);
        this.routes = routes;
        if (event !== null) { event.target.complete(); }
      },
      error => {
        console.log(error);
        if (event !== null) { event.target.complete(); }
      }
    );
  }

  checkboxClicked(event, route_id) {
    console.log(event.detail.checked);
    if (event.detail.checked) {
      this.checked_route_ids.push(route_id);
    } else {
      const route_id_index = this.checked_route_ids.indexOf(route_id);
      this.checked_route_ids.splice(route_id_index, 1);
    }
    console.log(this.checked_route_ids);
  }

  doRefresh(event) {
    console.log(event);
    this.getRoutes(event);
  }

  async downloadRoutes() {
    const loading = await this.loadingCtrl.create({
      animated: true,
      spinner: 'lines'
    });
    loading.present();
    const data = { route_ids: this.checked_route_ids };
    this.httpService.getRoutesSowings(data).subscribe(
      farmers => {
        console.log(farmers);
        this.storage.set('farmers', farmers);
        this.navCtrl.pop();
        loading.dismiss();
      },
      error => {
        console.log(error);
        loading.dismiss();
      }
    );
  }
}
