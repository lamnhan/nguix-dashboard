import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { map, tap } from 'rxjs/operators';
import { StorageItem } from '@lamnhan/ngx-useful';

import { MediaStateModel, GetFolders, GetFiles, SearchFiles, DeleteUpload } from '../../states/media/media.state';

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

  public readonly data$ = this.store.select<MediaStateModel>(state => state.dashboard_media).pipe(
    map(mediaState => {
      this.isListingLoading = false;
      // set data
      const folders = (mediaState.folders as string[] || [] as string[]).sort().reverse();
      const folderItems = mediaState.filesByFolder[this.activeFolder || '$never'] || [];
      const searchQuery = mediaState.searchQuery;
      const searchItems = mediaState.searchResult;
      return {
        folders,
        folderItems,
        searchQuery,
        searchItems,
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

  search(currentQuery = '') {
    if (this.query && this.query !== currentQuery) {
      this.isListingLoading = true;
      // dispatch action
      this.store.dispatch(new SearchFiles(this.query));
    }
  }

  delete(item: StorageItem) {
    const yes = confirm('Are you sure you want to delete this file?');
    if (yes) {
      this.detailItem = undefined;
      this.store.dispatch(new DeleteUpload(item));
    }
  }
}
