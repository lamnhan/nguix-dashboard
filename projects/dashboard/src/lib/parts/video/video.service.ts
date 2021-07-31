import { Injectable } from '@angular/core';
import { MenuItem } from '@lamnhan/ngx-useful';
import { VideoDataService } from '@lamnhan/ngx-schemata';

import { FormSchemaItem, DataType } from '../../services/config/config.service';
import { Schemas } from '../../services/schema/schema.service';

@Injectable({
  providedIn: 'root'
})
export class VideoPartService {
  public readonly name = 'video';

  public readonly menuItem: MenuItem = {
    name: this.name,
    text: 'Videos',
    routerLink: ['app-admin', 'list', this.name],
    icon: `icon-dashboard-part-${this.name}`,
    activeAlso: [`app-admin/new/${this.name}`],
    subItems: [
      {
        text: 'All Videos',
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

  public readonly formSchema: FormSchemaItem[] = [
    { ...Schemas.src, required: true },
    Schemas.duration,
    Schemas.description,
    Schemas.thumbnail,
    Schemas.image,
    Schemas.authors,
    Schemas.content,
    { label: 'Birthday', name: 'birthday', type: 'text' },
    Schemas.props,
    { ...Schemas.parents, meta: { ...Schemas.parents.meta, contentType: 'video' } },
    Schemas.categories,
    Schemas.tags,
    Schemas.keyword,
  ];

  public readonly dataTypes: DataType[]  = [
    { text: 'Default', value: 'default', icon: `icon-dashboard-part-${this.name}` },
  ];

  constructor(public readonly dataService: VideoDataService) {}
}
