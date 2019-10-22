import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { HttpServiceService } from '../../http-service.service';
import { ToastController, NavController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-create-invite',
  templateUrl: './create-invite.page.html',
  styleUrls: ['./create-invite.page.scss'],
})
export class CreateInvitePage implements OnInit {
  new_invite_form: FormGroup;

  constructor(private formBuilder: FormBuilder, private storage: Storage, private httpService: HttpServiceService, private toastCtrl: ToastController, private navCtrl: NavController,
    private geolocation: Geolocation) {
    let today = new Date().toISOString().split('T')
    console.log(today);
    let todate_time = new Date().toLocaleTimeString()
    console.log(todate_time);
    this.new_invite_form = this.formBuilder.group({
      business_name: [null],
      title: [null],
      description: [null],
      date: [today[0]],
      time: [todate_time],
      location_latitude: [null],
      location_longitude: [null],
      location_address: [null],
      organizer_name: [null],
      organizer_phone: [null],
      organizer_email: [null],
      host_name: [null],
      host_phone: [null],
      host_email: [null]
    });

    this.storage.get('user_profile').then((user_profile) => {
      console.log(user_profile);
      this.new_invite_form.get('business_name').setValue(user_profile['business']['name'])
      console.log(this.new_invite_form.value);
    });
  }

  ngOnInit() {
  }

  onRegisterInvite() {
    if (this.new_invite_form.value['date'].hasOwnProperty('year')) {
      console.log(this.new_invite_form.value['date']);
      this.new_invite_form.value['date'] = this.new_invite_form.value['date']['year']['value'] + '-' + this.new_invite_form.value['date']['month']['value'] + '-' + this.new_invite_form.value['date']['day']['value'];
    }
    
    if (this.new_invite_form.value['time'].hasOwnProperty('hour')) {
      console.log(this.new_invite_form.value['time']);
      this.new_invite_form.value['time'] = this.new_invite_form.value['time']['hour']['value'] + ':' + this.new_invite_form.value['time']['minute']['value'];
    }
    console.log(this.new_invite_form.value);

    this.httpService.registerNewInvite(this.new_invite_form.value).subscribe((data) => {
      console.log(data);
      this.displayToast('New Invite Registered!');
      this.navCtrl.navigateBack('/event-log');
    }, (error) => {
      console.error(error);
      let detailed_error = error.error;
      alert(JSON.stringify(detailed_error));
    });
  }

  async displayToast(message) {
    const toast = await this.toastCtrl.create({
      message: message,
      position: 'middle',
      duration: 3000
    });
    toast.present();
  }

  getPosition() {
    this.geolocation.getCurrentPosition().then((resp) => {
      // resp.coords.latitude
      // resp.coords.longitude
      console.log(resp);
      this.new_invite_form.get('location_latitude').setValue(resp.coords.latitude);
      this.new_invite_form.get('location_longitude').setValue(resp.coords.longitude);
     }).catch((error) => {
       console.log('Error getting location', error);
     });
     
     let watch = this.geolocation.watchPosition();
     watch.subscribe((data) => {
      // data can be a set of coordinates, or an error (if an error occurred).
      // data.coords.latitude
      // data.coords.longitude
     });
  }

}
