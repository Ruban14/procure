import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, AlertController } from '@ionic/angular';
import { HttpServiceService } from '../../../http-service.service';

@Component({
  selector: 'app-store-list',
  templateUrl: './store-list.page.html',
  styleUrls: ['./store-list.page.scss'],
})
export class StoreListPage implements OnInit {
   // slides options
   @ViewChild('slider', {'static' : false}) slides: IonSlides;
   slideOpts = {
     effect: 'flip',
     allowTouchMove: false
   };
  
  batch_incharge: any;
  batch_product_cvs: any;
  collected_grades: any[] = []
  selected_crop_id: any = null;
  crops: any = [];
  grades_and_channels: any;
  selected_grades: any = [];
  selected_channels: any = [];

  constructor(private httpService: HttpServiceService, private alertCtrl: AlertController) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.httpService.getBatchProductCVS().subscribe((data) => {
      console.log(data);
      this.batch_product_cvs = data;
    }, (error) => {
      console.error(error);
    });

    this.httpService.getBatchIncharge().subscribe((data) => {
      console.log(data);
      this.batch_incharge = data;
    }, (error) => {
      console.error(error);
    });

    this.httpService.getBusinessCrop().subscribe((data) => {
      console.log(data);
      this.crops = data;
    }, (error) => {
      console.error(error);
    });

    this.httpService.getGradeAndChannelForCrop().subscribe((data) => {
      console.log(data);
      this.grades_and_channels = data;
    }, (error) => {
      console.error(error);
    });
  }

  slideTo(slide_index: number) {
    this.slides.slideTo(slide_index);
  }

  async gradeAlert(added_grade, adding_grade) {
    const alert = await this.alertCtrl.create({
      header: 'Alert',
      subHeader: 'You trying to ADD two different Grades',
      message: 'Selected Grade is ' + added_grade + ', and you trying to add ' + adding_grade,
      buttons: ['OK']
    });

    await alert.present();
  }

  onGradeSelected(grade) {
    console.log(grade);
    if (this.selected_grades.includes(grade)) {
      this.arraySplice(this.selected_grades, grade);
    } else {
      this.selected_grades.push(grade);
    }
    console.log(this.selected_grades);
  }

  onChannelSelected(channel) {
    console.log(channel);
    if (this.selected_channels.includes(channel)) {
      this.arraySplice(this.selected_channels, channel);
    } else {
      this.selected_channels.push(channel);
    }
    console.log(this.selected_channels);
  }

  arraySplice(selected_list: Array<any>, args) {
    let index = selected_list.indexOf(args);
    selected_list.splice(index, 1);
  }

}
