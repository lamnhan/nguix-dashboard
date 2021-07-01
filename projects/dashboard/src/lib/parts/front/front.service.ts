import { Injectable } from '@angular/core';
import { MenuItem } from '@lamnhan/ngx-useful';

@Injectable({
  providedIn: 'root'
})
export class FrontPartService {

  public readonly menuItem: MenuItem = {
    name: 'front',
    text: 'Dashboard',
    routerLink: ['admin'],
    icon: 'icon-dashboard-front',
    activeAlso: ['admin/about'],
    subItems: [
      {
        text: 'Home',
        routerLink: ['admin']
      },
      {
        text: 'About',
        routerLink: ['admin', 'about']
      }
    ],
  };

  constructor() { }
}
