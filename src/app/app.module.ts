import { ProcessedProductToStorePage } from './storage/processed-product-to-store/processed-product-to-store.page';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GradeChannelFilterPipe } from './procure/grade-channel-filter.pipe';
import { PopUpProcessPage } from './procure/pop-up-process/pop-up-process.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicStorageModule } from '@ionic/storage';
import { AssignLabourToSowingPage } from './assign-labour/assign-labour-to-sowing/assign-labour-to-sowing.page';
import { LinkRoutePage } from './assign-labour/link-route/link-route.page';
import { AssignProcurementToStoragePage } from './storage/assign-procurement-to-storage/assign-procurement-to-storage.page';
import { MessageActionPopoverComponent } from './message/message-action-popover/message-action-popover.component';
import { SmsPage } from './message/sms/sms.page';
// import { Geolocation } from '@ionic-native/geolocation/ngx';
// import { Camera } from '@ionic-native/camera/ngx';
import { AuthenticationService } from './services/authentication.service';
// import { SMS } from '@ionic-native/sms/ngx';
import { AddProcureExpensePage } from './procure/add-procure-expense/add-procure-expense.page';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { AddProcurementPayoutPage } from './procure/add-procurement-payout/add-procurement-payout.page';
import { HarvestPage } from './sowing-expense/harvest/harvest.page';
import { TimeDiffInYearsPipe } from './global-pipe/time-diff-in-years.pipe';
import { AssignLabourToProcurementPage } from './assign-labour/assign-labour-to-procurement/assign-labour-to-procurement.page';
import { FarmerPaymentTransactionUpdatePage } from './payment-transaction-info/farmer-payment-transaction-update/farmer-payment-transaction-update.page';
// inserted for procure app
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}
@NgModule({
  declarations: [
    AppComponent,
    GradeChannelFilterPipe,
    PopUpProcessPage,
    AssignLabourToSowingPage,
    LinkRoutePage,
    AssignProcurementToStoragePage,
    MessageActionPopoverComponent,
    AddProcureExpensePage,
    AddProcurementPayoutPage,
    SmsPage,
    HarvestPage,
    AssignLabourToProcurementPage,
    FarmerPaymentTransactionUpdatePage,
    ProcessedProductToStorePage
  ],
  entryComponents: [
    PopUpProcessPage,
    LinkRoutePage,
    AssignLabourToSowingPage,
    AssignProcurementToStoragePage,
    MessageActionPopoverComponent,
    AddProcureExpensePage,
    AddProcurementPayoutPage,
    SmsPage,
    HarvestPage,
    AssignLabourToProcurementPage,
    FarmerPaymentTransactionUpdatePage,
    ProcessedProductToStorePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot({
      scrollAssist: false,
      backButtonIcon: 'ios-arrow-back'
    }),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    Diagnostic,
    LocationAccuracy,
    AndroidPermissions,
    Geolocation,
    // Camera,
    AuthenticationService,
    // SMS,
    DatePicker
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
