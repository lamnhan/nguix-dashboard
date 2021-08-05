import { Injectable } from '@angular/core';
import { MenuItem } from '@lamnhan/ngx-useful';
import { BundleDataService } from '@lamnhan/ngx-schemata';

import { FormSchemaItem, ContentType, UpdateEffect } from '../../services/config/config.service';
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
    Schemas.thumbnails,
    Schemas.images,
    Schemas.authors,
    Schemas.content,
    Schemas.count,
    Schemas.categories,
    Schemas.tags,
    Schemas.keyword,
    Schemas.relatedBundles,
  ];

  public readonly updateEffects: UpdateEffect[] = [
    {
      ...Effects.relatedBundles,
      part: 'bundle',
      collection: 'bundles',
    },
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

  public readonly contentTypes: ContentType[]  = [
    { text: 'Default', value: 'default', icon: `icon-dashboard-part-${this.name}` },
  ];

  constructor(public readonly dataService: BundleDataService) {}
}
