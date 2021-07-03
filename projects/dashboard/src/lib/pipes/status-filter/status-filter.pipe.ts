import { Pipe, PipeTransform } from '@angular/core';
import { DashboardListingItem } from '../../services/dashboard/dashboard.service';

@Pipe({
  name: 'statusFilter'
})
export class StatusFilterPipe implements PipeTransform {

  transform(items: DashboardListingItem[], status?: string): DashboardListingItem[] {
    return !status || status === 'all'
      ? items
      : items.filter(item => !!item);
  }

}
