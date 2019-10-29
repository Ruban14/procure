import { Injectable } from '@angular/core';
import { ToastController, NavController } from '@ionic/angular';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';


@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  private _server_url = 'http://localhost:8000/';
  // private _server_url = 'http://192.168.0.4:8000/';

  constructor(
    private toastCtrl: ToastController,
    private diagnostic: Diagnostic,
    private androidPermissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy,
    private geolocation: Geolocation
  ) {}
  get server_url() {
    return this._server_url;
  }

  async displayToast(message: string, position: any, duration: number) {
    const toast = await this.toastCtrl.create({
      message,
      position,
      duration
    });
    toast.present();
  }
  // Check if application having GPS access permission
  checkGPSPermission() {
    this.androidPermissions
      .checkPermission(
        this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION
      )
      .then(
        result => {
          if (result.hasPermission) {
            // If having permission show 'Turn On GPS' dialogue
            this.askToTurnOnGPS();
          } else {
            // If not having permission ask for permission
            this.requestGPSPermission();
          }
        },
        err => {
          console.error(err);
        }
      );
  }

  requestGPSPermission() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (canRequest) {
        console.log('4');
      } else {
        // Show 'GPS Permission Request' dialogue
        this.androidPermissions
          .requestPermission(
            this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION
          )
          .then(
            () => {
              // call method to turn on GPS
              this.askToTurnOnGPS();
            },
            error => {
              // Show alert if user click on 'No Thanks'
              console.log(
                'requestPermission Error requesting location permissions ' +
                  error
              );
            }
          );
      }
    });
  }

  askToTurnOnGPS() {
    this.locationAccuracy
      .request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
      .then(
        () => {
          // When GPS Turned ON call method to get Accurate location coordinates
          // this.getLocationCoordinates()
          console.log('GPS Permission Provided');
        },
        error => {
          console.log(
            'Error requesting location permissions ' + JSON.stringify(error)
          );
          this.diagnostic.requestLocationAuthorization('GRANTED');
        }
      );
  }

  async getCurrentPosition() {
    console.log('GeoLocation Called');
    let geo_location: any;
    geo_location = await this.geolocation.getCurrentPosition();
    return geo_location;
  }
}
