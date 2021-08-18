import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { DashboardPart, DatabaseItem } from '../config/config.service';
import { DashboardService } from '../dashboard/dashboard.service';

import { AddItem, UpdateItem, RemoveItem } from '../../states/database/database.state';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private store: Store,
    private dashboardService: DashboardService,
  ) {}
  
  previewItem(part: DashboardPart) {
    alert('// TODO: Preview ...');
  }

  addItem(
    part: DashboardPart,
    databaseItem: DatabaseItem,
    onSuccess?: (data: any) => void,
    onError?: (error: any) => void,
  ) {
    const { id } = databaseItem;
    (!part.dataService ? of(true) : part.dataService.exists(id))
    .pipe(
      switchMap(exists => {
        if (exists) {
          throw new Error('Item exists with the id: ' + id);
        }
        return this.store.dispatch(new AddItem(part, databaseItem));
      }),
    )
    .subscribe(onSuccess, onError);
  }

  updateItem(
    part: DashboardPart,
    currentDatabaseItem: DatabaseItem,
    databaseItem: DatabaseItem,
    onSuccess?: (data: any) => void,
    onError?: (error: any) => void,
  ) {
    this.store.dispatch(
      new UpdateItem(part, databaseItem, currentDatabaseItem)
    )
    .subscribe(onSuccess, onError);
  }

  archiveItem(
    part: DashboardPart,
    databaseItem: DatabaseItem,
    onSuccess?: (data: any) => void,
    onError?: (error: any) => void,
  ) {
    const yes = confirm('Archive item?');
    if (!yes) {
      return;
    }
    this.store.dispatch(
      new UpdateItem(part, { status: 'archive' }, databaseItem)
    )
    .subscribe(onSuccess, onError);
  }

  unarchiveItem(
    part: DashboardPart,
    databaseItem: DatabaseItem,
    onSuccess?: (data: any) => void,
    onError?: (error: any) => void,
  ) {
    const yes = confirm('Unarchive item?');
    if (!yes) {
      return;
    }
    this.store.dispatch(
      new UpdateItem(part, { status: 'draft' }, databaseItem)
    )
    .subscribe(onSuccess, onError);
  }

  trashItem(
    part: DashboardPart,
    databaseItem: DatabaseItem,
    onSuccess?: (data: any) => void,
    onError?: (error: any) => void,
  ) {
    const yes = confirm('Trash item?');
    if (!yes) {
      return;
    }
    this.store.dispatch(
      new UpdateItem(part, { status: 'trash' }, databaseItem)
    )
    .subscribe(onSuccess, onError);
  }

  restoreItem(
    part: DashboardPart,
    databaseItem: DatabaseItem,
    onSuccess?: (data: any) => void,
    onError?: (error: any) => void,
  ) {
    const yes = confirm('Restore item?');
    if (!yes) {
      return;
    }
    this.store.dispatch(
      new UpdateItem(part, { status: 'draft' }, databaseItem)
    )
    .subscribe(onSuccess, onError);
  }

  removePermanently(
    part: DashboardPart,
    databaseItem: DatabaseItem,
    onSuccess?: (data: any) => void,
    onError?: (error: any) => void,
  ) {
    const yes = confirm('Delete permanently?');
    if (!yes) {
      return;
    }
    this.store.dispatch(new RemoveItem(part, databaseItem))
      .subscribe(onSuccess, onError);
  }

}
