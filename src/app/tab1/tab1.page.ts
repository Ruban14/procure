import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthenticationService } from '../services/authentication.service';
import { HttpServiceService } from '../http-service.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  constructor(
    private navCtrl: NavController,
    private authService: AuthenticationService,
    private storage: Storage,
    private httpService: HttpServiceService
  ) {
    this.httpService.getTransactionAndStatusCvs().subscribe(
      data => {
        console.log(data);
      },
      error => {
        console.log(error);
      }
    );
  }

  routePage(page_name: string) {
    console.log(page_name);
    this.navCtrl.navigateForward(page_name);
  }

  onLogout() {
    this.authService.logout();
  }
}
