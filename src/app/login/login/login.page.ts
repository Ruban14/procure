import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { HttpServiceService } from 'src/app/http-service.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

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
    private authendicationService: AuthenticationService
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
    this.login_form.reset();
    // this.navCtrl.navigateRoot('/app/tabs/(home:home)');
  }

  ngOnInit() { }
}
