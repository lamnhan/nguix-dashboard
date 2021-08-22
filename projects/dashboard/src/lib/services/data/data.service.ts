import { Injectable } from '@angular/core';
import { of, combineLatest } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Store } from '@ngxs/store';

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

  createItem(
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
    databaseItem: DatabaseItem,
    updateData: Record<string, any>,
    onSuccess?: (data: any) => void,
    onError?: (error: any) => void,
  ) {
    combineLatest([
      this.store.dispatch(
        new UpdateItem(part, databaseItem, updateData)
      ),
      !part.dataService
        ? of(null)
        : part.dataService.updateEffects(databaseItem.id, updateData),
    ])
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
    this.updateItem(
      part,
      databaseItem,
      { status: 'archive' },
      onSuccess,
      onError,
    );
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
    this.updateItem(
      part,
      databaseItem,
      { status: 'draft' },
      onSuccess,
      onError,
    );
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
    this.updateItem(
      part,
      databaseItem,
      { status: 'trash' },
      onSuccess,
      onError,
    );
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
    this.updateItem(
      part,
      databaseItem,
      { status: 'draft' },
      onSuccess,
      onError,
    );
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
    combineLatest([
      this.store.dispatch(new RemoveItem(part, databaseItem)),
      !part.dataService
        ? of(null)
        : part.dataService.deleteEffects(databaseItem.id),
    ])
    .subscribe(onSuccess, onError);
  }

}
