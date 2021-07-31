import { Pipe, PipeTransform } from '@angular/core';
import { StorageItem } from '@lamnhan/ngx-useful';

@Pipe({
  name: 'mediaQueryFilter'
})
export class MediaQueryFilterPipe implements PipeTransform {
  transform(items: StorageItem[], query?: string): StorageItem[] {
    return !query
      ? items
      : items.filter(item => item.name.indexOf(query) !== -1);
  }
}
