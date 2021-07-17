import { Pipe, PipeTransform } from '@angular/core';

import { MediaItem } from '../../services/storage/storage.service';

@Pipe({
  name: 'mediaTypeFilter'
})
export class MediaTypeFilterPipe implements PipeTransform {
  transform(items: MediaItem[], type?: string): MediaItem[] {
    return !type || type === 'all'
      ? items
      : items.filter(item => !item.type || item.type === type);
  }
}
