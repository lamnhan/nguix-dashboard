import { Injectable } from '@angular/core';
import { MenuItem } from '@lamnhan/ngx-useful';
import { ProfileDataService } from '@lamnhan/ngx-schemata';

import { FormSchemaItem, DataType } from '../../services/config/config.service';

@Injectable({
  providedIn: 'root'
})
export class ProfilePartService {
  public readonly name = 'profile';

  public readonly menuItem: MenuItem = {
    name: this.name,
    text: 'Profiles',
    routerLink: ['app-admin', 'list', this.name],
    icon: `icon-dashboard-part-${this.name}`,
    activeAlso: [`app-admin/new/${this.name}`],
    subItems: [
      {
        text: 'All Profiles',
        routerLink: ['app-admin', 'list', this.name],
      },
      {
        text: 'Add New',
        routerLink: ['app-admin', 'new', this.name],
      },
      {
        text: 'Categories',
        routerLink: ['app-admin', 'list', 'category'],
      },
      {
        text: 'Tags',
        routerLink: ['app-admin', 'list', 'tag'],
      }
    ]
  };

  public readonly noI18n = true;

  public readonly formSchema: FormSchemaItem[] = [];

  public readonly dataTypes: DataType[]  = [
    { text: 'Default', value: 'default', icon: `icon-dashboard-part-${this.name}` },
  ];

  constructor(public readonly dataService: ProfileDataService) {}
}
