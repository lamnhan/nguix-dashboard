import { Injectable } from '@angular/core';
import { MenuItem } from '@lamnhan/ngx-useful';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  menuItem: MenuItem = {
    name: 'categories',
    text: 'Categories',
    routerLink: ['admin', 'list', 'categories'],
    icon: 'icon-dashboard-categories'
  };

  constructor() { }
}
