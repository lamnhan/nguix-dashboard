import { Injectable } from '@angular/core';

import { ConfigService, DashboardPart, DatabaseItem } from '../config/config.service';

import { FrontPartService } from '../../parts/front/front.service';
import { MediaPartService } from '../../parts/media/media.service';
import { UserPartService } from '../../parts/user/user.service';
import { CategoryPartService } from '../../parts/category/category.service';
import { TagPartService } from '../../parts/tag/tag.service';
import { PagePartService } from '../../parts/page/page.service';
import { PostPartService } from '../../parts/post/post.service';

export interface DashboardListingStatus {
  title: string;
  value: string;
  count: number;
}

export interface DashboardListingMediaType extends DashboardListingStatus {}

export interface DashboardListingUserRole extends DashboardListingStatus {}

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
    private configService: ConfigService,
    // parts
    public readonly frontPart: FrontPartService,
    public readonly mediaPart: MediaPartService,
    public readonly userPart: UserPartService,
    public readonly categoryPart: CategoryPartService,
    public readonly tagPart: TagPartService,
    public readonly pagePart: PagePartService,
    public readonly postPart: PostPartService,
  ) {
    // run plugins
    (this.configService.getConfig().plugins || [])
      .forEach(plugin => plugin(this));
  }

  getParts() {
    return this.configService
      .getConfig()
      .parts
      .map(item => typeof item === 'string' ? this.getPart(item) : item)
      .filter(item => !!item) as DashboardPart[];
  }

  getPart(part: string): undefined | DashboardPart {
    switch (part) {
      case 'front':
        return this.frontPart;
      case 'media':
        return this.mediaPart;
      case 'user':
        return this.userPart;
      case 'category':
        return this.categoryPart;
      case 'tag':
        return this.tagPart;
      case 'page':
        return this.pagePart;
      case 'post':
        return this.postPart;    
      default:
        return this.configService
          .getConfig()
          .parts
          .filter(item => typeof item !== 'string' && item.name === part)
          .shift() as (undefined | DashboardPart);
    }
  }

  getMenu() {
    return this.getParts().map(item => item.menuItem);
  }
}
