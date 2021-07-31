import { Pipe, PipeTransform } from '@angular/core';
import { StorageItem } from '@lamnhan/ngx-useful';

@Pipe({
  name: 'mediaListingCounter'
})
export class MediaListingCounterPipe implements PipeTransform {
  transform(items: StorageItem[], counting: {total: number}): StorageItem[] {
    counting.total = items.length;
    return items;
  }
}
