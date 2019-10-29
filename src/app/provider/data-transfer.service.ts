import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataTransferService {
  editable_batch_details: any;
  editable_pond_details: any;
  detailed_event: any;
  user_details: any;
  query_details: any;
  business_details: any;
  product_details: any;

  constructor() { }

  setEditableBatchDetails(batch_obj) {
    this.editable_batch_details = batch_obj;
  }

  setBuinessDetails(business) {
    this.business_details = business;
  }
  setProductDetails(product) {
    this.product_details = product;
  }

  setQueryDetails(query) {
    this.query_details = query;
  }

  setEditablePondDetails(pond_obj) {
    this.editable_pond_details = pond_obj;
  }

  setDetailedEvent(event_obj) {
    this.detailed_event = event_obj;
  }

  userDetailsInPasswordReser(user_obj) {
    this.user_details = user_obj;
  }
}
