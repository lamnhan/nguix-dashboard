import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { map, tap } from 'rxjs/operators';

import { MediaItem } from '../../services/storage/storage.service';

import { GetMedia, AddFile } from '../../states/media/media.state';

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

  public readonly data$ = this.store
    .select(state => state.media)
    .pipe(
      map(media => {
        const listingItems = this.buildListingItems(media.files || []);
        console.log(listingItems);
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

  constructor(
    private store: Store,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {}

  uploadComplete(result: MediaItem) {
    this.store.dispatch(new AddFile(result));
  }

  private buildListingItems(items: MediaItem[]) {
    return items;
  }
}
