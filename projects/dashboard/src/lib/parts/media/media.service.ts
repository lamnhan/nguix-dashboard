import { Injectable } from '@angular/core';
import { MenuItem } from '@lamnhan/ngx-useful';

@Injectable({
  providedIn: 'root'
})
export class MediaPartService {
  public readonly name = 'media';

  public readonly menuItem: MenuItem = {
    name: this.name,
    text: 'Media',
    routerLink: ['app-admin', this.name],
    icon: `icon-dashboard-part-${this.name}`,
    activeAlso: [`app-admin/${this.name}/new`],
    subItems: [
      {
        text: 'Library',
        routerLink: ['app-admin', this.name]
      },
      {
        text: 'Add New',
        routerLink: ['app-admin', this.name, 'new']
      }
    ],
  };

  constructor() {}
}
