import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
export class OdoStartValidator {
  static checkOdoStart(control: FormControl): any {
    console.log('odo start custom validator');
    console.log(control.value);
    if (control.value === 0) {
      console.log('it is not valid start odo');
      return {'Odo Start Should not be 0': true};
    }

    if (control.hasOwnProperty('_parent')) {
      if (control._parent.value.end !== null) {
        console.log('ODO END NOT EMPTY');
        console.log(control);
        const odo_difference = control._parent.value.end - control.value;
        if (odo_difference >= 350) {
          console.log(odo_difference);
          control._parent.controls.end.errors = {'Odo should not greater than 350': true};
        } else if (odo_difference === 0) {
          return {'Odo start and end should not be same': true};
        } else if (odo_difference < 0) {
          return {'Odo end should be higher than start': true};
        } else {
          control._parent.controls.end.errors = {'valid': false};
          // control._parent.controls.end.valid = true;
        }

        // CHECK START SHOULD LESS THAN END
        // console.log(odo_difference);
        // if (odo_difference < 1) {
        //   console.log(control._parent.controls.end.valid);
        //   control._parent.controls.end.errors = {'Odo start should be greater than odo end': true};
        // } else {
        //   control._parent.controls.end.errors = {'valid': false};
        //   // control._parent.controls.end.valid = true;
        // }
      }

    }
  }



  static checkOdoEnd(control: FormControl): any {
    console.log('odo end custom validator');
    console.log(control);
    // console.log(control);
    // console.log(JSON.parse(control._parent));
    // console.log(control._parent.controls.start.value);
    if (control.value === 0) {
      console.log('it is not valid start odo');
      return {'Odo End Should not be 0': true};
    }

    // check morethan 350 condition
    if (control.hasOwnProperty('_parent')) {
      console.log(control._parent.value.start);

      if (control._parent.value.start !== null) {
        const odo_difference = control.value - control._parent.value.start;
        console.log(odo_difference);
        if (odo_difference >= 350) {
          return {'Odo should not greater than 350': true};
        } else if (odo_difference === 0) {
          return {'Odo start and end should not be same': true};
        } else if (odo_difference < 0) {
          return {'Odo end should be higher than start': true};
        }
      }

      // if (control.value !== null && control._parent.value.start !== null) {
      //   console.log('START AND END IS NTO EMPTY');
      //   const odo_difference = control.value - control._parent.value.start;
      //   console.log(odo_difference);
      //   if (odo_difference === 0) {
      //     control._parent.controls.end.errors = {'Odo start and end should not be same': true};
      //   } else {
      //     control._parent.controls.end.errors = {'valid': false};
      //   }
      // }

    }
  }
}