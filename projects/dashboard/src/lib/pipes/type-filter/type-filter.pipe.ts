import { Pipe, PipeTransform } from '@angular/core';
import { DashboardListingItem } from '../../services/dashboard/dashboard.service';

@Pipe({
  name: 'typeFilter'
})
export class TypeFilterPipe implements PipeTransform {
  transform(items: DashboardListingItem[], type?: string): DashboardListingItem[]{
    return !type
      ? items
      : items.filter(item => item.origin.type === type);
  }
}
