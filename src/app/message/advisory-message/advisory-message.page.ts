import { Component } from '@angular/core';
import { HttpServiceService } from '../../http-service.service';
import { PopoverController } from '@ionic/angular';
import { MessageActionPopoverComponent } from '../message-action-popover/message-action-popover.component';

@Component({
  selector: 'app-advisory-message',
  templateUrl: './advisory-message.page.html',
  styleUrls: ['./advisory-message.page.scss'],
})
export class AdvisoryMessagePage {
  filter_factors: string[] = null;
  filter_values: any = null;
  to_be_filter: any = {};

  constructor(private httpService: HttpServiceService, private popoverCtrl: PopoverController) {
    this.httpService.getSowingsVillageAndCropNames().subscribe((data) => {
      console.log(data);
      this.filter_factors = Object.keys(data);
      this.filter_values = data;
    }, (error) => {
      console.log(error);
    });
  }

  async presentPopover(ev: any) {
    console.log('popover called');
    const popover = await this.popoverCtrl.create({
      component: MessageActionPopoverComponent,
      // event: ev,
      translucent: true,
      mode: 'md',
      componentProps: {'data': this.to_be_filter}
    });
    return await popover.present();
  }

  filterFactorChanged(filter_factor, filter_value) {
    console.log('filter factor changed');
    console.log(filter_factor);
    console.log(filter_value);
    if (this.to_be_filter.hasOwnProperty(filter_factor) === false) {
      this.to_be_filter[filter_factor] = [];
    }

    console.log(this.to_be_filter);

    if (this.to_be_filter[filter_factor].indexOf(filter_value) > -1) { // village already there
      const filter_value_index = this.to_be_filter[filter_factor].indexOf(filter_value);
      this.to_be_filter[filter_factor].splice(filter_value_index, 1);
    } else {
      this.to_be_filter[filter_factor].push(filter_value);
    }
    console.log(this.to_be_filter);
  }
}
