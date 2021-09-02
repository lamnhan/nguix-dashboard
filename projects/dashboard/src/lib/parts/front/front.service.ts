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
    routerLink: ['app-dashboard'],
    icon: `icon-dashboard-part-${this.name}`,
    activeAlso: ['app-dashboard/about'],
    subItems: [
      {
        text: 'Home',
        routerLink: ['app-dashboard']
      },
      {
        text: 'About',
        routerLink: ['app-dashboard', 'about']
      }
    ],
  };

  constructor() { }
}
