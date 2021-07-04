import { Injectable } from '@angular/core';
import { MenuItem } from '@lamnhan/ngx-useful';
import { CategoryDataService } from '@lamnhan/ngx-schemata';

import { FormSchemaItem } from '../../services/config/config.service';

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
    { label: 'Description', name: 'description', type: 'textarea' },
    { label: 'Thumbnail', name: 'thumbnail', type: 'input' },
    { label: 'Image', name: 'image', type: 'input'},
    {
      label: 'Count', name: 'count', type: 'number',
      defaultValue: 0
    },
    {
      label: 'Only',
      name: 'only',
      type: 'checkbox',
      children: [
        { text: 'Post', name: 'post', checked: false },
        { text: 'Product', name: 'product', checked: false },
      ]
    },
  ];

  constructor(public readonly dataService: CategoryDataService) {}

}
