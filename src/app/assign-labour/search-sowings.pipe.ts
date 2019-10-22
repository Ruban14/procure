import { Pipe, PipeTransform } from '@angular/core';

// import { forEach } from "@angular-devkit/schematics";

@Pipe({
  name: 'searchSowings'
})
export class SearchSowingsPipe implements PipeTransform {

  transform(sowings: any[], search_term: string): any {
    // console.log('search_term');
    // console.log(search_term);
    if ((search_term !== undefined || search_term !== null || search_term !== '') && sowings.length > 0) {
      return sowings.filter((sowing) => {
        // console.log(sowing['farmer_first_name']);
        if (sowing['sowing_village'] === null) {
          return sowing['farmer_first_name'].toLowerCase().indexOf(search_term.toLowerCase()) > -1 ||
              sowing['crop_name'].toLowerCase().indexOf(search_term.toLowerCase()) > -1;
        } else {
          return sowing['farmer_first_name'].toLowerCase().indexOf(search_term.toLowerCase()) > -1 ||
              sowing['crop_name'].toLowerCase().indexOf(search_term.toLowerCase()) > -1 ||
              sowing['sowing_village'].toLowerCase().indexOf(search_term.toLowerCase()) > -1;
        }
      });
    } else {
      console.log('within pipe else');
      return sowings;
    }
  }

}
