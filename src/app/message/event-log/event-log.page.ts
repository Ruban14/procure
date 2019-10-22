import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HttpServiceService } from '../../http-service.service';

@Component({
  selector: 'app-event-log',
  templateUrl: './event-log.page.html',
  styleUrls: ['./event-log.page.scss'],
})
export class EventLogPage implements OnInit {

  invite_list: any;
  selected_index: any = null;

  constructor(private navCtrl: NavController, private storage: Storage, private httpService: HttpServiceService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.storage.get('user_profile').then((user_profile) => {
      console.log(user_profile);
      this.httpService.serveInviteList({business_name: user_profile['business']['name']}).subscribe((data) => {
        console.log(data);
        this.invite_list = data;
      },(error) => {
        console.error(error);
      });
    });
  }

  onAddClicked() {
    this.navCtrl.navigateForward('create-invite');
  }

  showInvite(invite_index) {
    if (this.selected_index === invite_index) {
      this.selected_index = null;
    } else {
      this.selected_index = invite_index;
    } 
  }

  onEventClicked(invite_index) {
    console.log(this.invite_list[invite_index]);
    this.storage.get('selected_event').then((event) => {
      if (event != null) {
        this.storage.remove('selected_event').then(() => {
          this.storage.set('selected_event', this.invite_list[invite_index]);
          this.navCtrl.navigateForward('/event-participant');
        });
      } else {
        this.storage.set('selected_event', this.invite_list[invite_index]);
        this.navCtrl.navigateForward('/event-participant');
      }
    });
  }
}
