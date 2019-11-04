import { FormControl } from '@angular/forms';
import construct = Reflect.construct;
import { HttpServiceService } from '../../http-service.service';


export class FarmerRegisterValidator {
  constructor(public http: HttpServiceService) {
  }

  static checkFirstName(control: FormControl): any {
    if (control.hasOwnProperty('_parent')) {
      if (control.value !== null) {
        if (control.value.length > 50) {
          return {'error': 'First Name Should not be Greater than 50'};
        } else {
          control._parent.controls.first_name.errors = {'valid': false};
        }
      }
    }
  }

  static checkLastName(control: FormControl): any {
    if (control.hasOwnProperty('_parent')) {
      if (control.value !== null) {
        if (control.value.length > 50) {
          return {'error': 'Last Name Should not be Greater than 50'};
        } else {
          control._parent.controls.last_name.errors = {'valid': false};
        }
      }
    }
  }

  static checkMobileNumber(control: FormControl): any {
    if (control.hasOwnProperty('_parent')) {
      if (control._parent.value.mobile !== null) {
        const mobile = Math.ceil(Math.log(control.value + 1) / Math.LN10);
        if (mobile > 10) {
          return {'error': 'Mobile Number Should not be Greater than 10'};
        } else if (mobile < 10) {
          return {'error': 'Mobile Number Should not be less than 10'};
        } else {
          control._parent.controls.mobile.errors = {'valid': false};
        }
      }
    }
  }
 
  static checkPincode(control: FormControl): any {
    if (control.hasOwnProperty('_parent')) {
      if (control._parent.value.pincode !== null) {
        const mobile = Math.ceil(Math.log(control.value + 1) / Math.LN10);
        if (mobile > 6) {
          return {'error': 'pincode Should not be Greater than 10'};
        } else if (mobile < 6) {
          return {'error': 'pincode Should not be less than 10'};
        } else {
          control._parent.controls.alternate_mobile.errors = {'valid': false};
        }
      }
    }
  }
}
