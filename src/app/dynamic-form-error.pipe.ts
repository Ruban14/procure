import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dynamicFormError'
})
export class DynamicFormErrorPipe implements PipeTransform {
  transform(errors: any): any {
    console.log('form pipe');
    // if (errors === null) {
    //   return 'valid';
    // }
    for (const error in errors) {
      console.log(error);
      return error;
    }
  }
}
