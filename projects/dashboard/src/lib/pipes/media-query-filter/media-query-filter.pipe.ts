import { Pipe, PipeTransform } from '@angular/core';

import { StorageItemWithUrlAndMetas } from '../../states/media/media.state';

@Pipe({
  name: 'mediaQueryFilter'
})
export class MediaQueryFilterPipe implements PipeTransform {
  transform(items: StorageItemWithUrlAndMetas[], query?: string): StorageItemWithUrlAndMetas[] {
    return !query
      ? items
      : items.filter(item => item.name.indexOf(query) !== -1);
  }
}
