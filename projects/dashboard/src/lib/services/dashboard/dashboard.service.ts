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
  private customParts: Record<string, DashboardPart> = {};

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

  registerAvailableParts(customParts: Record<string, DashboardPart>) {
    this.customParts = customParts;
    return this as DashboardService;
  }

  init() {
    return this as DashboardService;
  }

  getPart(part: string): undefined | DashboardPart {
    const allParts: Record<string, DashboardPart> = {
      front: this.frontPart,
      media: this.mediaPart,
      user: this.userPart,
      category: this.categoryPart,
      tag: this.tagPart,
      page: this.pagePart,
      post: this.postPart,
      ...this.customParts,
    };
    return allParts[part];
  }

  getParts() {
    return this.configService
      .getConfig()
      .parts
      .map(item => typeof item === 'string' ? this.getPart(item) : item)
      .filter(item => !!item) as DashboardPart[];
  }

  getMenu() {
    return this.getParts().map(item => item.menuItem);
  }
}
