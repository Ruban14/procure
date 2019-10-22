import { ProcessedProductToStorePage } from './../../storage/processed-product-to-store/processed-product-to-store.page';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpServiceService } from '../../http-service.service';
import { PopUpProcessPage } from '../pop-up-process/pop-up-process.page';
import { ModalController, IonSlides, ToastController, LoadingController, NavController } from '@ionic/angular';
import * as moment from 'moment';

@Component({
  selector: 'app-batch-processing',
  templateUrl: './batch-processing.page.html',
  styleUrls: ['./batch-processing.page.scss'],
})
export class BatchProcessingPage implements OnInit {
    // slides options
    @ViewChild('slider', {'static' : false}) slides: IonSlides;
    slideOpts = {
      effect: 'flip',
      allowTouchMove: false
    };
  process_list: any = [];
  current_process_list: any = [];
  disable_reorder: boolean = true;
  process_check_list: any = [];
  batch_id: any;
  crop_id: any;
  footerIsHidden: boolean = false;
  current_process_object: any = null;
  process_questions: any;
  process_answers: any = [];
  dropdown_value: any = null;
  batch_obj: any = null;
  process_start_date: any = null;
  process_end_date: any = null;
  processed_products: any = null;

  constructor(private activatedRoute: ActivatedRoute, private httpService: HttpServiceService, private modalController: ModalController, private toastCtrl: ToastController,
    private loadingCtrl: LoadingController, private navCtrl: NavController) {
  }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    let loading = await this.loadingCtrl.create({
      animated: true,
      spinner: 'lines-small',
    });
    this.batch_id = this.activatedRoute.snapshot.paramMap.get('batch_id');
    this.crop_id = this.activatedRoute.snapshot.paramMap.get('crop_id');
    let data_dict = { batch_id: this.batch_id, crop_id: this.crop_id };
    this.process_check_list = [];
    this.current_process_list = [];
    this.process_list = [];

    loading.present();

    this.activatedRoute.queryParams.subscribe((data) => {
      this.batch_obj = data;
      if (this.batch_obj['status'] == 'Completed') this.footerIsHidden = true;
    }, (error) => {
      console.error(error);
    });
    console.log(this.batch_obj);

