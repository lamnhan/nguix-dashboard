import { Pipe, PipeTransform } from '@angular/core';
import { StorageItem } from '@lamnhan/ngx-useful';

@Pipe({
  name: 'mediaTypeFilter'
})
export class MediaTypeFilterPipe implements PipeTransform {
  transform(items: StorageItem[], type?: string): StorageItem[] {
    return !type || type === 'all'
      ? items
      : items.filter(item => !item.type || item.type === type);
  }
}
