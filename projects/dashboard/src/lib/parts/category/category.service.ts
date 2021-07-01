import { Injectable } from '@angular/core';
import { MenuItem } from '@lamnhan/ngx-useful';

@Injectable({
  providedIn: 'root'
})
export class CategoryPartService {

  public readonly collection = 'categories';

  public readonly menuItem: MenuItem = {
    name: 'category',
    text: 'Categories',
    routerLink: ['admin', 'list', 'category'],
    icon: 'icon-dashboard-category',
    activeAlso: ['admin/new/category'],
    subItems: [
      {
        text: 'All Categories',
        routerLink: ['admin', 'list', 'category'],
      },
      {
        text: 'Add New',
        routerLink: ['admin', 'new', 'category'],
      }
    ]
  };

  constructor() { }
}
