import { Injectable } from '@angular/core';
import { MenuItem } from '@lamnhan/ngx-useful';
import { TagDataService } from '@lamnhan/ngx-schemata';

import { FormSchemaItem, UpdateEffect, ContentType } from '../../services/config/config.service';
import { Schemas, Effects } from '../../services/schema/schema.service';

@Injectable({
  providedIn: 'root'
})
export class TagPartService {
  public readonly name = 'tag';

  public readonly menuItem: MenuItem = {
    name: this.name,
    text: 'Tags',
    routerLink: ['app-admin', 'list', this.name],
    icon: `icon-dashboard-part-${this.name}`,
    activeAlso: [`app-admin/new/${this.name}`],
    subItems: [
      {
        text: 'All Tags',
        routerLink: ['app-admin', 'list', this.name],
      },
      {
        text: 'Add New',
        routerLink: ['app-admin', 'new', this.name],
      }
    ]
  };

  public readonly noI18n = true;

  public readonly formSchema: FormSchemaItem[] = [
    Schemas.count,
  ];

  public readonly updateEffects: UpdateEffect[] = [
    {
      ...Effects.tags,
      part: 'post',
      collection: 'posts',
    },
    {
      ...Effects.tags,
      part: 'audio',
      collection: 'audios',
    },
    {
      ...Effects.tags,
      part: 'video',
      collection: 'videos',
    },
    {
      ...Effects.tags,
      part: 'profile',
      collection: 'profiles',
    },
  ];

  public readonly contentTypes: ContentType[]  = [
    { text: 'Default', value: 'default', icon: `icon-dashboard-part-${this.name}` },
  ];

  constructor(public readonly dataService: TagDataService) {}

}
