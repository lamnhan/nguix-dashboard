import { Pipe, PipeTransform } from '@angular/core';
import { DashboardListingItem } from '../../services/dashboard/dashboard.service';

@Pipe({
  name: 'listingCounter'
})
export class ListingCounterPipe implements PipeTransform {
  transform(items: DashboardListingItem[], counting: {total: number}): DashboardListingItem[] {
    counting.total = items.length;
    return items;
  }
}
