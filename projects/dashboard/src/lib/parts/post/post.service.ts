import { Injectable } from '@angular/core';
import { MenuItem } from '@lamnhan/ngx-useful';

@Injectable({
  providedIn: 'root'
})
export class PostPartService {

  public readonly collection = 'posts';

  public readonly menuItem: MenuItem = {
    name: 'post',
    text: 'Posts',
    routerLink: ['admin', 'list', 'post'],
    icon: 'icon-dashboard-post',
    activeAlso: ['admin/new/post'],
    subItems: [
      {
        text: 'All Posts',
        routerLink: ['admin', 'list', 'post'],
      },
      {
        text: 'Add New',
        routerLink: ['admin', 'new', 'post'],
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

  constructor() { }
}
