import { Pipe, PipeTransform } from '@angular/core';

import { StorageItemWithUrlAndMetas } from '../../states/media/media.state';

@Pipe({
  name: 'mediaTypeFilter'
})
export class MediaTypeFilterPipe implements PipeTransform {
  transform(items: StorageItemWithUrlAndMetas[], type?: string): StorageItemWithUrlAndMetas[] {
    return !type || type === 'all'
      ? items
      : items.filter(item => !item.type || item.type === type);
  }
}
