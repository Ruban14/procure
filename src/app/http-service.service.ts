import { Injectable } from '@angular/core';
import { Events } from '@ionic/angular';
import { GlobalService } from './global.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {

  headers: HttpHeaders;

  constructor(private httpClient: HttpClient, private global: GlobalService, private storage: Storage, private events: Events
  ) {
    this.headers = new HttpHeaders();
    this.storage.get('auth-token').then(token => {
      if (token != null) {
        console.log('Token avl');
        this.setTokenHeader(token);
      }
    }, error => {
      console.error(error);
    }
    );

    this.events.subscribe('login_event', token => {
      this.setTokenHeader(token);
    });
  }

  login(data) {
    return this.httpClient.post(this.global.server_url + 'main/login/', data);
  }

  // append token to the header
  setTokenHeader(token) {
    console.log(token);
    this.headers = new HttpHeaders({ Authorization: 'Token ' + token });
    console.log(this.headers);
  }

  getRoutes() {
    return this.httpClient.get(this.global.server_url + 'procure/serve/routes/', { headers: this.headers });
  }

  getRoutesSowings(data) {
    return this.httpClient.post(this.global.server_url + 'procure/serve/routes/sowings/', data, { headers: this.headers });
  }

  getExpenseTypes() {
    return this.httpClient.get(this.global.server_url + 'procure/serve/procurement/expense/types/', { headers: this.headers });
  }

  addProcurementExpense(data) {
    return this.httpClient.post(this.global.server_url + 'procure/add/procurement/expense/', data, { headers: this.headers });
  }

  getTransactionAndStatusCvs() {
    return this.httpClient.get(this.global.server_url + 'procure/serve/transaction/and/status/cvs/', { headers: this.headers });
  }

  addProcurementPayOut(data) {
    return this.httpClient.post(this.global.server_url + 'procure/add/procurement/payout/', data, { headers: this.headers });
  }

  getFarmerSowings(data) {
    return this.httpClient.post(this.global.server_url + 'instance/serve/sowing/', data, { headers: this.headers });
  }

  getProcurementHistory(data) {
    return this.httpClient.post(this.global.server_url + 'procure/serve/farmer/procurements/history/', data, { headers: this.headers });
  }

  gerProcurementCv(data) {
    return this.httpClient.post(this.global.server_url + 'procure/serve/procurement/grades/and/channels/', data, { headers: this.headers });
  }

  gerProcurementEssentials(data) {
    return this.httpClient.post(this.global.server_url + 'procure/serve/procurement/grade/unit/channels/', data, { headers: this.headers });
  }

  getVehicleTypes() {
    return this.httpClient.get(this.global.server_url + 'procure/serve/vehicle/type/', { headers: this.headers });
  }

  getVehicleList() {
    return this.httpClient.get(this.global.server_url + 'procure/serve/list/of/vehicle/', { headers: this.headers });
  }

  registerVehicle(data) {
    return this.httpClient.post(this.global.server_url + 'procure/register/vehicle/', data, { headers: this.headers });
  }

  getProcurementForPickupTrip(data) {
    return this.httpClient.post(this.global.server_url + 'procure/serve/list/of/procurement/in/pickup/trip/', data, { headers: this.headers });
  }

  serveVehicles() {
    return this.httpClient.get(this.global.server_url + 'procure/serve/vehicles/for/make/pickup/trip/', { headers: this.headers });
  }

  uploadProcurements(data) {
    return this.httpClient.post(this.global.server_url + 'procure/webservice/record/produce/procurement/bulk/', data, { headers: this.headers });
  }

  registerPickupTrip(data) {
    return this.httpClient.post(this.global.server_url + 'procure/register/pickup/trip/', data, { headers: this.headers });
  }

  getOverallProcurementByVehicle(data) {
    return this.httpClient.post(this.global.server_url + 'procure/serve/procurements/by/vehicle/', data, { headers: this.headers });
  }

  getProcurementsByPickupTrip(data) {
    return this.httpClient.post(this.global.server_url + 'procure/serve/procurements/by/pickup/trip/', data, { headers: this.headers });
  }

  getBatchProductCVS() {
    return this.httpClient.get(this.global.server_url + 'procure/serve/batch/product/cv/', { headers: this.headers });
  }

  getBatchIncharge() {
    return this.httpClient.get(this.global.server_url + 'procure/serve/batch/inchargers/', { headers: this.headers });
  }

  getBusinessCrop() {
    return this.httpClient.get(this.global.server_url + 'procure/serve/instance/crops/', { headers: this.headers });
  }

  getGradeAndChannelForCrop() {
    return this.httpClient.get(this.global.server_url + 'procure/serve/procurement/grades/and/channels/', { headers: this.headers });
  }

  createBatch(data) {
    return this.httpClient.post(this.global.server_url + 'procure/create/batch/', data, { headers: this.headers });
  }

  getBatches() {
    return this.httpClient.get(this.global.server_url + 'procure/serve/batches/', { headers: this.headers });
  }

  getProcessByBatch(data) {
    return this.httpClient.post(this.global.server_url + 'procure/serve/batch/process/', data, { headers: this.headers });
  }

  assignProcessToBatch(data) {
    return this.httpClient.post(this.global.server_url + 'procure/process/assign/to/batch/', data, { headers: this.headers });
  }

  assignIndividualProcessToBatch(data) {
    return this.httpClient.post(this.global.server_url + 'procure/assign/process/to/batch/', data, { headers: this.headers });
  }

  rearrangeProcessForBatch(data) {
    return this.httpClient.post(this.global.server_url + 'procure/rearrange/processes/for/batch/', data, { headers: this.headers });
  }

  getProcessQuestion(data) {
    return this.httpClient.post(this.global.server_url + 'procure/serve/process/questions/', data, { headers: this.headers });
  }

  saveProcessAnswer(data) {
    return this.httpClient.post(this.global.server_url + 'procure/save/process/answers/', data, { headers: this.headers });
  }

  removeProcessFrombatch(data) {
    return this.httpClient.post(this.global.server_url + 'procure/remove/process/from/batch/', data, { headers: this.headers });
  }

  recordStartEndForBatch(data) {
    return this.httpClient.post(this.global.server_url + 'procure/save/batch/start/and/end/date/', data, { headers: this.headers });
  }

  markProcessAsComplete(data) {
    return this.httpClient.post(this.global.server_url + 'procure/make/batch/process/is/complete/', data, { headers: this.headers });
  }

  getSowingListForAssignLabour() {
    return this.httpClient.get(this.global.server_url + 'procure/serve/sowings/for/assign/labour/', { headers: this.headers });
  }

  getLabourTypes() {
    return this.httpClient.get(this.global.server_url + 'procure/serve/Labour/types/', { headers: this.headers });
  }

  getSowingOperationTypes() {
    return this.httpClient.get(this.global.server_url + 'procure/serve/sowing/operation/types/', { headers: this.headers });
  }

  assignLabourToSowingOperation(data) {
    return this.httpClient.post(this.global.server_url + 'procure/assign/labour/to/sowing/operation/', data, { headers: this.headers });
  }

  getRoutesForLinkSowing(data) {
    return this.httpClient.post(this.global.server_url + 'procure/serve/routes/for/link/sowing/', data, { headers: this.headers });
  }

  linkSowingWithRoute(data) {
    return this.httpClient.post(this.global.server_url + 'procure/link/sowing/with/route/', data, { headers: this.headers });
  }

  getSowingsForProcurementExclude() {
    return this.httpClient.get(this.global.server_url + 'procure/serve/sowings/for/procurement/exclude/', { headers: this.headers });
  }

  getProcurementHistoryByBusiness() {
    return this.httpClient.get(this.global.server_url + 'procure/serve/procurement/history/by/business/', { headers: this.headers });
  }

  getStorageSectionAndLot() {
    return this.httpClient.get(this.global.server_url + 'procure/serve/storage/section/and/lots/', { headers: this.headers });
  }

  saveProcurementToStorage(data) {
    return this.httpClient.post(this.global.server_url + 'procure/save/procurements/to/storage/', data, { headers: this.headers });
  }

  getLabourTypesMap() {
    return this.httpClient.get(this.global.server_url + 'procure/serve/labour/type/map/', { headers: this.headers });
  }

  registerNewLabourType(data) {
    return this.httpClient.post(this.global.server_url + 'procure/register/labour/type/', data, { headers: this.headers });
  }

  registerNewLabourTeam(data) {
    return this.httpClient.post(this.global.server_url + 'procure/register/labour/team/', data, { headers: this.headers });
  }

  serveStorageSection() {
    return this.httpClient.get(this.global.server_url + 'procure/serve/storage/section/', { headers: this.headers });
  }

  registerStorageAndSection(data) {
    return this.httpClient.post(this.global.server_url + 'procure/register/storage/and/storage/section/', data, { headers: this.headers });
  }

  getSowingsVillageAndCropNames() {
    return this.httpClient.get(this.global.server_url + 'procure/serve/sowings/village/and/crop/names/', { headers: this.headers });
  }

  sendSmsToFarmers(data) {
    return this.httpClient.post(this.global.server_url + 'procure/send/message/to/farmers/', data, { headers: this.headers });
  }

  serveInviteList(data) {
    return this.httpClient.post(this.global.server_url + 'instance/webservice/serve/event/invitations/for/business/', data, { headers: this.headers });
  }

  registerNewInvite(data) {
    return this.httpClient.post(this.global.server_url + 'instance/webservice/event/invitation/add/for/business/', data, { headers: this.headers });
  }

  serveSupportingBusinessTypes() {
    return this.httpClient.get(this.global.server_url + 'instance/webservice/serve/supporting/business/types/', { headers: this.headers });
  }

  registerSupportingBusiness(data) {
    return this.httpClient.post(this.global.server_url + 'instance/webservice/save/special/formdata/', data, { headers: this.headers });
  }

  registerEventLog(data) {
    return this.httpClient.post(this.global.server_url + 'instance/webservice/register/event/log/from/invite/', data, { headers: this.headers });
  }

  getOdoHistory(data) {
    return this.httpClient.post(this.global.server_url + 'instance/webservice/save/special/formdata/', data, { headers: this.headers });
  }


  getHarvestUnits(data) {
    return this.httpClient.post(this.global.server_url + 'instance/serve/harvest/units/by/user/', data, { headers: this.headers });
  }

  logHarvest(data) {
    return this.httpClient.post(this.global.server_url + 'instance/log/harvest/', data, { headers: this.headers });
  }

  getLabourTeams() {
    return this.httpClient.get(this.global.server_url + 'procure/serve/labour/teams/', { headers: this.headers });
  }

  getPurposeCvs() {
    return this.httpClient.get(this.global.server_url + 'procure/serve/field/operation/purpose/cvs/', { headers: this.headers });
  }

  mapProcurementLabour(data) {
    return this.httpClient.post(this.global.server_url + 'procure/map/procurement/labour/', data, { headers: this.headers });
  }

  getFarmerTransaction(data) {
    return this.httpClient.post(this.global.server_url + 'procure/serve/farmer/transaction/', data, { headers: this.headers });
  }

  updateFarmerTransaction(data) {
    return this.httpClient.post(this.global.server_url + 'procure/update/farmer/transaction/', data, { headers: this.headers });
  }

  getSowingHarvests(data) {
    return this.httpClient.post(this.global.server_url + 'instance/serve/sowing/harvests/', data, { headers: this.headers });
  }

  serveProcessedProductByProcess(data) {
    return this.httpClient.post(this.global.server_url + 'procure/serve/processed/product/by/process/', data, { headers: this.headers });
  }

  serveProcessedProductByBusiness() {
    return this.httpClient.get(this.global.server_url + 'procure/serve/processed/product/by/business/', { headers: this.headers });
  }

  serveCropUnit(data) {
    return this.httpClient.post(this.global.server_url + 'procure/serve/unit/for/crop/', data, { headers: this.headers });
  }

  getStorageSectionAndProcessedProductLot() {
    return this.httpClient.get(this.global.server_url + 'procure/serve/storage/section/and/processed/product/lots/', { headers: this.headers });
  }

  registerProcessedProductToStorage(data) {
    return this.httpClient.post(this.global.server_url + 'procure/register/processed/product/to/storage/', data, { headers: this.headers });
  }

  serveProcessedProcessedStorage() {
    return this.httpClient.get(this.global.server_url + 'procure/serve/processed/product/from/storage/', { headers: this.headers });
  }

  serveStorageProductDetails(data) {
    return this.httpClient.post(this.global.server_url + 'procure/serve/list/of/procurement/and/product/', data, { headers: this.headers });
  }

  // *************************************************************************
  // procure
  // *************************************************************************

  usernameValidation(data) {
    return this.httpClient.post(this.global.server_url + 'main/username/validation/', data);
  }

  otpValidation(data) {
    return this.httpClient.post(this.global.server_url + 'main/otp/validation/', data);
  }

  resetPassword(data) {
    return this.httpClient.post(this.global.server_url + 'main/reset/password/', data);
  }

  tempRegister(data) {
    return this.httpClient.post(this.global.server_url + 'main/business/temp/register/', data);
  }

  confirmSignupOTP(data) {
    return this.httpClient.post(this.global.server_url + 'main/confirm/otp/', data);
  }

  getStateDistrictTaluks() {
    return this.httpClient.get(this.global.server_url + 'instance/serve/state/district/taluks/');
  }

  registerFarmer(data) {
    return this.httpClient.post(this.global.server_url + 'main/save/farmer/', data, { headers: this.headers });
  }

  serveLanguages() {
    return this.httpClient.get(this.global.server_url + 'common/serve/language/');
  }

  getPincodeDetails(data) {
    return this.httpClient.post(this.global.server_url + 'instance/serve/pincode/district/block/revenuevillage/', data, { headers: this.headers });
  }

  // ==============
  getStatesAndDistrticts() {
    return this.httpClient.get(this.global.server_url + 'common/serve/state/districts/');
  }

  getBusinessTypes() {
    return this.httpClient.get(this.global.server_url + 'main/serve/business/types/', { headers: this.headers });
  }

  getFarmerDetails() {
    return this.httpClient.get(this.global.server_url + 'main/serve/farmers/', { headers: this.headers });
  }


}
