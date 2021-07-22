import { Pipe, PipeTransform } from '@angular/core';
import { MediaItem } from '@lamnhan/ngx-useful';

@Pipe({
  name: 'mediaQueryFilter'
})
export class MediaQueryFilterPipe implements PipeTransform {
  transform(items: MediaItem[], query?: string): MediaItem[] {
    return !query
      ? items
      : items.filter(item => item.name.indexOf(query) !== -1);
  }
}
