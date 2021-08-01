import { Injectable } from '@angular/core';
import { MenuItem } from '@lamnhan/ngx-useful';
import { BundleDataService } from '@lamnhan/ngx-schemata';

import { FormSchemaItem, DataType, UpdateEffect } from '../../services/config/config.service';
import { Schemas, Effects } from '../../services/schema/schema.service';

@Injectable({
  providedIn: 'root'
})
export class BundlePartService {
  public readonly name = 'bundle';

  public readonly menuItem: MenuItem = {
    name: this.name,
    text: 'Bundles',
    routerLink: ['app-admin', 'list', this.name],
    icon: `icon-dashboard-part-${this.name}`,
    activeAlso: [`app-admin/new/${this.name}`],
    subItems: [
      {
        text: 'All Bundles',
        routerLink: ['app-admin', 'list', this.name],
      },
      {
        text: 'Add New',
        routerLink: ['app-admin', 'new', this.name],
      },
    ]
  };

  public readonly formSchema: FormSchemaItem[] = [
    Schemas.only,
    Schemas.description,
    Schemas.thumbnail,
    Schemas.image,
    Schemas.authors,
    Schemas.content,
    Schemas.count,
    Schemas.categories,
    Schemas.tags,
    Schemas.keyword,
  ];

  public readonly updateEffects: UpdateEffect[] = [
    {
      ...Effects.parents,
      part: 'post',
      collection: 'posts',
    },
    {
      ...Effects.parents,
      part: 'audio',
      collection: 'audios',
    },
    {
      ...Effects.parents,
      part: 'video',
      collection: 'videos',
    }
  ];

  public readonly dataTypes: DataType[]  = [
    { text: 'Default', value: 'default', icon: `icon-dashboard-part-${this.name}` },
  ];

  constructor(public readonly dataService: BundleDataService) {}
}
