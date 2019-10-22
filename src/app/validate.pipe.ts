import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'validate'
})
export class ValidatePipe implements PipeTransform {

  transform(value: any, validate_type): any {
    console.log('color pipe');
    if (validate_type === 'is_not_empty_dict') {
      return Object.keys(value).length !== 0;
    }
  }

}
