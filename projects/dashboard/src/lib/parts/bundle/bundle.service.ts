import { Injectable } from '@angular/core';
import { MenuItem } from '@lamnhan/ngx-useful';
import { BundleDataService } from '@lamnhan/ngx-schemata';

import { FormSchemaItem, DataType } from '../../services/config/config.service';
import { Schemas } from '../../services/schema/schema.service';

@Injectable({
  providedIn: 'root'
})
export class BundlePartService {
  public readonly name = 'bundle';

  public readonly menuItem: MenuItem = {
    name: this.name,
    text: 'Bundles',
    routerLink: ['admin', 'list', this.name],
    icon: `icon-dashboard-part-${this.name}`,
    activeAlso: [`admin/new/${this.name}`],
    subItems: [
      {
        text: 'All Bundles',
        routerLink: ['admin', 'list', this.name],
      },
      {
        text: 'Add New',
        routerLink: ['admin', 'new', this.name],
      },
    ]
  };

  public readonly formSchema: FormSchemaItem[] = [
    Schemas.type,
    Schemas.description,
    Schemas.thumbnail,
    Schemas.image,
    Schemas.authors,
    Schemas.contentSrc,
    Schemas.content,
    Schemas.count,
    Schemas.categories,
    Schemas.tags,
    Schemas.keywords,
  ];

  public readonly dataTypes: DataType[]  = [
    { text: 'Post', value: 'post', icon: `icon-dashboard-part-post` },
    { text: 'Audio', value: 'audio', icon: `icon-dashboard-part-audio` },
    { text: 'Video', value: 'video', icon: `icon-dashboard-part-video` },
  ];

  constructor(public readonly dataService: BundleDataService) {}
}
