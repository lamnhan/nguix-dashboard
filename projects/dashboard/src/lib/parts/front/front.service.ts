import { Injectable } from '@angular/core';
import { MenuItem } from '@lamnhan/ngx-useful';

@Injectable({
  providedIn: 'root'
})
export class FrontPartService {
  public readonly name = 'front';

  public readonly menuItem: MenuItem = {
    name: this.name,
    text: 'Dashboard',
    routerLink: ['admin'],
    icon: `icon-dashboard-${this.name}`,
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
