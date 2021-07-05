import { Injectable } from '@angular/core';
import { Observable, combineLatest, of } from 'rxjs';
import { take, map, switchMap } from 'rxjs/operators';
import { DatabaseData } from '@lamnhan/ngx-useful';

import { ConfigService, DashboardPart, DatabaseItem } from '../config/config.service';

import { FrontPartService } from '../../parts/front/front.service';
import { CategoryPartService } from '../../parts/category/category.service';
import { TagPartService } from '../../parts/tag/tag.service';
import { PagePartService } from '../../parts/page/page.service';
import { PostPartService } from '../../parts/post/post.service';

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
    input: string | DashboardListingItem
  ) {
    const yes = confirm('Archive item?');
    if (yes) {
      this.changeNetworkStatus(part, input, 'archive');
    }
  }

  unarchiveItem(
    part: DashboardPart,
    input: string | DashboardListingItem
  ) {
    const yes = confirm('Un-archive item?');
    if (yes) {
      this.changeNetworkStatus(part, input, 'draft');
    }
  }

  removeItem(
    part: DashboardPart,
    input: string | DashboardListingItem
  ) {
    const yes = confirm('Trash item?');
    // TODO: include delete permanently in the confirm alert
    if (yes) {
      this.changeNetworkStatus(part, input, 'trash');
    }
  }

  restoreItem(
    part: DashboardPart,
    input: string | DashboardListingItem
  ) {
    const yes = confirm('Restore item?');
    if (yes) {
      this.changeNetworkStatus(part, input, 'draft');
    }
  }

  private changeNetworkStatus(
    part: DashboardPart,
    input: string | DashboardListingItem,
    status: string
  ) {
    this.runNetworkAction(
      part,
      input,
      id =>
        (part.dataService as DatabaseData<any>).update(id, {status}),
      () => {
        if (typeof input !== 'string') {
          input.origin.status = status;
          input.all.forEach(item => item.status = status);
        }
        alert('Status changed to: ' + status);
      }
    );
  }

  private runNetworkAction(
    part: DashboardPart,
    input: string | DashboardListingItem,
    handler: (id: string) => Observable<any>,
    done: () => void,
  ) {
    if (part.dataService) {
      (
        typeof input === 'string'
        ? this.getIdsByOrigin(part.dataService, input)
        : of(input.all.map(item => item.id as string))
      )
      .pipe(
        switchMap(ids =>
          combineLatest(ids.map(id => handler(id)))
        )
      )
      .subscribe(() => done());
    }
  }

  private getIdsByOrigin(dataService: DatabaseData<any>, origin: string) {
    return dataService
    .collection(ref => ref.where('origin', '==', origin))
    .get()
    .pipe(
      take(1),
      map(collection =>
        collection.docs.map(doc => doc.data().id as string)
      )
    );
  }

}
