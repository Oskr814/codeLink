import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
export default moment;

@Pipe({
    name: 'date'
})
export class DatePipe implements PipeTransform {
    transform(timestamp: Date, ...args: unknown[]): unknown {
        moment.locale('es');
        let date = moment(timestamp).format('LLL');
        return date;
    }
}
