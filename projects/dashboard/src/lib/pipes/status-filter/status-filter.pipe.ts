import { Pipe, PipeTransform } from '@angular/core';

import { DatabaseItem } from '../../services/config/config.service';

@Pipe({
  name: 'statusFilter'
})
export class StatusFilterPipe implements PipeTransform {
  transform(items: DatabaseItem[], status?: string): DatabaseItem[] {
    return !status || status === 'all'
      ? items
      : items.filter(item => item.status === status);
  }
}
