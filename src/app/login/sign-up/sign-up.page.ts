import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {  AlertController,  LoadingController,  NavController,  ToastController} from '@ionic/angular';
import { HttpServiceService } from 'src/app/http-service.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss']
})
export class SignUpPage {
  sign_up_form: FormGroup;
  passwordType = 'password';
  passwordIcon = 'eye-off';
  districts: any;
  blocks: any;
  selected_district: any;
  sorted_block: any;
  states: any;
  selected_state: any;
  sorted_district: any;
  business_types: any;

  constructor(
    private formBuilder: FormBuilder,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private httpService: HttpServiceService,
    private toastCtrl: ToastController,
    private navCtrl: NavController
  ) {
    this.sign_up_form = this.formBuilder.group({
      business_name: [null, Validators.required],
      short_name: [null, Validators.required],
      business_type: [null, Validators.required],
      city: [null, Validators.required],
      street: [null, Validators.required],
      taluk: [null, Validators.required],
      district: [null, Validators.required],
      state: [null, Validators.required],
      pincode: [null, Validators.required],
      address: [null],
      mobile: [null, Validators.required],
      alternate_phone: [null],
      password: [null, Validators.required],
      password2: [null, Validators.required],
      email: [null, Validators.required],
      website: [null],
    });

    this.getSupportData();
  }

  getSupportData() {
    this.getBusinessTypes();
    this.getStateAndDistricts();
  }

  getBusinessTypes() {
    this.httpService.getBusinessTypes().subscribe((data) => {
      console.log(data);
      this.business_types = data;
    }, (error) => {
      console.log(error);
    });
  }

  getStateAndDistricts() {
    this.httpService.getStatesAndDistrticts().subscribe((data) => {
      console.log(data);
      this.states = data['states'];
      this.districts = data['districts'];
    }, (error) => {
      console.log(error);
    });
  }

  async mismatchAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Password Mismatch',
      subHeader: 'Enter the Password Correctly!',
      buttons: ['Dismiss'],
      backdropDismiss: false
    });
    await alert.present();
  }

  onStateChanged(state_id) {
    console.log(state_id);
    this.sign_up_form.reset({'district': null})
    this.selected_state = state_id;
    this.sorted_district = this.districts[this.selected_state];
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  async onRegisterUser() {
    // if (this.checkPassword()) {
      const mobile = this.sign_up_form.value['mobile'];
      const mobile_len = Math.max(Math.floor(Math.log10(Math.abs(mobile))), 0) + 1;
      // console.log(mobile_len);
      // if (mobile_len !== 10) {
      //   alert('Enter Valid Mobile Number');
      //   return false;
      // }
      const loading = await this.loadingCtrl.create({
        spinner: 'lines-small'
      });
      loading.present();
      console.log(this.sign_up_form.value);
      this.httpService.tempRegister(this.sign_up_form.value).subscribe(
        data => {
          console.log(data);
          if (data != null) {
          }
          this.confirmOTP(mobile);
          loading.dismiss();
          this.sign_up_form.reset();
        },
        error => {
          console.error(error);
          const detailed_error = error['error'];
          this.displayToast(detailed_error['detial'], 'top');
          console.log(detailed_error);
          loading.dismiss();
        }
      );
    // }
  }

  async confirmOTP(mobile_number) {
    const alert = await this.alertCtrl.create({
      header: 'Enter OTP!',
      inputs: [
        {
          name: 'otp',
          type: 'number',
          placeholder: 'Enter OTP'
        }
      ],
      backdropDismiss: false,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        },
        {
          text: 'Ok',
          handler: success_data => {
            console.log(success_data);
            const confirm_otp_dict = {};
            confirm_otp_dict['mobile'] = mobile_number;
            confirm_otp_dict['otp'] = success_data['otp'];
            console.log(confirm_otp_dict);
            this.httpService.confirmSignupOTP(confirm_otp_dict).subscribe(
              data => {
                console.log(data);
                this.displayToast(
                  'Registered Successfully! Try Login Now...',
                  'middle'
                );
                this.navCtrl.pop();
              },
              error => {
                console.error(error);
                const detailed_error = error['error'];
                console.log(detailed_error);
                this.errorMessage(JSON.stringify(detailed_error['detail']));
              }
            );
          }
        }
      ]
    });

    await alert.present();
  }

  async errorMessage(error_message) {
    const alert = await this.alertCtrl.create({
      header: 'Error while Register',
      subHeader: error_message,
      buttons: ['Dismiss'],
      backdropDismiss: false
    });
    await alert.present();
  }
  async displayToast(message, position) {
    const toast = await this.toastCtrl.create({
      message: message,
      position: position,
      duration: 2000
    });
    toast.present();
  }
}
