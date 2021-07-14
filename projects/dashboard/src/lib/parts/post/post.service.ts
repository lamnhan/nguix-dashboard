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
    routerLink: ['admin', 'list', this.name],
    icon: `icon-dashboard-${this.name}`,
    activeAlso: [`admin/new/${this.name}`],
    subItems: [
      {
        text: 'All Posts',
        routerLink: ['admin', 'list', this.name],
      },
      {
        text: 'Add New',
        routerLink: ['admin', 'new', this.name],
      },
      {
        text: 'Categories',
        routerLink: ['admin', 'list', 'category'],
      },
      {
        text: 'Tags',
        routerLink: ['admin', 'list', 'tag'],
      }
    ]
  };

  public readonly formSchema: FormSchemaItem[] = [
    Schemas.type,
    Schemas.description,
    { label: 'TLDR', name: 'tldr', type: 'textarea' },
    {
      label: 'TOC',
      name: 'toc',
      type: 'json',
      data: {
        type: 'array',
        schema: [
          {name: 'text', type: 'string', required: true, width: 150},
          {name: 'level', type: 'number', required: true, defaultValue: 1},
          {name: 'id', type: 'string', width: 100},
          {name: 'href', type: 'string', width: 150},
          {name: 'routerLink', type: 'string', width: 150},
        ],
      },
    },
    Schemas.thumbnail,
    Schemas.image,
    Schemas.authors,
    Schemas.duration,
    Schemas.contentSrc,
    Schemas.content,
    {
      label: 'Slides',
      name: 'slides',
      type: 'json',
      data: {
        type: 'record',
        schema: [
          {name: 'id', type: 'string', required: true, width: 100},
          {name: 'image', type: 'string', required: true, width: 150},
          {name: 'title', type: 'string', width: 150},
          {name: 'description', type: 'string', width: 150},
        ],
      },
    },
    { label: 'Audio', name: 'audio', type: 'text' },
    { label: 'Video', name: 'video', type: 'text' },
    Schemas.parents,
    Schemas.categories,
    Schemas.tags,
    Schemas.keywords,
  ];

  public readonly dataTypes: DataType[]  = [
    { text: 'Post', value: 'post', icon: `icon-dashboard-${this.name}` },
  ];

  constructor(public readonly dataService: PostDataService) {}
}
