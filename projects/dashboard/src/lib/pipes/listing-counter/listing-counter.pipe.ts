import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'listingCounter'
})
export class ListingCounterPipe implements PipeTransform {
  transform(items: any[], counting: {total: number}): any[] {
    counting.total = items.length;
    return items;
  }
}
