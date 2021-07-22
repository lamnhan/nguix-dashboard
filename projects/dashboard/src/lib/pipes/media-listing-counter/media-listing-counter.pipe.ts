import { Pipe, PipeTransform } from '@angular/core';
import { MediaItem } from '@lamnhan/ngx-useful';

@Pipe({
  name: 'mediaListingCounter'
})
export class MediaListingCounterPipe implements PipeTransform {
  transform(items: MediaItem[], counting: {total: number}): MediaItem[] {
    counting.total = items.length;
    return items;
  }
}
