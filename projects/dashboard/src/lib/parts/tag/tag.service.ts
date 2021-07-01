import { Injectable } from '@angular/core';
import { MenuItem } from '@lamnhan/ngx-useful';

@Injectable({
  providedIn: 'root'
})
export class TagPartService {

  public readonly collection = 'tags';

  public readonly menuItem: MenuItem = {
    name: 'tag',
    text: 'Tags',
    routerLink: ['admin', 'list', 'tag'],
    icon: 'icon-dashboard-tag',
    activeAlso: ['admin/new/tag'],
    subItems: [
      {
        text: 'All Tags',
        routerLink: ['admin', 'list', 'tag'],
      },
      {
        text: 'Add New',
        routerLink: ['admin', 'new', 'tag'],
      }
    ]
  };

  constructor() { }
}
