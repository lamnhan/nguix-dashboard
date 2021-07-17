import { Injectable } from '@angular/core';
import { of, combineLatest } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { State, Action, StateContext } from '@ngxs/store';
import { AngularFireStorageReference } from '@angular/fire/storage';

import { StorageService } from '../../services/storage/storage.service';

export interface MediaStateModel {
  files: MediaItem[];
}

export interface MediaItem {
  path: string;
  ref: AngularFireStorageReference;
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
        map(listResult => {
          const { items } = listResult;
          return items.map(item => ({
            path: item.fullPath,
            ref: this.storageService.ref(item.fullPath),
          }));
        }),
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
