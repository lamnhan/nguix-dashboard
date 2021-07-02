import { Injectable } from '@angular/core';
import { MenuItem } from '@lamnhan/ngx-useful';

import { ConfigService, CustomPart } from '../config/config.service';

import { FrontPartService } from '../../parts/front/front.service';
import { CategoryPartService } from '../../parts/category/category.service';
import { TagPartService } from '../../parts/tag/tag.service';
import { PagePartService } from '../../parts/page/page.service';
import { PostPartService } from '../../parts/post/post.service';

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

  getPart(part: string) {
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
        return this.configService
          .getConfig()
          .parts
          .filter(item => typeof item !== 'string' && item.name === part)
          .shift() as (undefined | CustomPart);
    }
  }

  getMenu() {
    return this.configService
      .getConfig()
      .parts
      .map(item => {
        if (typeof item === 'string') {
          const part = this.getPart(item);
          return !part ? null : part.menuItem;
        } else {
          return item.menuItem;
        }
      })
      .filter(item => !!item) as MenuItem[];
  }
}
