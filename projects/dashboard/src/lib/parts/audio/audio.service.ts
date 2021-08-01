import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { MenuItem } from '@lamnhan/ngx-useful';
import { AudioDataService } from '@lamnhan/ngx-schemata';

import { FormSchemaItem, DataType } from '../../services/config/config.service';
import { Schemas } from '../../services/schema/schema.service';

@Injectable({
  providedIn: 'root'
})
export class AudioPartService {
  public readonly name = 'audio';

  public readonly menuItem: MenuItem = {
    name: this.name,
    text: 'Audios',
    routerLink: ['app-admin', 'list', this.name],
    icon: `icon-dashboard-part-${this.name}`,
    activeAlso: [`app-admin/new/${this.name}`],
    subItems: [
      {
        text: 'All Audios',
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
    {
      ...Schemas.src,
      required: true,
      validators: [Validators.required],
    },
    {
      ...Schemas.duration,
      required: true,
      validators: [Validators.required],
    },
    Schemas.description,
    Schemas.thumbnail,
    Schemas.image,
    Schemas.authors,
    Schemas.content,
    { label: 'Birthday', name: 'birthday', type: 'text' },
    {
      label: 'Sheets',
      name: 'sheets',
      type: 'json',
      meta: {
        type: 'array',
        schema: [
          {name: 'name', type: 'string', required: true, width: 100},
          {name: 'url', type: 'string', required: true, width: 250},
        ],
      },
    },
    Schemas.props,
    Schemas.parents,
    Schemas.categories,
    Schemas.tags,
    Schemas.keyword,
  ];

  public readonly dataTypes: DataType[]  = [
    { text: 'Default', value: 'default', icon: `icon-dashboard-part-${this.name}` },
  ];

  constructor(public readonly dataService: AudioDataService) {}
}
