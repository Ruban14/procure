import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpServiceService } from '../../http-service.service';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { ModalController, NavParams, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-add-procure-expense',
  templateUrl: './add-procure-expense.page.html',
  styleUrls: ['./add-procure-expense.page.scss'],
})
export class AddProcureExpensePage {
  expense_form: FormGroup;
  expense_types: any = [];

  constructor(public formBuilder: FormBuilder, private httpService: HttpServiceService, private datePicker: DatePicker,
              private navParams: NavParams, private modalCtrl: ModalController, private toastCtrl: ToastController) {
    console.log('add expense page');
    this.expense_form = this.formBuilder.group({
      procurement_id: [this.navParams.data['procurement_id'], Validators.compose([])],
      type_id: [null, Validators.compose([Validators.required])],
      date: [null, Validators.compose([Validators.required])],
      amount: [null, Validators.compose([Validators.required])],
    });
    this.getProcurementExpenses();
    // console.log(this.navParams.data);
    // console.log(this.navParams.data['procurement_id']);
    // console.log(this.navParams.get('procurment_id'));
  }

  getProcurementExpenses() {
    this.httpService.getExpenseTypes().subscribe((data) => {
      console.log(data);
      this.expense_types = data;
    }, (error) => {
      console.log(error);
    });
  }

  // showDate() {
  //   let min_date = new Date();
  //   // min_date.setDate(min_date.getDate() - 5);
  //   this.datePicker.show({
  //     date: new Date(),
  //     mode: 'date',
  //     minDate: min_date,
  //     androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT
  //   }).then(
  //       (date) => {
  //         console.log('Got date: ', date);
  //         this.expense_date = date;
  //       },
  //       err => console.log('Error occurred while getting date: ', err)
  //   );
  // }

  closePopup() {
    this.modalCtrl.dismiss();
  }

  addProcurementExpense() {
    const data_dict = Object.assign({}, this.expense_form.value);
    data_dict['date'] = this.expense_form.value['date']['year']['value'] + '-' + this.expense_form.value['date']['month']['value'] + '-' + this.expense_form.value['date']['day']['value'];
    this.httpService.addProcurementExpense(data_dict).subscribe((data) => {
      console.log(data);
      this.modalCtrl.dismiss({
        status: 'success', sowing_id: this.navParams.data['sowing_id']
      });
      this.displayToast('Expense added successfully', 'top');
    }, (error) => {
      console.log(error);
    });
  }


  async displayToast(message, position) {
    const toast = await this.toastCtrl.create({
      message: message,
      position: 'top',
      duration: 3000
    });
    toast.present();
  }

}
