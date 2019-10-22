import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, LoadingController, ToastController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { HttpServiceService } from '../../http-service.service';

@Component({
  selector: 'app-event-participant',
  templateUrl: './event-participant.page.html',
  styleUrls: ['./event-participant.page.scss'],
})
export class EventParticipantPage implements OnInit {
  dynamic_form_array: any = [];
  picture_array: any = [];
  event_detail: any = null;

  constructor(private storage: Storage, private navCtrl: NavController, private camera: Camera, private loadingCtrl: LoadingController, private httpService: HttpServiceService,
    private toastCtrl: ToastController) {
    this.appendParticipantCount();
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.storage.get('selected_event').then((event) => {
      console.log(event);
      this.event_detail = event;
    }).catch((error) => {
      console.error(error);
    });
  }

  appendParticipantCount() {
    this.dynamic_form_array.push({ name: null, phone: null })
  }

  spliceParticipantCount() {
    let length = this.dynamic_form_array.length - 1;
    this.dynamic_form_array.splice(length, 1);
  }

  ionViewDidLeave() {
    this.storage.remove('selected_event').then(() => {
      console.log('stored event removed!');
    });
  }

  getCameraImage() {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      this.picture_array.push('data:image/jpeg;base64,' + imageData);
    }, (err) => {
      // Handle error
    });
  }

  removeSelectedPic(index) {
    this.picture_array.splice(index, 1);
  }

  async onSubmitClicked() {
    let data_dict = {}

    for (let element of this.dynamic_form_array) {
      if (element['name'] == null || element['phone'] == null) {
        alert('Name or Phone number should not be empty!');
        return false;
      } else {
        console.log('not null');
      }
    }

    data_dict['event_id'] = this.event_detail['id']
    data_dict['participants'] = this.dynamic_form_array;
    data_dict['participant_count'] = this.dynamic_form_array.length
    if (this.picture_array.length != 0) {
      data_dict['event_images'] = this.picture_array
    }

    console.log(data_dict);

    let loading = await this.loadingCtrl.create({
      animated: true,
      spinner: 'lines-small',
    });
    loading.present();
    
    this.httpService.registerEventLog(data_dict).subscribe((data) => {
      console.log(data);
      this.displayToast('Participants added');
      loading.dismiss();
      this.navCtrl.navigateBack('/event-log')
    }, (error) => {
      console.error(error);
      loading.dismiss();
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
}
