import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'procure'
})
export class ProcurePipe implements PipeTransform {

  transform(date: any): any {
    console.log(date);
    const diff = Math.abs(new Date().getTime() - new Date(date).getTime());
    return String(Math.ceil(diff / (1000 * 3600 * 24))) + ' Days Old';
  }

}
