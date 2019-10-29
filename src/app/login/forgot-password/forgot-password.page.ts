import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { GlobalService } from 'src/app/global.service';
import { DataTransferService } from 'src/app/provider/data-transfer.service';
import { HttpServiceService } from 'src/app/http-service.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss']
})
export class ForgotPasswordPage implements OnInit {
  otp_session = true;
  password_reset_session = false;
  new_pass_type: any = 'password';
  confirm_pass_type: any = 'password';
  confirm_pass: any;
  new_pass: any;
  alert: any;
  otp: any;
  user_id: any;
  user_details: any;

  constructor(
    private httpService: HttpServiceService,
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private dataTransfer: DataTransferService,
    private global: GlobalService
  ) {
    this.user_id = this.activatedRoute.snapshot.paramMap.get('user_id');
    this.user_details = this.dataTransfer.user_details;
    this.user_details['mobile'] = String(this.user_details['mobile']);
    console.log(this.user_details);
  }

  navToPasswordReset() {
    const data_dict = {
      otp: this.otp,
      user_id: this.user_id
    };
    this.httpService.otpValidation(data_dict).subscribe(
      data => {
        console.log(data);
        this.otp_session = false;
        this.password_reset_session = true;
      },
      error => {
        console.log(error);
        const error_messge = error.error;
        this.otp = null;
        alert(error_messge.message);
      }
    );
  }

  confirmPassword() {
    console.log(this.confirm_pass);
    if (this.confirm_pass !== this.new_pass) {
      this.alert = '*passwords does not match';
    } else {
      this.alert = '';
    }
    if (this.confirm_pass === '') {
      this.alert = '';
    }
  }

  showNewPassword() {
    if (this.new_pass_type === 'password') {
      this.new_pass_type = 'text';
    } else {
      this.new_pass_type = 'password';
    }
  }

  showConfirmPassword() {
    if (this.confirm_pass_type === 'password') {
      this.confirm_pass_type = 'text';
    } else {
      this.confirm_pass_type = 'password';
    }
  }

  savePassword() {
    if (this.new_pass === this.confirm_pass) {
      const data_dict = {
        user_id: this.user_id,
        raw_password: this.new_pass
      };
      this.httpService.resetPassword(data_dict).subscribe(data => {
        this.navCtrl.pop();
        this.global.displayToast(
          'Your password has been changed successfully!, Now you can login',
          'middle',
          2000
        );
      });
    }
  }

  ngOnInit() {}
}
