import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { tap, map, catchError, take } from 'rxjs/operators';
import { State, Action, StateContext } from '@ngxs/store';

import { StorageService, MediaItem } from '../../services/storage/storage.service';

export interface MediaStateModel {
  remoteLoaded: boolean;
  files: MediaItem[];
}

export class GetMedia {
  static readonly type = '[Media] Get all files';
  constructor(public refresh = false) {}
}

export class AddUpload {
  static readonly type = '[Media] Add new upload';
  constructor(public item: MediaItem) {}
}

export class DeleteUpload {
  static readonly type = '[Media] Delete an upload';
  constructor(public item: MediaItem) {}
}

@State<MediaStateModel>({
  name: 'media',
  defaults: {
    remoteLoaded: false,
    files: [],
  },
})
@Injectable()
export class MediaState {

  constructor(private storageService: StorageService) {}

  @Action(GetMedia)
  getMedia({ getState, patchState }: StateContext<MediaStateModel>, action: GetMedia) {
    const state = getState();
    if (state.files.length && state.remoteLoaded) {
      if (action.refresh) {
        patchState({ files: state.files });
      }
    } else {
      let allFiles = state.files;
      // list deep 
      const listDeep = (fullPath?: string) =>
        this.storageService.list(fullPath)
        .pipe(
          take(1),
          map(listResult => {
            const { items, prefixes } = listResult;
            // further processing
            prefixes.forEach(prefix => listDeep(prefix.fullPath));
            // return items
            return items.map(item =>
              this.storageService.buildMediaItem(item.name, item.fullPath)
            );
          }),
          catchError(() => {
            return of([] as MediaItem[]);
          }),
          map(files => {
            // ignore if error or listing result has no items
            if (!files.length) {
              return null;
            }
            // set the temporary file list
            allFiles = [...files, ...allFiles];
            // returns the full list
            return allFiles;
          }),
        )
        .subscribe(all => !all ? undefined : patchState({ remoteLoaded: true, files: all}));
      // start from default folder
      listDeep();
    }
  }

  @Action(AddUpload)
  addUpload({ getState, patchState }: StateContext<MediaStateModel>, action: AddUpload) {
    const state = getState();
    patchState({ files: [action.item, ...state.files] });
  }

  @Action(DeleteUpload)
  deleteUpload({ getState, patchState }: StateContext<MediaStateModel>, action: DeleteUpload) {
    const state = getState();
    const { item: {name, fullPath} } = action;
    return this.storageService.delete(fullPath).pipe(
      tap(() =>
        patchState({
          files: state.files.filter(file => file.name !== name),
        })
      ),
    );
  }

}
