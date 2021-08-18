import { Injectable } from '@angular/core';
import { MenuItem } from '@lamnhan/ngx-useful';
import { ProfileDataService } from '@lamnhan/ngx-schemata';

import { FormSchemaItem, ContentType } from '../../services/config/config.service';
import { Schemas } from '../../services/schema/schema.service';

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
    ]
  };

  public readonly noI18n = true;

  public readonly formSchema: FormSchemaItem[] = [
    Schemas.categories,
    Schemas.tags,
    Schemas.keyword,
    Schemas.relatedProfiles,
  ];

  public readonly contentTypes: ContentType[]  = [
    { text: 'Default', value: 'default', icon: `icon-dashboard-part-${this.name}` },
  ];

  constructor(public readonly dataService: ProfileDataService) {}
}
