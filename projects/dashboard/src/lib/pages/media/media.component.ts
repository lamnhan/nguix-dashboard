import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { map, tap } from 'rxjs/operators';
import { StorageItem } from '@lamnhan/ngx-useful';

import { GetFolders, GetFiles, DeleteUpload } from '../../states/media/media.state';

@Component({
  selector: 'nguix-dashboard-media-page',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})
export class MediaPage implements OnInit {

  public readonly page$ = this.route.params.pipe(
    map(() => ({ ok: true })),
    tap(() => this.store.dispatch(new GetFolders())),
  );

  public readonly data$ = this.store.select(state => state.media).pipe(
    map(mediaState => {
      this.isListingLoading = false;
      // set data
      const folders = (mediaState.folders as string[] || [] as string[]).sort().reverse();
      const listingItems = mediaState.filesByFolder[this.activeFolder || '$never'] || [];
      return {
        folders,
        listingItems,
      };
    }),
  );

  isListingLoading = false;
  layout: 'list' | 'thumbnail' = 'list';
  type = 'all';
  query = '';
  pageNo = 1;

  showUploader = false;
  activeFolder?: string;
  detailItem?: StorageItem;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {}

  changeFolder(e: any) {
    this.isListingLoading = true;
    // dispatch action
    const folder = e.target.value as string;
    this.activeFolder = folder;
    this.store.dispatch(new GetFiles(folder, true));
  }

  search() {
    this.isListingLoading = true;
    //
    console.log(this.query);
  }

  delete(item: StorageItem) {
    const yes = confirm('Are you sure you want to delete this file?');
    if (yes) {
      this.detailItem = undefined;
      this.store.dispatch(new DeleteUpload(item));
    }
  }
}
