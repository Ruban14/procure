import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { SelectProductPage } from './select-product/select-product.page'

@Component({
  selector: 'app-add-business-product',
  templateUrl: './add-business-product.page.html',
  styleUrls: ['./add-business-product.page.scss'],
})
export class AddBusinessProductPage implements OnInit {
  selected_index: any;
  selected_faq_index: any;
  product_categories: any;
  products: any;
  constructor(private modalController: ModalController, private navCtrl: NavController) {
    this.product_categories = [{ 'name': 'veg', 'id': 1 }, { 'name': 'non-veg', 'id': 2 }];
    this.products = { 1: [{ 'name': 'mango', 'id': 1 }, { 'name': 'orange', 'id': 2 }] };
  }

  // product preferene modal
  add_products() {
    this.navCtrl.navigateForward('/select-product');
  }


  onPageTitleSelected(index) {
    if (this.selected_index === index) {
      this.selected_index = null;
    } else {
      this.selected_index = index;
    }
    this.selected_faq_index = null;
  }

  ngOnInit() {
  }

}
