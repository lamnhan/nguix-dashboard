import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { MenuItem } from '@lamnhan/ngx-useful';
import { BundleDataService } from '@lamnhan/ngx-schemata';

import { FormSchemaItem, ContentType } from '../../services/config/config.service';
import { Schemas } from '../../services/schema/schema.service';

@Injectable({
  providedIn: 'root'
})
export class BundlePartService {
  public readonly name = 'bundle';

  public readonly menuItem: MenuItem = {
    name: this.name,
    text: 'Bundles',
    routerLink: ['app-admin', 'list', this.name],
    icon: `icon-dashboard-part-${this.name}`,
    activeAlso: [`app-admin/new/${this.name}`],
    subItems: [
      {
        text: 'All Bundles',
        routerLink: ['app-admin', 'list', this.name],
      },
      {
        text: 'Add New',
        routerLink: ['app-admin', 'new', this.name],
      },
    ]
  };

  public readonly hasOnly = true;

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
        { text: 'videos:default', name: 'videos:default', selected: false }
      ],
    },
    Schemas.description,
    Schemas.thumbnails,
    Schemas.images,
    Schemas.content,
    Schemas.count,
    Schemas.authors,
    Schemas.categories,
    Schemas.tags,
    Schemas.relatedBundles,
    Schemas.keywords,
  ];

  public readonly contentTypes: ContentType[]  = [
    { text: 'Default', value: 'default', icon: `icon-dashboard-part-${this.name}` },
  ];

  constructor(public readonly dataService: BundleDataService) {}
}
