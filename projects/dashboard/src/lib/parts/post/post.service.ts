import { Injectable } from '@angular/core';
import { MenuItem } from '@lamnhan/ngx-useful';

@Injectable({
  providedIn: 'root'
})
export class PostPartService {
  public readonly name = 'post';

  public readonly menuItem: MenuItem = {
    name: this.name,
    text: 'Posts',
    routerLink: ['admin', 'list', this.name],
    icon: `icon-dashboard-${this.name}`,
    activeAlso: [`admin/new/${this.name}`],
    subItems: [
      {
        text: 'All Posts',
        routerLink: ['admin', 'list', this.name],
      },
      {
        text: 'Add New',
        routerLink: ['admin', 'new', this.name],
      },
      {
        text: 'Categories',
        routerLink: ['admin', 'list', 'category'],
      },
      {
        text: 'Tags',
        routerLink: ['admin', 'list', 'tag'],
      }
    ]
  };

  public readonly collection = 'posts';

  constructor() { }
}
