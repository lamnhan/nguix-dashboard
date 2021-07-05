import { Injectable } from '@angular/core';
import { MenuItem } from '@lamnhan/ngx-useful';

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

  removeItem(part: DashboardPart, id: string) {
    const yes = confirm('Trash item?');
    // TODO: include delete permanently in the confirm alert
    if (yes && part.dataService) {
      part.dataService.trash(id);
    }
  }

}
