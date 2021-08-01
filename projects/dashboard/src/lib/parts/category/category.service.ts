import { Injectable } from '@angular/core';
import { MenuItem } from '@lamnhan/ngx-useful';
import { CategoryDataService } from '@lamnhan/ngx-schemata';

import { FormSchemaItem, UpdateEffect, DataType } from '../../services/config/config.service';
import { Schemas, Effects } from '../../services/schema/schema.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryPartService {
  public readonly name = 'category';

  public readonly menuItem: MenuItem = {
    name: this.name,
    text: 'Categories',
    routerLink: ['app-admin', 'list', this.name],
    icon: `icon-dashboard-part-${this.name}`,
    activeAlso: [`app-admin/new/${this.name}`],
    subItems: [
      {
        text: 'All Categories',
        routerLink: ['app-admin', 'list', this.name],
      },
      {
        text: 'Add New',
        routerLink: ['app-admin', 'new', this.name],
      }
    ]
  };

  public readonly formSchema: FormSchemaItem[] = [
    Schemas.only,
    Schemas.description,
    Schemas.thumbnail,
    Schemas.image,
    Schemas.count,
  ];

  public readonly updateEffects: UpdateEffect[] = [
    {
      ...Effects.categories,
      part: 'post',
      collection: 'posts',
    },
    {
      ...Effects.categories,
      part: 'audio',
      collection: 'audios',
    },
    {
      ...Effects.categories,
      part: 'video',
      collection: 'videos',
    },
    {
      ...Effects.categories,
      part: 'profile',
      collection: 'profiles',
    },
  ];

  public readonly dataTypes: DataType[]  = [
    { text: 'Default', value: 'default', icon: `icon-dashboard-part-${this.name}` },
  ];

  constructor(public readonly dataService: CategoryDataService) {}

}
