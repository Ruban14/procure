import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'gradeChannelFilter'
})
export class GradeChannelFilterPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

}
