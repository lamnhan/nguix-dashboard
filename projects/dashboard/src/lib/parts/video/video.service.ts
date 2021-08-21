import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { MenuItem } from '@lamnhan/ngx-useful';
import { VideoDataService } from '@lamnhan/ngx-schemata';

import { FormSchemaItem, ContentType } from '../../services/config/config.service';
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
      description: 'Transcript, subtitle or any content.',
    },
    {
      label: 'Birthday',
      name: 'birthday',
      type: 'text',
      description: 'Published or recorded day or year.',
    },
    {
      ...Schemas.props,
      description: 'Any video properties: resolution, filesize, ...',
    },
    Schemas.authors,
    Schemas.parents,
    Schemas.categories,
    Schemas.tags,
    Schemas.relatedVideos,
    Schemas.keywords,
  ];

  public readonly contentTypes: ContentType[]  = [
    { text: 'Default', value: 'default', icon: `icon-dashboard-part-${this.name}` },
  ];

  constructor(public readonly dataService: VideoDataService) {}
}
