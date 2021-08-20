import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { MenuItem } from '@lamnhan/ngx-useful';
import { CategoryDataService } from '@lamnhan/ngx-schemata';

import { FormSchemaItem, ContentType, ImageCropping } from '../../services/config/config.service';
import { Schemas } from '../../services/schema/schema.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryPartService {
  public readonly name = 'category';

  public readonly menuItem: MenuItem = {
    name: this.name,
    text: 'Categories',
    routerLink: ['app-admin', 'list', this.name],
    icon: `icon-dashboard-part-${this.name}`,
    activeAlso: [`app-admin/new/${this.name}`],
    subItems: [
      {
        text: 'All Categories',
        routerLink: ['app-admin', 'list', this.name],
      },
      {
        text: 'Add New',
        routerLink: ['app-admin', 'new', this.name],
      }
    ]
  };

  public readonly formSchema: FormSchemaItem[] = [
    {
      label: 'Only',
      name: 'only',
      type: 'radio',
      required: true,
      validators: [Validators.required],
      selections: [
        { text: 'posts:default', name: 'posts:default', selected: false },
        { text: 'audios:default', name: 'audios:default', selected: false },
        { text: 'videos:default', name: 'videos:default', selected: false },
        { text: 'profiles:default', name: 'profiles:default', selected: false }
      ],
    },
    Schemas.description,
    this.thumbnails,
    Schemas.images,
    Schemas.count,
  ];

  public readonly contentTypes: ContentType[]  = [
    { text: 'Default', value: 'default', icon: `icon-dashboard-part-${this.name}` },
  ];

  constructor(public readonly dataService: CategoryDataService) {}

  private get thumbnails() {
    const sharedThumbnails = Schemas.thumbnails;
    return {
      ...sharedThumbnails,
      meta: {
        ...sharedThumbnails.meta,
        schema: [
          { ...sharedThumbnails.meta.schema[0] },
          {
            ...sharedThumbnails.meta.schema[1],
            itemMetas: {
              default: {
                imageCropping: { width: 256, height: 256 } as ImageCropping,
              },
            },
          },
        ],
      }
    };
  }

}
