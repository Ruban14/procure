import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './services/auth-gaurd.service';
import { ChildRoutingModule } from './child-routing.module';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./login/sign-up/sign-up.module').then(m => m.SignUpPageModule)
    // loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'farmers',
    loadChildren: () => import('./procure/farmers/farmers.module').then(m => m.FarmersPageModule)
  },
  {
    path: 'sowings/:farmer_id',
    loadChildren: () => import('./procure/sowings/sowings.module').then(m => m.SowingsPageModule)
  },
  {
    path: 'vehicle-list/:sowing_id/:instance_crop_id',
    loadChildren: () => import('./procure/vehicle/vehicle-list/vehicle-list.module').then(m => m.VehicleListPageModule)
  },
  {
    path: 'procure-form/:pickup_trip_id/:sowing_id/:instance_crop_id',
    loadChildren: () => import('./procure/procure-form/procure-form.module').then(m => m.ProcureFormPageModule)
  },
  {
    path: 'batching',
    loadChildren: () => import('./procure/batching/batching.module').then(m => m.BatchingPageModule)
  },
  {
    path: 'register-pickup-trip',
    loadChildren: () => import('./procure/register-pickup-trip/register-pickup-trip.module').then(m => m.RegisterPickupTripPageModule)
  },
  {
    path: 'batch-processing/:batch_id/:crop_id',
    loadChildren: () => import('./procure/batch-processing/batch-processing.module').then(m => m.BatchProcessingPageModule)
  },
  {
    path: 'batch-list',
    loadChildren: () => import('./procure/batch-list/batch-list.module').then(m => m.BatchListPageModule)
  },
  {
    path: 'pop-up-process',
    loadChildren: () => import('./procure/pop-up-process/pop-up-process.module').then(m => m.PopUpProcessPageModule)
  },
  {
    path: 'assign-labour-sowings',
    loadChildren: () => import('./assign-labour/assign-labour-sowings/assign-labour-sowings.module').then(m => m.AssignLabourSowingsPageModule)
  },
  {
    path: 'store-list',
    loadChildren: () => import('./procure/store/store-list/store-list.module').then(m => m.StoreListPageModule)
  },
  {
    path: 'routes',
    loadChildren: () => import('./route/routes/routes.module').then(m => m.RoutesPageModule)
  },
  {
    path: 'procurement-history',
    loadChildren: () => import('./procure/procurement-history/procurement-history.module').then(m => m.ProcurementHistoryPageModule)
  },
  {
    path: 'storage-vehicles',
    loadChildren: () => import('./storage/vehicles/vehicles.module').then(m => m.VehiclesPageModule)
  },
  {
    path: 'advisory-message',
    loadChildren: () => import('./message/advisory-message/advisory-message.module').then(m => m.AdvisoryMessagePageModule)
  },
  {
    path: 'create-invite',
    loadChildren: () => import('./message/create-invite/create-invite.module').then(m => m.CreateInvitePageModule)
  },
  {
    path: 'supporting-business',
    loadChildren: () => import('./message/supporting-business/supporting-business.module').then(m => m.SupportingBusinessPageModule)
  },
  {
    path: 'event-log',
    loadChildren: () => import('./message/event-log/event-log.module').then(m => m.EventLogPageModule)
  },
  {
    path: 'event-participant',
    loadChildren: () => import('./message/event-participant/event-participant.module').then(m => m.EventParticipantPageModule)
  },
  {
    path: 'odo',
    loadChildren: () => import('./consultant-expense/odo/odo.module').then(m => m.OdoPageModule)
  },
  {
    path: 'harvest',
    loadChildren: () => import('./sowing-expense/harvest/harvest.module').then(m => m.HarvestPageModule)
  },
  {
    path: 'farmer-payment-transaction-info/:farmer_id',
    loadChildren: () => import('./payment-transaction-info/farmer-payment-transaction-info/farmer-payment-transaction-info.module').then(m => m.FarmerPaymentTransactionInfoPageModule)
  },
  {
    path: 'stock-list',
    loadChildren: () => import('./storage/stock-list/stock-list.module').then(m => m.StockListPageModule)
  },
  {
    path: 'sign-up',
    loadChildren: () => import('./login/sign-up/sign-up.module').then(m => m.SignUpPageModule)
  },
  {
    path: 'register-farmer',
    loadChildren: () => import('./procure/register-farmer/register-farmer.module').then(m => m.RegisterFarmerPageModule)
  },


  { path: 'auth',
    canActivate: [AuthGuardService],
    loadChildren: './child-routing.module#ChildRoutingModule'
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
