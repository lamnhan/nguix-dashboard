import { Pipe, PipeTransform } from '@angular/core';

import { StorageItemWithUrlAndMetas } from '../../states/media/media.state';

@Pipe({
  name: 'mediaListingCounter'
})
export class MediaListingCounterPipe implements PipeTransform {
  transform(items: StorageItemWithUrlAndMetas[], counting: {total: number}): StorageItemWithUrlAndMetas[] {
    counting.total = items.length;
    return items;
  }
}
