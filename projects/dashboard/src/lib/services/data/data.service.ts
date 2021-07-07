import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';

import { DashboardPart } from '../config/config.service';

import { ChangeStatus } from '../../states/database/database.state';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private store: Store) {}
  
  previewItem(part: DashboardPart) {
    alert('// TODO: Preview ...');
  }

  archiveItem(
    part: DashboardPart,
    origin: string
  ) {
    const yes = confirm('Archive item?');
    if (yes) {
      this.changeStatusByOrigin(part, origin, 'archive');
    }
  }

  unarchiveItem(
    part: DashboardPart,
    origin: string
  ) {
    const yes = confirm('Unarchive item?');
    if (yes) {
      this.changeStatusByOrigin(part, origin, 'draft');
    }
  }

  removeItem(
    part: DashboardPart,
    origin: string
  ) {
    const yes = confirm('Trash item?');
    // TODO: include delete permanently in the confirm alert
    if (yes) {
      this.changeStatusByOrigin(part, origin, 'trash');
    }
  }

  restoreItem(
    part: DashboardPart,
    origin: string
  ) {
    const yes = confirm('Restore item?');
    if (yes) {
      this.changeStatusByOrigin(part, origin, 'draft');
    }
  }

  private changeStatusByOrigin(
    part: DashboardPart,
    origin: string,
    status: string
  ) {
    this.store.dispatch(new ChangeStatus(part, origin, status));
  }

}
