import { Pipe, PipeTransform } from '@angular/core';
import { StorageItem } from '@lamnhan/ngx-useful';

import { DashboardListingMediaType } from '../../services/dashboard/dashboard.service';

@Pipe({
  name: 'mediaExtractTypes'
})
export class MediaExtractTypesPipe implements PipeTransform {
  transform(items: StorageItem[]): DashboardListingMediaType[] {
    const all: DashboardListingMediaType = {
      title: 'All',
      value: 'all',
      count: 0
    };
    const image: DashboardListingMediaType = {
      title: 'Image',
      value: 'image',
      count: 0
    };
    const audio: DashboardListingMediaType = {
      title: 'Audio',
      value: 'audio',
      count: 0
    };
    const video: DashboardListingMediaType = {
      title: 'Video',
      value: 'video',
      count: 0
    };
    const document: DashboardListingMediaType = {
      title: 'Document',
      value: 'document',
      count: 0
    };
    const archive: DashboardListingMediaType = {
      title: 'Archive',
      value: 'archive',
      count: 0
    };
    const unknown: DashboardListingMediaType = {
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
