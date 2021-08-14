import { Pipe, PipeTransform } from '@angular/core';

import { DatabaseItem, ListingGrouping } from '../../services/config/config.service';

@Pipe({
  name: 'extractStatuses'
})
export class ExtractStatusesPipe implements PipeTransform {
  transform(items: DatabaseItem[]): ListingGrouping[] {
    const all: ListingGrouping = {
      title: 'All',
      value: 'all',
      count: 0
    };
    const published: ListingGrouping = {
      title: 'Published',
      value: 'publish',
      count: 0
    };
    const draft: ListingGrouping = {
      title: 'Draft',
      value: 'draft',
      count: 0
    };
    const archive: ListingGrouping = {
      title: 'Archive',
      value: 'archive',
      count: 0
    };
    const trash: ListingGrouping = {
      title: 'Trash',
      value: 'trash',
      count: 0
    };
    // counting
    items.forEach(item => {
      const { status } = item;
      if (status === 'publish') {
        published.count++;
      } else if (status === 'draft') {
        draft.count++;
      } else if (status === 'archive') {
        archive.count++;
      } else if (status === 'trash') {
        trash.count++;
      }
      all.count++;
    });
    // result
    return [all, published, draft, archive, trash];
  }
}
