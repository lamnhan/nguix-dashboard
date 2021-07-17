import { Injectable } from '@angular/core';
import { of, combineLatest } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { State, Action, StateContext } from '@ngxs/store';

import { StorageService, MediaItem } from '../../services/storage/storage.service';

export interface MediaStateModel {
  files: MediaItem[];
}

export class GetMedia {
  static readonly type = '[Media] Get all files';
  constructor(public refresh = false) {}
}

@State<MediaStateModel>({
  name: 'media',
  defaults: {
    files: [],
  },
})
@Injectable()
export class MediaState {

  constructor(private storageService: StorageService) {}

  @Action(GetMedia)
  getMedia({ getState, patchState }: StateContext<MediaStateModel>, action: GetMedia) {
    const state = getState();
    const { refresh } = action;
    if (state.files.length) {
      const { files } = state;
      if (refresh) {
        patchState({files});
      }
      return of(files);
    } else {
      return this.storageService.list().pipe(
        map(listResult =>
          listResult
            .items
            .map(item => this.storageService.buildMediaItem(item.name, item.fullPath))
        ),
        catchError(() => {
          return of([] as MediaItem[]);
        }),
        tap(files => {
          patchState({files});
        }),
      );
    }
  }

}
