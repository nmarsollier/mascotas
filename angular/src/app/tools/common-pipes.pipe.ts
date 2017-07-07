import { Pipe, PipeTransform } from '@angular/core';
import { DateModel } from 'ng2-datepicker';
import * as moment from 'moment';

/*
 * Dado que ng2-datepicker no permite poner como valor un string
 * hacemos este pipe que convierte de string a DateModel, que es el objeto que 
 * entiende.
 */
@Pipe({
  name: 'datePicker'
})
export class DatePickerPipe implements PipeTransform {

  transform(value: string, args?: any): any {
    return new DateModel(this.toIDateModel(value));
  }
  
  private toIDateModel(value: string): any {
    let d = moment(value, "DD/MM/YYYY");
    return {
        day: d.date(),
        month: d.month(),
        year: d.year(),
        formatted: value,
        momentObj: d
    }
  }
}

