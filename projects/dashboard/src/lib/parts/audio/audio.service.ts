import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { MenuItem } from '@lamnhan/ngx-useful';
import { AudioDataService } from '@lamnhan/ngx-schemata';

import { FormSchemaItem, ContentType, LinkingSchemaMeta } from '../../services/config/config.service';
import { Schemas } from '../../services/schema/schema.service';

@Injectable({
  providedIn: 'root'
})
export class AudioPartService {
  public readonly name = 'audio';

  public readonly menuItem: MenuItem = {
    name: this.name,
    text: 'Audios',
    routerLink: ['app-dashboard', 'list', this.name],
    icon: `icon-dashboard-part-${this.name}`,
    activeAlso: [`app-dashboard/new/${this.name}`],
    subItems: [
      {
        text: 'All Audios',
        routerLink: ['app-dashboard', 'list', this.name],
      },
      {
        text: 'Add New',
        routerLink: ['app-dashboard', 'new', this.name],
      },
    ]
  };

  public readonly formSchema: FormSchemaItem[] = [
    Schemas.description,
    {
      ...Schemas.duration,
      required: true,
      validators: [Validators.required],
      note: 'In seconds',
    },
    {
      ...Schemas.srcs,
      required: true,
      validators: [Validators.required],
    },
    Schemas.thumbnails,
    Schemas.images,
    {
      ...Schemas.content,
      description: 'This could be song lyric or any content.',
    },
    {
      label: 'Birthday',
      name: 'birthday',
      type: 'text',
      description: 'Published or recorded day or year.',
    },
    {
      label: 'Sheets',
      name: 'sheets',
      type: 'json',
      meta: {
        type: 'array',
        schema: [
          {name: 'name', type: 'text', required: true, width: 50},
          {name: 'src', type: 'upload', required: true, width: 250},
        ],
      },
      description: 'Sheets in different format: jpg, pdf, ...'
    },
    {
      ...Schemas.props,
      description: 'Any audio properties: bitrate, filesize, ...',
    },
    Schemas.authors,
    Schemas.parents,
    Schemas.categories,
    {
      label: 'Genres',
      name: 'genres',
      type: 'link',
      meta: {
        source: 'category',
        contentType: 'genre',
        preload: 12,
      } as LinkingSchemaMeta,
    },
    Schemas.tags,
    Schemas.relatedAudios,
    Schemas.keywords,
  ];

  public readonly contentTypes: ContentType[]  = [
    { text: 'Default', value: 'default', icon: `icon-dashboard-part-${this.name}` },
  ];

  constructor(public readonly dataService: AudioDataService) {}
}
