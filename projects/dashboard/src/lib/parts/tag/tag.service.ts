import { Injectable } from '@angular/core';
import { MenuItem } from '@lamnhan/ngx-useful';
import { TagDataService } from '@lamnhan/ngx-schemata';

import { FormSchemaItem } from '../../services/config/config.service';
import { Schemas } from '../../services/schema/schema.service';

@Injectable({
  providedIn: 'root'
})
export class TagPartService {
  public readonly name = 'tag';

  public readonly menuItem: MenuItem = {
    name: this.name,
    text: 'Tags',
    routerLink: ['admin', 'list', this.name],
    icon: `icon-dashboard-${this.name}`,
    activeAlso: [`admin/new/${this.name}`],
    subItems: [
      {
        text: 'All Tags',
        routerLink: ['admin', 'list', this.name],
      },
      {
        text: 'Add New',
        routerLink: ['admin', 'new', this.name],
      }
    ]
  };

  public readonly formSchema: FormSchemaItem[] = [
    Schemas.count,
  ];

  constructor(public readonly dataService: TagDataService) {}

}
