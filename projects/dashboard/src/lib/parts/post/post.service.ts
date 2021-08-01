import { Injectable } from '@angular/core';
import { MenuItem } from '@lamnhan/ngx-useful';
import { PostDataService } from '@lamnhan/ngx-schemata';

import { FormSchemaItem, DataType } from '../../services/config/config.service';
import { Schemas } from '../../services/schema/schema.service';

@Injectable({
  providedIn: 'root'
})
export class PostPartService {
  public readonly name = 'post';

  public readonly menuItem: MenuItem = {
    name: this.name,
    text: 'Posts',
    routerLink: ['app-admin', 'list', this.name],
    icon: `icon-dashboard-part-${this.name}`,
    activeAlso: [`app-admin/new/${this.name}`],
    subItems: [
      {
        text: 'All Posts',
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
    Schemas.description,
    Schemas.toc,
    { label: 'TLDR', name: 'tldr', type: 'textarea' },
    Schemas.thumbnail,
    Schemas.image,
    Schemas.authors,
    Schemas.duration,
    Schemas.content,
    Schemas.slides,
    { label: 'Audio', name: 'audio', type: 'upload' },
    { label: 'Video', name: 'video', type: 'upload' },    
    Schemas.parents,
    Schemas.categories,
    Schemas.tags,
    Schemas.keyword,
  ];

  public readonly dataTypes: DataType[]  = [
    { text: 'Default', value: 'default', icon: `icon-dashboard-part-${this.name}` },
  ];

  constructor(public readonly dataService: PostDataService) {}
}
