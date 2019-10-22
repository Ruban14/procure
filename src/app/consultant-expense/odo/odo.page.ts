import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OdoStartValidator} from './odo-validate';

@Component({
  selector: 'app-odo',
  templateUrl: './odo.page.html',
  styleUrls: ['./odo.page.scss'],
})
export class OdoPage {
  public odo_form: FormGroup;
  constructor(public formBuilder: FormBuilder) {
    this.odo_form = this.formBuilder.group({
      start: [null, Validators.compose([OdoStartValidator.checkOdoStart
      ])],
      end: [null, Validators.compose([OdoStartValidator.checkOdoEnd
      ])],
    });
    console.log(this.odo_form.controls.start.errors);
    console.log(this.odo_form.controls.errors);
  }

}
