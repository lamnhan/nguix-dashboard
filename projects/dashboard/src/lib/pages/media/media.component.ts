import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { map, tap } from 'rxjs/operators';
import { StorageItem } from '@lamnhan/ngx-useful';

import { GetMedia, DeleteUpload } from '../../states/media/media.state';

@Component({
  selector: 'nguix-dashboard-media-page',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})
export class MediaPage implements OnInit {

  public readonly page$ = this.route.params.pipe(
    map(params => {
      return { ok: true };
    }),
    tap(() => {
      this.store.dispatch(new GetMedia(true));
    }),
  );

  public readonly data$ = this.store.select(state => state.media).pipe(
    map(media => {
      const listingItems = media.files || [];
      return {
        listingItems,
      };
    }),
  );

  showUploader = false;
  query = '';  
  type = 'all';
  pageNo = 1;
  counting = {
    total: 0,
  };

  detailItem?: { media: StorageItem, downloadUrl: string, metadata: any };

  constructor(
    private store: Store,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {}

  setDetailItem(media: StorageItem, downloadUrl: string, metadata: any) {
    this.detailItem = { media, downloadUrl, metadata };
  }

  delete(item: StorageItem) {
    const yes = confirm('Are you sure you want to delete this file?');
    if (yes) {
      this.detailItem = undefined;
      this.store.dispatch(new DeleteUpload(item));
    }
  }
}
