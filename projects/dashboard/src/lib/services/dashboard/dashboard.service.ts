import { Injectable } from '@angular/core';
import { MenuItem } from '@lamnhan/ngx-useful';

import { ConfigService } from '../config/config.service';

import { CategoriesService } from '../../schematas/categories/categories.service';
import { TagsService } from '../../schematas/tags/tags.service';
import { PagesService } from '../../schematas/pages/pages.service';
import { PostsService } from '../../schematas/posts/posts.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly unknownMenuItem: MenuItem = {
    name: 'unknown', text: 'Unknown', routerLink: ['admin'], icon: 'icon-unknown'
  };

  constructor(
    private configService: ConfigService,
    public readonly categoriesService: CategoriesService,
    public readonly tagsService: TagsService,
    public readonly pagesService: PagesService,
    public readonly postsService: PostsService,
  ) {}

  getMenu() {
    const {collections} = this.configService.getConfig();
    return collections.map(input =>
      typeof input !== 'string'
      ? input.menuItem
      : input === 'categories'
      ? this.categoriesService.menuItem
      : input === 'tags'
      ? this.tagsService.menuItem
      : input === 'pages'
      ? this.pagesService.menuItem
      : input === 'posts'
      ? this.postsService.menuItem
      : this.unknownMenuItem
    );
  }
}
