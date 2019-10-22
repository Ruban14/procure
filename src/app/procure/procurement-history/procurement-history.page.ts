import { Component, OnInit } from '@angular/core';
import { HttpServiceService } from '../../http-service.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-procurement-history',
  templateUrl: './procurement-history.page.html',
  styleUrls: ['./procurement-history.page.scss'],
})
export class ProcurementHistoryPage implements OnInit {
  procurement_history: any = null;
  date_listed: any = [];
  selected_index = null;

  constructor(private httpService: HttpServiceService, private loadingCtrl: LoadingController) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    let loading = await this.loadingCtrl.create({
      animated: true,
      spinner: 'dots',
    });
    loading.present();
    this.httpService.getProcurementHistoryByBusiness().subscribe((data) => {
      this.procurement_history = data;
      this.date_listed = Object.keys(data);
      console.log(this.procurement_history);
      console.log(this.date_listed);
      loading.dismiss();
    }, (error) => {
      console.error(error);
      loading.dismiss();
    });

  }

  showProcurements(procurement_index: number) {
    if (this.selected_index === procurement_index) {
      this.selected_index = null;
    } else {
      this.selected_index = procurement_index;
    }
  }

}
