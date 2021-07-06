import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { ToastrService } from 'ngx-toastr';

import { ConfigService, DashboardPart, DatabaseItem } from '../config/config.service';

import { FrontPartService } from '../../parts/front/front.service';
import { CategoryPartService } from '../../parts/category/category.service';
import { TagPartService } from '../../parts/tag/tag.service';
import { PagePartService } from '../../parts/page/page.service';
import { PostPartService } from '../../parts/post/post.service';

import { ChangeStatus } from '../../states/database/database.state';

export interface DashboardListingStatus {
  title: string;
  value: string;
  count: number;
}

export interface DashboardListingItem {
  origin: DatabaseItem;
  all: DatabaseItem[];
  missingTranslations: string[];
  searchText: string;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private store: Store,
    private toastr: ToastrService,
    // services
    private configService: ConfigService,
    // parts
    public readonly frontPart: FrontPartService,
    public readonly categoryPart: CategoryPartService,
    public readonly tagPart: TagPartService,
    public readonly pagePart: PagePartService,
    public readonly postPart: PostPartService,
  ) {}

  getConfig() {
    return this.configService.getConfig();
  }

  getParts() {
    return this
      .getConfig()
      .parts
      .map(item => typeof item === 'string' ? this.getPart(item) : item)
      .filter(item => !!item) as DashboardPart[];
  }

  getPart(part: string): undefined | DashboardPart {
    switch (part) {
      case 'front':
        return this.frontPart;
      case 'category':
        return this.categoryPart;
      case 'tag':
        return this.tagPart;
      case 'page':
        return this.pagePart;
      case 'post':
        return this.postPart;    
      default:
        return this
          .getConfig()
          .parts
          .filter(item => typeof item !== 'string' && item.name === part)
          .shift() as (undefined | DashboardPart);
    }
  }

  getMenu() {
    return this.getParts().map(item => item.menuItem);
  }

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
