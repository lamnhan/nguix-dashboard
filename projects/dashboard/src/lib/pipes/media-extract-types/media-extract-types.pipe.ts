import { Pipe, PipeTransform } from '@angular/core';
import { StorageItem } from '@lamnhan/ngx-useful';

import { ListingGrouping } from '../../services/config/config.service';

@Pipe({
  name: 'mediaExtractTypes'
})
export class MediaExtractTypesPipe implements PipeTransform {
  transform(items: StorageItem[]): ListingGrouping[] {
    const all: ListingGrouping = {
      title: 'All',
      value: 'all',
      count: 0
    };
    const image: ListingGrouping = {
      title: 'Image',
      value: 'image',
      count: 0
    };
    const audio: ListingGrouping = {
      title: 'Audio',
      value: 'audio',
      count: 0
    };
    const video: ListingGrouping = {
      title: 'Video',
      value: 'video',
      count: 0
    };
    const document: ListingGrouping = {
      title: 'Document',
      value: 'document',
      count: 0
    };
    const archive: ListingGrouping = {
      title: 'Archive',
      value: 'archive',
      count: 0
    };
    const unknown: ListingGrouping = {
      title: 'Unknown',
      value: 'unknown',
      count: 0
    };
    // counting
    items.forEach(item => {
      const { type } = item;
      if (type === 'image') {
        image.count++;
      } else if (type === 'audio') {
        audio.count++;
      } else if (type === 'video') {
        video.count++;
      } else if (type === 'document') {
        document.count++;
      } else if (type === 'archive') {
        archive.count++;
      } else if (type === 'unknown') {
        unknown.count++;
      }
      all.count++;
    });
    // result
    return [all, image, audio, video, document, archive, unknown];
  }
}
