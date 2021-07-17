import { Pipe, PipeTransform } from '@angular/core';

import { DashboardListingItem, DashboardListingStatus } from '../../services/dashboard/dashboard.service';

@Pipe({
  name: 'extractStatuses'
})
export class ExtractStatusesPipe implements PipeTransform {
  transform(items: DashboardListingItem[]): DashboardListingStatus[] {
    const all: DashboardListingStatus = {
      title: 'All',
      value: 'all',
      count: 0
    };
    const published: DashboardListingStatus = {
      title: 'Published',
      value: 'publish',
      count: 0
    };
    const draft: DashboardListingStatus = {
      title: 'Draft',
      value: 'draft',
      count: 0
    };
    const archive: DashboardListingStatus = {
      title: 'Archive',
      value: 'archive',
      count: 0
    };
    const trash: DashboardListingStatus = {
      title: 'Trash',
      value: 'trash',
      count: 0
    };
    // counting
    items.forEach(item => {
      const { origin } = item;
      if (origin.status === 'publish') {
        published.count++;
      } else if (origin.status === 'draft') {
        draft.count++;
      } else if (origin.status === 'archive') {
        archive.count++;
      } else if (origin.status === 'trash') {
        trash.count++;
      }
      all.count++;
    });
    // result
    return [all, published, draft, archive, trash];
  }
}