    this.httpService.getProcessByBatch(data_dict).subscribe((data) => {
      console.log(data);
      this.current_process_list = data['assigned_process'];
      this.process_list = data['all_process'];

      loading.dismiss();

      data['assigned_process'].forEach(element => {
        if (element.is_completed) {
          this.process_check_list.push({ isChecked: true });
        } else {
          this.process_check_list.push({ isChecked: false });
        }
      });

    }, (error) => {
      loading.dismiss();
      console.error(error);
    });
  }

  onUpdate() {
    console.log(this.current_process_list);
    let final_process_update = {};
    final_process_update['batch_id'] = this.batch_id;
    final_process_update['process'] = [];

    this.current_process_list.forEach((element, index) => {
      element['ordinal'] = index;
      final_process_update['process'].push(element);
    });
    console.log(final_process_update);
    if (final_process_update['process'].length == 0) {
      return false;
    }
    // this.httpService.assignProcessToBatch(final_process_update).subscribe((data) => {
    //   console.log(data);
    //   this.displayToast('Batch Process added/Updated!');
    // }, (error) => {
    //   console.error(error);
    // });
  }

  toggleDisable() {
    this.disable_reorder = !this.disable_reorder;
  }

  async reorderItems(event) {
    let loading = await this.loadingCtrl.create({
      animated: true,
      spinner: 'bubbles',
    });
    let list_ordinal = event.detail;
    let itemToMove = this.current_process_list.splice(event.detail.from, 1)[0];
    itemToMove['ordinal'] = event.detail.to;
    this.current_process_list.splice(event.detail.to, 0, itemToMove);
    let check_box_item = this.process_check_list.splice(event.detail.from, 1)[0];
    this.process_check_list.splice(event.detail.to, 0, check_box_item);

    console.log(itemToMove);

    let rearrange_process = {};
    rearrange_process['batch_map_id'] = itemToMove.batch_process_map_id;
    rearrange_process['from_ordinal'] = list_ordinal.from + 1;
    rearrange_process['to_ordinal'] = list_ordinal.to + 1;
    console.log(rearrange_process);

    loading.present();

    this.httpService.rearrangeProcessForBatch(rearrange_process).subscribe((data) => {
      console.log(data);
      this.displayToast('Batch Process Updated!');
      loading.dismiss();
    }, (error) => {
      console.error(error);
      loading.dismiss();
      this.displayToast('Error while Re-arranging!')
      let itemToMove = this.current_process_list.splice(event.detail.to, 1)[0];
      itemToMove['ordinal'] = event.detail.from;
      this.current_process_list.splice(event.detail.from, 0, itemToMove);
      let check_box_item = this.process_check_list.splice(event.detail.to, 1)[0];
      this.process_check_list.splice(event.detail.from, 0, check_box_item);
    });
  }

  onProcessItemClicked(process) {
    console.log(process);
    this.presentModal(process);
  }

  async onRemoveClicked(current_process_index, batch_process_map_id) {
    let batch_map_dict = {
      batch_process_map_id: batch_process_map_id
    }

    let confirm_delete: boolean = false;
    confirm_delete = confirm('Are you sure want to delete?');
    console.log(confirm_delete);
    if (confirm_delete) {
      let loading = await this.loadingCtrl.create({
        animated: true,
        spinner: 'bubbles',
      });
      loading.present();
      this.httpService.removeProcessFrombatch(batch_map_dict).subscribe((data) => {
        console.log(data);
        loading.dismiss();
        this.current_process_list.splice(current_process_index, 1);
        this.process_check_list.splice(current_process_index, 1);
        this.displayToast('Process Removed successfully');
      }, (error) => {
        loading.dismiss();
        console.error(error);
        this.displayToast('Error while removing the Process!');
      });
    }
  }

  async onCurrentProcessClicked(current_process) {
    let data_dict = {
      process_id: current_process.process_id,
      batch_process_map_id: current_process['batch_process_map_id']
    }
    console.log(data_dict);
    this.current_process_object = current_process;
    console.log(this.current_process_object);
    this.footerIsHidden = true;
    let loading = await this.loadingCtrl.create({
      animated: true,
      message: 'Please wait... While we collect the Process Questions',
      spinner: 'bubbles',
    });
    loading.present();
    this.process_questions = [];
    this.process_answers = [];
    this.process_start_date = null;
    this.process_end_date = null;
    this.httpService.getProcessQuestion(data_dict).subscribe((data) => {
      this.slideTo(1);
      console.log(data);
      this.dropdown_value = null;
      this.process_questions = data;
      loading.dismiss();
      if (this.process_questions[0].hasOwnProperty('batch_process_map_id')) {
        this.process_start_date = this.process_questions[0]['batch_process_map_start_date'];
        this.process_end_date = this.process_questions[0]['batch_process_map_end_date'];
        console.log(this.process_start_date);
        console.log(this.process_end_date);
        this.process_questions.forEach((element) => {
          if (element.question_type == 'checkbox') {
            this.process_answers.push({ question_id: element.question_id, answer: '', batch_process_map_property_log_id: element.batch_process_map_property_log_id });
          } else {
            this.process_answers.push({ question_id: element.question_id, answer: element.selected_answer, batch_process_map_property_log_id: element.batch_process_map_property_log_id });
          }
        });
      } else {
        this.process_questions.forEach((element) => {
          this.process_answers.push({ question_id: element.id, answer: '' });
        });
      }
      console.log(this.process_answers);
    }, (error) => {
      loading.dismiss();
      console.error(error);
    });

    this.httpService.serveProcessedProductByProcess({ 'process_id': current_process.process_id }).subscribe((data) => {
      console.log(data);
      this.processed_products = data;
    }, (error) => {
      console.error(error);
    });
  }

  async presentModal(process) {
    const modal = await this.modalController.create({
      component: PopUpProcessPage,
      componentProps: {
        value: process
      },
      cssClass: 'inset-modal'
    });
    modal.onWillDismiss().then((data) => {
      console.log(data);
      if (data['data'] != null || data['data'] != undefined) {
        console.log(data['data']);
        data['data']['batch_id'] = this.batch_id;
        this.httpService.assignIndividualProcessToBatch(data['data']).subscribe((success) => {
          console.log(success);
          this.displayToast('Batch Process Updated!');
          this.current_process_list.push(success);
          this.process_check_list.push({ isChecked: false });
        }, (error) => {
          console.error(error);
        });
      }
    }).catch((error) => {
      console.error(error)
    });
    return await modal.present();
  }

  async displayToast(message) {
    const toast = await this.toastCtrl.create({
      message: message,
      position: 'top',
      duration: 2000
    });
    toast.present();
  }

  slideTo(slide_index: number) {
    this.slides.slideTo(slide_index);
    if (slide_index == 0) {
      this.footerIsHidden = false;
      if (this.batch_obj['status'] == 'Completed') this.footerIsHidden = true;
    }
  }

  async onProcessAnswerUpdate() {
    let loading = await this.loadingCtrl.create({
      animated: true,
      spinner: 'bubbles',
    });
    loading.present();
    let data_dict = {}
    data_dict['batch_process_map_id'] = this.current_process_object['batch_process_map_id'];
    data_dict['process_answers'] = this.process_answers;
    if (this.process_start_date != null) {
      if (this.process_start_date.hasOwnProperty('year')) {
        console.log(this.process_start_date);
        this.process_start_date = this.process_start_date['year']['value'] + '-' + this.process_start_date['month']['value'] + '-' + this.process_start_date['day']['value'] + ' ' + this.process_start_date['hour']['value'] + ':' + this.process_start_date['minute']['value'];
      }
      if (this.process_end_date.hasOwnProperty('year')) {
        console.log(this.process_end_date);
        this.process_end_date = this.process_end_date['year']['value'] + '-' + this.process_end_date['month']['value'] + '-' + this.process_end_date['day']['value'] + ' ' + this.process_end_date['hour']['value'] + ':' + this.process_end_date['minute']['value'];
      }
      data_dict['process_start_date'] = this.process_start_date;
      data_dict['process_end_date'] = this.process_end_date;
    }
    console.log(data_dict);
    this.httpService.saveProcessAnswer(data_dict).subscribe((data) => {
      console.log(data);
      loading.dismiss();
      this.slideTo(0);
      this.displayToast('Process Answers Saved!');
    }, (error) => {
      console.error(error);
      loading.dismiss();
      let detailed_error = error.error
      alert(detailed_error.message);
      this.displayToast('Error while saving answers!');
    });
  }

  onBatchStart() {
    let confirm_start: boolean = false;
    confirm_start = confirm('Are you sure? This Batch will be Marked as Started!');
    if (confirm_start) {
      let batch_start_data = {};
      batch_start_data['batch_id'] = this.batch_obj.id;
      batch_start_data['start_date'] = moment(new Date().toISOString()).format('DD-MM-YYYY HH:mm');
      console.log(batch_start_data);
      this.httpService.recordStartEndForBatch(batch_start_data).subscribe((data) => {
        console.log(data);
        this.displayToast('Start Date Recorded!');
        this.batch_obj = Object.assign({}, this.batch_obj, { start_date: batch_start_data['start_date'], status: 'In Progress' });
      }, (error) => {
        console.error(error);
        this.displayToast('Error While updating!');
      });
    }
  }

  onBatchEnd() {
    let confirm_end: boolean = false;
    confirm_end = confirm('Are you sure? This Batch will be Marked as Ended!');
    if (confirm_end) {
      let batch_end_data = {};
      batch_end_data['batch_id'] = this.batch_obj.id;
      batch_end_data['end_date'] = moment(new Date().toISOString()).format('DD-MM-YYYY HH:mm');
      console.log(batch_end_data);
      this.httpService.recordStartEndForBatch(batch_end_data).subscribe((data) => {
        console.log(data);
        this.displayToast('End Date Recorded!');
        this.batch_obj = Object.assign({}, this.batch_obj, { end_date: batch_end_data['end_date'], status: 'Completed' });
        if (this.batch_obj['status'] == 'Completed') this.footerIsHidden = true;
      }, (error) => {
        console.error(error);
        let detailed_error = error.error
        alert(detailed_error.message);
        this.displayToast('Error While Updating!');
      });
    }
  }

  onCompleteClicked(process_check_list_index) {
    // console.log(process_check_list_index);
    let confirm_complete: boolean = false;
    confirm_complete = confirm('Are you sure? This Process will be Marked as Completed!');
    if (confirm_complete) {
      console.log(this.current_process_list[process_check_list_index]);
      let process_dict = {
        batch_process_map_id: this.current_process_list[process_check_list_index]['batch_process_map_id']
      };
      this.httpService.markProcessAsComplete(process_dict).subscribe((data) => {
        console.log(data)
        this.displayToast('Process is Marked as Completed!');
        this.current_process_list[process_check_list_index]['is_completed'] = true;
        this.process_check_list[process_check_list_index]['isChecked'] = true;
      }, (error) => {
        console.error(error)
        this.displayToast('Error While Updating');
        this.current_process_list[process_check_list_index]['is_completed'] = false;
        this.process_check_list[process_check_list_index]['isChecked'] = false;
      });
    }
  }

  checkboxAnswerChecked(process_index: number, answer: any) {
    if (this.process_answers[process_index]['answer'].includes(answer)) {
      console.log('Avl.');
      this.process_answers[process_index]['answer'] = this.process_answers[process_index]['answer'].replace(answer + ', ', '');
    } else {
      console.log('Not Avl.');
      this.process_answers[process_index]['answer'] += answer + ', ';
    }
    console.log(this.process_answers[process_index]);
  }

  onHomeIconClicked() {
    this.navCtrl.navigateBack('auth/app/tabs/tab1');
  }

  async processedProductToStorage() {
    let data_dict = {
      'batch_id': this.batch_id,
      'crop_id': this.crop_id,
      'processed_products': this.processed_products
    }
    const modal = await this.modalController.create({
      component: ProcessedProductToStorePage,
      cssClass: 'processed-product-modal',
      componentProps: {
        value: data_dict
      },
    });
    modal.onWillDismiss().then((data) => {
      console.log(data);
      if (data['data'] != null || data['data'] != undefined) {
        console.log(data['data']);
      }
    }).catch((error) => {
      console.error(error)
    });
    return await modal.present();
  }
}
