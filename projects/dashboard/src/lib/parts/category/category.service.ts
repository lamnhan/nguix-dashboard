import { Injectable } from '@angular/core';
import { MenuItem } from '@lamnhan/ngx-useful';
import { CategoryDataService } from '@lamnhan/ngx-schemata';

import { GetAllResult, GetItemResult, FormSchemaItem, FormResult } from '../../services/config/config.service';

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
      label: 'Only',
      name: 'only',
      type: 'checkbox',
      children: [
        { text: 'Post', name: 'post', checked: false },
        { text: 'Product', name: 'product', checked: false },
      ]
    },
  ];

  constructor(private dataService: CategoryDataService) {}

  getAll() {
    return this.dataService.getCollection(undefined, false) as unknown as GetAllResult;
  }

  getItem(id: string) {
    return this.dataService.getDoc(id, false) as unknown as GetItemResult
  }

  formHandler(result: FormResult) {
    const { mode, data } = result;
    if (mode === 'new') {
      data.count = 0;
    }
    console.log({mode, data});
  }

}
