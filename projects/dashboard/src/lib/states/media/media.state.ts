import { Injectable } from '@angular/core';
import { of, combineLatest } from 'rxjs';
import { tap, map, switchMap, catchError, take } from 'rxjs/operators';
import { State, Action, StateContext } from '@ngxs/store';
import { StorageService, StorageItem } from '@lamnhan/ngx-useful';

export interface StorageItemWithUrlAndMetas extends StorageItem {
  metadata: any;
  downloadUrl: string;
}

export interface MediaStateModel {
  remoteLoaded: boolean;
  folders: string[];
  filesByFolder: Record<string, StorageItemWithUrlAndMetas[]>;
}

export class GetFolders {
  static readonly type = '[Media] Get folders';
  constructor(public refresh = false) {}
}

export class GetFiles {
  static readonly type = '[Media] Get files';
  constructor(public folder: string, public refresh = false) {}
}

export class AddUpload {
  static readonly type = '[Media] Add new upload';
  constructor(public item: StorageItemWithUrlAndMetas) {}
}

export class DeleteUpload {
  static readonly type = '[Media] Delete an upload';
  constructor(public item: StorageItemWithUrlAndMetas) {}
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
  private readonly UPLOAD_PATH = 'app-content/uploads';

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
    } else {
      let allFolders = currentFolders;
      // list deep 
      const listDeep = (fullPath?: string) =>
        this.storageService.list(fullPath)
        .pipe(
          take(1),
          map(listResult => {
            const { items, prefixes } = listResult;
            if (prefixes.length) {
              listResult.prefixes.forEach(prefix => listDeep(prefix.fullPath));
            }
            return !items.length ? undefined : (fullPath || `${this.UPLOAD_PATH}/root`);
          }),
          catchError(() => of(undefined)),
          map(fullPath => {
            if (fullPath) {
              const folder = fullPath.replace(`${this.UPLOAD_PATH}/`, '');
              allFolders.push(folder);
            }
            return allFolders;
          }),
        )
        .subscribe(allFolders => !allFolders ? undefined : patchState({ folders: allFolders }));
      // start from default folder
      listDeep();
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
      return this.storageService.list(`${this.UPLOAD_PATH}${folder === 'root' ? '' : `/${folder}`}`)
      .pipe(
        switchMap(listResult =>
          combineLatest(
            listResult.items.map(item => {
              const storageItem = this.storageService.buildStorageItem(item.fullPath);
              return combineLatest([
                storageItem.downloadUrl$,
                storageItem.metadata$,
              ])
              .pipe(
                map(([downloadUrl, metadata]) =>
                  ({...storageItem, downloadUrl, metadata} as StorageItemWithUrlAndMetas)
                ),
              );
            })
          )
        ),
        tap(files =>
          patchState({
            filesByFolder: { ...currentFilesByFolder, [folder]: files },
            remoteLoaded: true,
          })
        ),
      );
    }
  }

  @Action(AddUpload)
  addUpload({ getState, patchState }: StateContext<MediaStateModel>, action: AddUpload) {
    const { filesByFolder: currentFilesByFolder, folders: currentFolders } = getState();
    const { item } = action;
    const folder = item
      .fullPath
      .replace(`${this.UPLOAD_PATH}/`, '')
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
      .replace(`${this.UPLOAD_PATH}/`, '')
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
