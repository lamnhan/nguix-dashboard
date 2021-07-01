import { Injectable } from '@angular/core';
import { MenuItem } from '@lamnhan/ngx-useful';

@Injectable({
  providedIn: 'root'
})
export class PagePartService {
  
  public readonly collection = 'pages';

  public readonly menuItem: MenuItem = {
    name: 'page',
    text: 'Pages',
    routerLink: ['admin', 'list', 'page'],
    icon: 'icon-dashboard-page',
    activeAlso: ['admin/new/page'],
    subItems: [
      {
        text: 'All Pages',
        routerLink: ['admin', 'list', 'page'],
      },
      {
        text: 'Add New',
        routerLink: ['admin', 'new', 'page'],
      }
    ]
  };

  constructor() { }
}
