import { Injectable } from '@angular/core';
import { MenuItem } from '@lamnhan/ngx-useful';
import { CategoryDataService } from '@lamnhan/ngx-schemata';

import { FormSchemaItem, UpdateEffect } from '../../services/config/config.service';
import { Schemas } from '../../services/schema/schema.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryPartService {
  public readonly name = 'category';

  public readonly menuItem: MenuItem = {
    name: this.name,
    text: 'Categories',
    routerLink: ['admin', 'list', this.name],
    icon: `icon-dashboard-${this.name}`,
    activeAlso: [`admin/new/${this.name}`],
    subItems: [
      {
        text: 'All Categories',
        routerLink: ['admin', 'list', this.name],
      },
      {
        text: 'Add New',
        routerLink: ['admin', 'new', this.name],
      }
    ]
  };

  public readonly formSchema: FormSchemaItem[] = [
    Schemas.description,
    Schemas.thumbnail,
    Schemas.image,
    Schemas.count,
    Schemas.only,
  ];

  public readonly updateEffects: UpdateEffect[] = [
    {
      part: 'post',
      collection: 'posts',
      key: 'categories',
      props: ['id', 'title'],
    },
  ];

  constructor(public readonly dataService: CategoryDataService) {}

}
