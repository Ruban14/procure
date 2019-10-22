import { Component } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthenticationService } from './services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthenticationService,
    private navCtrl: NavController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      // this.splashScreen.hide();
    });

    this.authService.authendicationState.subscribe((state) => {
      console.log('auth service in app component');
      console.log(state);
      this.splashScreen.hide();
      if (state) {
        console.log('state true');
        this.navCtrl.navigateRoot('auth/app/tabs/tab1');
      } else {
        console.log('load login page');
        this.navCtrl.navigateRoot('login');
      }
    });
  }
}
