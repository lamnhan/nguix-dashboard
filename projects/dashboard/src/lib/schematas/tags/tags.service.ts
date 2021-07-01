import { Injectable } from '@angular/core';
import { MenuItem } from '@lamnhan/ngx-useful';

@Injectable({
  providedIn: 'root'
})
export class TagsService {
  menuItem: MenuItem = {
    name: 'tags',
    text: 'Tags',
    routerLink: ['admin', 'list', 'tags'],
    icon: 'icon-tags-dark-medium'
  };

  constructor() { }
}
