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
    icon: 'icon-x-posts-light'
  };

  constructor() { }
}
