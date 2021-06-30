import { Injectable } from '@angular/core';
import { MenuItem } from '@lamnhan/ngx-useful';

@Injectable({
  providedIn: 'root'
})
export class PagesService {
  menuItem: MenuItem = {
    name: 'pages',
    text: 'Pages',
    routerLink: ['admin', 'list', 'pages'],
    icon: 'icon-dashboard-pages'
  };

  constructor() { }
}
