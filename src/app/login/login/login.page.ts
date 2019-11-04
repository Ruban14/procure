import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NavController, AlertController } from '@ionic/angular';
import { HttpServiceService } from 'src/app/http-service.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DataTransferService } from '../../provider/data-transfer.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {

  public login_form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    private httpService: HttpServiceService,
    private authendicationService: AuthenticationService,
    private alertController: AlertController,
    private dataTrasfer: DataTransferService,
  ) {
    this.login_form = this.formBuilder.group({
      user_name: ['', Validators.compose([Validators.required])],
      password: [null, Validators.required]
    });
  }

  logIn() {
    if (!this.login_form.valid) {
      alert('Form is not valid');
      return false;
    }
    console.log(this.login_form.value);
    this.httpService.login(this.login_form.value).subscribe((data) => {
      console.log(data);
    }, (error) => {
      console.error(error);
    });
  }

  onLoginClicled() {
    this.authendicationService.login(this.login_form.value);
    // this.navCtrl.navigateRoot('/app/tabs/(home:home)');
  }

  // on clicking forgot password
  // password reset
  async forgetPassword() {
    const alert_obj = await this.alertController.create({
      header: 'Enter your registered phone number to reset your password',
      inputs: [{
        name: 'user_name',
        type: 'text',
        value: '',
      }],
      backdropDismiss: false,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (value) => {
            if (value['user_name'] === '') {
              alert('please enter registered phone number');
              return false;
            }
            console.log(value);
            this.navPage(value);
          }
        }
      ]
    });
    await alert_obj.present();
  }

  // navigates to the recovery page if the user is valid
  navPage(user_dict) {
    this.httpService.usernameValidation(user_dict).subscribe(
      data => {
        console.log(data);
        if (data === 'user does not exist') {
          // this.global.displayToast('user does not exist', 'middle',3000);
          alert('incorrect phone number!');
        } else {
          this.navCtrl.navigateForward('forgot-password/' + data['user_id']);
          this.dataTrasfer.userDetailsInPasswordReser(data);
        }
      },
      error => {
        console.error(error);
        const error_messge = error.error;
        alert(error_messge.message);
      }
    );
  }

  // navigates to business register page
  onSignup() {
    this.navCtrl.navigateForward('sign-up');
  }

  ngOnInit() { }
}
