import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFarmer'
})
export class SearchFarmerPipe implements PipeTransform {

  transform(farmers: any, search_term: string): any {
    console.log(search_term)
    if (farmers !== undefined && search_term !== undefined) {
    if ((search_term !== undefined || search_term !== null || search_term !== '') && farmers.length > 0) {
      return farmers.filter((farmer) => {
        // console.log(sowing['farmer_first_name']);
        if (farmer['village'] === null) {
          return farmer['firstname'].toLowerCase().indexOf(search_term.toLowerCase()) > -1 ||
              String(farmer['id']).toLowerCase().indexOf(search_term.toLowerCase()) > -1;
        } else {
          return farmer['firstname'].toLowerCase().indexOf(search_term.toLowerCase()) > -1 ||
              String(farmer['id']).toLowerCase().indexOf(search_term.toLowerCase()) > -1 ||
              farmer['village'].toLowerCase().indexOf(search_term.toLowerCase()) > -1;
        }
      });
    } else {
      console.log('within pipe else');
      return farmers;
    }
  }
  }

}
