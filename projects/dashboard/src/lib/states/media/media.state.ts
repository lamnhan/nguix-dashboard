import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { State, Action, StateContext } from '@ngxs/store';
import { StorageService, StorageItem, StorageSearchingData } from '@lamnhan/ngx-useful';

export class GetFolders {
  static readonly type = '[Media] Get folders';
  constructor(public refresh = false) {}
}

export class GetFiles {
  static readonly type = '[Media] Get files';
  constructor(public folder: string, public refresh = false) {}
}

export class SearchFiles {
  static readonly type = '[Media] Search files';
  constructor(public query: string) {}
}

export class AddUpload {
  static readonly type = '[Media] Add new upload';
  constructor(public item: StorageItem) {}
}

export class DeleteUpload {
  static readonly type = '[Media] Delete an upload';
  constructor(public item: StorageItem) {}
}

export interface MediaStateModel {
  // listing
  remoteLoaded: boolean;
  folders: string[];
  filesByFolder: Record<string, StorageItem[]>;
  // search
  searchingData?: StorageSearchingData;
  searchQuery?: string;
  searchResult?: StorageItem[];
}

@State<MediaStateModel>({
  name: 'media',
  defaults: {
    remoteLoaded: false,
    folders: [],
    filesByFolder: {},
  },
})
@Injectable()
export class MediaState {

  constructor(private storageService: StorageService) {}

  @Action(GetFolders)
  getFolders({ getState, patchState }: StateContext<MediaStateModel>, action: GetFolders) {
    const { folders: currentFolders, remoteLoaded } = getState();
    const { refresh } = action;
    if (currentFolders.length && remoteLoaded) {
      const allFolders = currentFolders;
      if (refresh) {
        patchState({ folders: allFolders });
      }
      return of(allFolders);
    } else {
      return this.storageService.listDeepFolders(false).pipe(
        tap(allFolders =>
          patchState({
            remoteLoaded: true,
            folders: allFolders.map(item =>
              item.replace(`${this.storageService.getUploadFolder()}`, '')
            ),
          })
        ),
      );
    }
  }

  @Action(GetFiles)
  getFiles({ getState, patchState }: StateContext<MediaStateModel>, action: GetFiles) {
    const { filesByFolder: currentFilesByFolder, remoteLoaded } = getState();
    const { folder, refresh } = action;
    if (currentFilesByFolder[folder]?.length && remoteLoaded) {
      if (refresh) {
        const files = currentFilesByFolder[folder];
        patchState({
          filesByFolder: { ...currentFilesByFolder, [folder]: files }
        });
      }
      return of(currentFilesByFolder[folder]);
    } else {
      return this.storageService.listFiles(
        false,
        `${this.storageService.getUploadFolder()}${folder === '' ? '' : ('/' + folder)}`
      )
      .pipe(
        tap(files =>
          patchState({
            remoteLoaded: true,
            filesByFolder: { ...currentFilesByFolder, [folder]: files },
          })
        ),
      );
    }
  }

  @Action(SearchFiles)
  searchFiles({ getState, patchState }: StateContext<MediaStateModel>, action: SearchFiles) {
    const {
      searchingData: currentSearchingData,
      searchQuery: currentSearchQuery,
      searchResult: currentSearchResult
    } = getState();
    const { query } = action;
    return (currentSearchingData ? of(currentSearchingData) : this.storageService.getSearching(false))
    .pipe(
      switchMap(searchingData => {
        if (currentSearchQuery === query && currentSearchResult?.length) {
          return of(currentSearchResult).pipe(
            tap(() => patchState({ searchResult: currentSearchResult })),
          );
        } else {
          return this.storageService.searchFiles(searchingData, query, 30, false)
          .list()
          .pipe(
            tap(searchResult =>
              patchState({
                searchingData,
                searchQuery: query,
                searchResult,
              })
            ),
          );
        }
      }),
    );
  }

  @Action(AddUpload)
  addUpload({ getState, patchState }: StateContext<MediaStateModel>, action: AddUpload) {
    const { filesByFolder: currentFilesByFolder, folders: currentFolders } = getState();
    const { item } = action;
    const folder = item
      .fullPath
      .replace(this.storageService.getUploadFolder(), '')
      .replace(`/${item.name}`, '');
    // build patch data
    const patchData = {} as any;
    // folder
    if (currentFolders.indexOf(folder) === -1) {
      currentFolders.unshift(folder);
      patchData.folders = currentFolders;
    }
    // files
    currentFilesByFolder[folder] = (currentFilesByFolder[folder] || []);
    currentFilesByFolder[folder].unshift(item);
    patchData.filesByFolder = currentFilesByFolder;
    // patching
    patchState(patchData);
  }

  @Action(DeleteUpload)
  deleteUpload({ getState, patchState }: StateContext<MediaStateModel>, action: DeleteUpload) {
    const { filesByFolder: currentFilesByFolder } = getState();
    const { item } = action;
    const { name, fullPath } = item;
    const folder = item
      .fullPath
      .replace(this.storageService.getUploadFolder(), '')
      .replace(`/${item.name}`, '');
    const files = (currentFilesByFolder[folder] || []).filter(file => file.name !== name);
    return this.storageService.delete(fullPath).pipe(
      tap(() =>
        patchState({
          filesByFolder: { ...currentFilesByFolder, [folder]: files },
        })
      ),
    );
  }

}
