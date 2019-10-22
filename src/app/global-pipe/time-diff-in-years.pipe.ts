import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeDiffInYears'
})
export class TimeDiffInYearsPipe implements PipeTransform {

  transform(sowing_date: any, args?: any): any {
    const this_year = new Date().getFullYear();
    const that_year = new Date(sowing_date).getFullYear();
    const age = this_year - that_year;
    return String(age) + ' Years Old';
  }

}
