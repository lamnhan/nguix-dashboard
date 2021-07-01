import { Injectable } from '@angular/core';
import { MenuItem } from '@lamnhan/ngx-useful';

import { ConfigService } from '../config/config.service';

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

  getMenu() {
    const {parts} = this.configService.getConfig();
    return parts
      .map(part =>
        typeof part !== 'string'
        ? part.menuItem
        : part === 'front'
        ? this.frontPart.menuItem
        : part === 'category'
        ? this.categoryPart.menuItem
        : part === 'tag'
        ? this.tagPart.menuItem
        : part === 'page'
        ? this.pagePart.menuItem
        : part === 'post'
        ? this.postPart.menuItem
        : null
      )
      .filter(item => !!item) as MenuItem[];
  }
}
