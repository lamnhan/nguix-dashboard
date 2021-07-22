import { Injectable } from '@angular/core';
import { MenuItem } from '@lamnhan/ngx-useful';
import { AudioDataService } from '@lamnhan/ngx-schemata';

import { FormSchemaItem, JsonSchemaMeta, LinkingSchemaMeta, DataType } from '../../services/config/config.service';
import { Schemas } from '../../services/schema/schema.service';

@Injectable({
  providedIn: 'root'
})
export class AudioPartService {
  public readonly name = 'audio';

  public readonly menuItem: MenuItem = {
    name: this.name,
    text: 'Audios',
    routerLink: ['admin', 'list', this.name],
    icon: `icon-dashboard-part-${this.name}`,
    activeAlso: [`admin/new/${this.name}`],
    subItems: [
      {
        text: 'All Audios',
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
    { label: 'Src', name: 'src', type: 'upload', required: true },
    Schemas.duration,
    Schemas.description,
    Schemas.thumbnail,
    Schemas.image,
    Schemas.authors,
    Schemas.contentSrc,
    Schemas.content,
    { label: 'Birthday', name: 'birthday', type: 'text' },
    { label: 'Sheet', name: 'sheet', type: 'upload' },
    {
      label: 'Props',
      name: 'props',
      type: 'json',
      meta: {
        type: 'record',
        recordKey: 'name',
        schema: [
          {name: 'name', type: 'string', required: true, width: 100},
          {name: 'value', type: 'string', required: true, width: 150},
        ],
      } as JsonSchemaMeta,
    },
    {
      label: 'Parents',
      name: 'parents',
      type: 'link',
      meta: {
        source: 'bundle',
        keys: ['id', 'title'],
        contentType: 'audio',
      } as LinkingSchemaMeta,
    },
    Schemas.categories,
    Schemas.tags,
    Schemas.keywords,
  ];

  public readonly dataTypes: DataType[]  = [
    { text: 'Audio', value: 'audio', icon: `icon-dashboard-${this.name}` },
  ];

  constructor(public readonly dataService: AudioDataService) {}
}
