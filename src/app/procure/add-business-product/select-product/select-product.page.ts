import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-select-product',
  templateUrl: './select-product.page.html',
  styleUrls: ['./select-product.page.scss'],
})
export class SelectProductPage implements OnInit {

  product_categories: any;
  products: any;
  selected_product: any;
  temp_product: any;
  selected_index: any;
  selected_faq_index: any;

  constructor() {
    this.product_categories = [{ 'name': 'veg', 'id': 1 }, { 'name': 'non-veg', 'id': 2 }];
    this.products = {
      1: [{ 'name': 'mango', 'id': 1 }, { 'name': 'orange', 'id': 2 }],
      2: [{ 'name': 'fish', 'id': 3 }, { 'name': 'checken', 'id': 4 }]
    };
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
