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
    routerLink: ['app-admin'],
    icon: `icon-dashboard-part-${this.name}`,
    activeAlso: ['app-admin/about'],
    subItems: [
      {
        text: 'Home',
        routerLink: ['app-admin']
      },
      {
        text: 'About',
        routerLink: ['app-admin', 'about']
      }
    ],
  };

  constructor() { }
}
