import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filter'
})
export class FilterPipe implements PipeTransform {
    transform(items: [], search: string): any {
        if (!items) return [];

        if(!search) {
          return items;
        }

        return items.filter((item: any) => {
            return item.name.toLowerCase().includes(search.toLowerCase());
        });
    }
}
