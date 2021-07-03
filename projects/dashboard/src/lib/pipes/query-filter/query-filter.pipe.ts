import { Pipe, PipeTransform } from '@angular/core';
import { DashboardListingItem } from '../../services/dashboard/dashboard.service';

@Pipe({
  name: 'queryFilter'
})
export class QueryFilterPipe implements PipeTransform {

  transform(items: DashboardListingItem[], query?: string): DashboardListingItem[] {
    return !query
      ? items
      : items.filter(item => !!item);
  }

}
