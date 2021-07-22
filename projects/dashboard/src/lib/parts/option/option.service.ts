import { Injectable } from '@angular/core';
import { MenuItem } from '@lamnhan/ngx-useful';
import { OptionDataService } from '@lamnhan/ngx-schemata';

import { FormSchemaItem, UpdateEffect } from '../../services/config/config.service';
import { Schemas } from '../../services/schema/schema.service';

@Injectable({
  providedIn: 'root'
})
export class OptionPartService {
  public readonly name = 'option';

  public readonly menuItem: MenuItem = {
    name: this.name,
    text: 'Options',
    routerLink: ['admin', 'list', this.name],
    icon: `icon-dashboard-part-${this.name}`,
    activeAlso: [`admin/new/${this.name}`],
    subItems: [
      {
        text: 'All Options',
        routerLink: ['admin', 'list', this.name],
      },
      {
        text: 'Add New',
        routerLink: ['admin', 'new', this.name],
      }
    ]
  };

  public readonly formSchema: FormSchemaItem[] = [
    Schemas.value,
  ];

  constructor(public readonly dataService: OptionDataService) {}

}
