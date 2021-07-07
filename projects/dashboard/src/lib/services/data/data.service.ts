import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { DashboardPart } from '../config/config.service';

import { ChangeStatus, AddItem, UpdateItem } from '../../states/database/database.state';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private store: Store) {}
  
  previewItem(part: DashboardPart) {
    alert('// TODO: Preview ...');
  }

  addItem(part: DashboardPart, id: string, data: any) {
    return (!part.dataService ? of(false) : part.dataService.exists(id))
      .pipe(
        switchMap(exists => {
          if (exists) {
            throw new Error('Item exists with the id: ' + id);
          } else {
            return this.store.dispatch(new AddItem(part, id, data));
          }
        }),
      );
  }

  updateItem(part: DashboardPart, id: string, data: any) {
    // TODO: update effects
    return this.store.dispatch(new UpdateItem(part, id, data));
  }

  archiveItem(part: DashboardPart, origin: string) {
    // TODO: remove effects
    const yes = confirm('Archive item?');
    if (yes) {
      this.changeStatusByOrigin(part, origin, 'archive');
    }
  }

  unarchiveItem(part: DashboardPart, origin: string) {
    const yes = confirm('Unarchive item?');
    if (yes) {
      this.changeStatusByOrigin(part, origin, 'draft');
    }
  }

  removeItem(part: DashboardPart, origin: string) {
    // TODO: remove effects
    const yes = confirm('Trash item?');
    // TODO: include delete permanently in the confirm alert
    if (yes) {
      this.changeStatusByOrigin(part, origin, 'trash');
    }
  }

  restoreItem(part: DashboardPart, origin: string) {
    const yes = confirm('Restore item?');
    if (yes) {
      this.changeStatusByOrigin(part, origin, 'draft');
    }
  }

  private changeStatusByOrigin(part: DashboardPart, origin: string, status: string) {
    this.store.dispatch(new ChangeStatus(part, origin, status));
  }

}
