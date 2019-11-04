import { FormControl } from '@angular/forms';
import construct = Reflect.construct;
import { HttpServiceService } from '../../http-service.service';


export class BusinessRegisterValidator {
  constructor(public http: HttpServiceService) {
  }

  static checkBusinessName(control: FormControl): any {
    if (control.hasOwnProperty('_parent')) {
      if (control._parent.value.name !== null) {
        if (control.value.length > 100) {
          return {'error': 'First Name Should not be Greater than 100 letters'};
        } else {
          control._parent.controls.name.errors = {'valid': false};
        }
      }
    }
  }
  static checkShortName(control: FormControl): any {
    if (control.hasOwnProperty('_parent')) {
      if (control._parent.value.short_name !== null) {
        if (control.value.length > 50) {
          return {'error': 'First Name Should not be Greater than 50 letters'};
        } else {
          control._parent.controls.short_name.errors = {'valid': false};
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

  static checkAlternateMobileNumber(control: FormControl): any {
    if (control.hasOwnProperty('_parent')) {
      if (control._parent.value.alternate_mobile !== null) {
        const mobile = Math.ceil(Math.log(control.value + 1) / Math.LN10);
        if (mobile > 10) {
          return {'error': 'Mobile Number Should not be Greater than 10'};
        } else if (mobile < 10) {
          return {'error': 'Mobile Number Should not be less than 10'};
        } else {
          control._parent.controls.alternate_mobile.errors = {'valid': false};
        }
      }
    }
  }

  static checkPincode(control: FormControl): any {
    if (control.hasOwnProperty('_parent')) {
      if (control._parent.value.pincode !== null) {
        const mobile = Math.ceil(Math.log(control.value + 1) / Math.LN10);
        if (mobile > 6) {
          return {'error': 'Pincode Should not be Greater than 6'};
        } else if (mobile < 6) {
          return {'error': 'Pincode Should not be less than 6'};
        } else {
          control._parent.controls.mobile.errors = {'valid': false};
        }
      }
    }
  }
}
