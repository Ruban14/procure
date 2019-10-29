import { Injectable } from '@angular/core';
import { GlobalService } from '../global.service';
import { HttpClient } from '@angular/common/http';
// import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { BehaviorSubject } from 'rxjs';
import { Platform, Events } from '@ionic/angular';
import { Storage } from '@ionic/storage';
const TOKEN_KEY = 'auth-token';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  authendicationState = new BehaviorSubject(true);
  constructor(
    private global: GlobalService,
    private httpClient: HttpClient,
    private storage: Storage,
    private platoform: Platform,
    private events: Events
  ) {
    this.platoform.ready().then(() => {
      this.checkToken();
    });
  }

  ionViewWillEnter() {
    this.platoform.ready().then(() => {
      this.checkToken();
    });
  }

  login(data) {
    this.httpClient.post(this.global.server_url + 'instance/login/for/token/', data).subscribe(res_data => {
      console.log(res_data);
      this.authendicationState.next(true);
      this.events.publish('login_event', res_data['token']);
      this.storage.set('user_profile', res_data['user_profile']);
      return this.storage.set(TOKEN_KEY, res_data['token']);
    },
      error => {
        console.log(error);
        let detailed_error = error.error;
        alert(detailed_error['detail']);
      }
    );
  }

  async logout() {
    this.storage.clear();
    return this.authendicationState.next(false);

    // return this.storage.clear().then(() => {
    //   this.authendicationState.next(false);
    // });
  }
  isAuthenticated() {
    return this.authendicationState.value;
  }

  async checkToken() {
    return this.storage.get(TOKEN_KEY).then(res => {
      if (res) {
        this.authendicationState.next(true);
      }
    });
  }
}
