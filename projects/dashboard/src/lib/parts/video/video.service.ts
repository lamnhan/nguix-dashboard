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
      ...Schemas.srcs,
      required: true,
      validators: [Validators.required],
    },
    {
      ...Schemas.duration,
      required: true,
      validators: [Validators.required],
    },
    Schemas.description,
    Schemas.thumbnails,
    Schemas.images,
    Schemas.authors,
    Schemas.content,
    { label: 'Birthday', name: 'birthday', type: 'text' },
    Schemas.props,
    Schemas.parents,
    Schemas.categories,
    Schemas.tags,
    Schemas.keyword,
    Schemas.relatedVideos,
  ];

  // public readonly updateEffects: UpdateEffect[] = [
  //   {
  //     ...Effects.relatedVideos,
  //     part: 'video',
  //     collection: 'videos',
  //   },
  // ];

  public readonly contentTypes: ContentType[]  = [
    { text: 'Default', value: 'default', icon: `icon-dashboard-part-${this.name}` },
  ];

  constructor(public readonly dataService: VideoDataService) {}
}
