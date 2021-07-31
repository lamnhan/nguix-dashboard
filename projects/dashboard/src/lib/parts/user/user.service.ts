import { Injectable } from '@angular/core';
import { MenuItem } from '@lamnhan/ngx-useful';

@Injectable({
  providedIn: 'root'
})
export class UserPartService {
  public readonly name = 'user';

  public readonly menuItem: MenuItem = {
    name: this.name,
    text: 'Users',
    routerLink: ['app-admin', this.name],
    icon: `icon-dashboard-part-${this.name}`,
    subItems: [
      {
        text: 'All Users',
        routerLink: ['app-admin', this.name]
      },
    ],
  };

  constructor() { }
}
