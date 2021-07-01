import { Injectable } from '@angular/core';
import { MenuItem } from '@lamnhan/ngx-useful';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  menuItem: MenuItem = {
    name: 'posts',
    text: 'Posts',
    routerLink: ['admin', 'list', 'posts'],
    icon: 'icon-dashboard-posts',
    activeAlso: [
      'admin/edit/posts/new',
      'admin/list/categories',
      'admin/list/tags',
    ],
    subItems: [
      {
        text: 'All Posts',
        routerLink: ['admin', 'list', 'posts'],
      },
      {
        text: 'Add New',
        routerLink: ['admin', 'edit', 'posts', 'new'],
      },
      {
        text: 'Categories',
        routerLink: ['admin', 'list', 'categories'],
      },
      {
        text: 'Tags',
        routerLink: ['admin', 'list', 'tags'],
      }
    ]
  };

  constructor() { }
}
