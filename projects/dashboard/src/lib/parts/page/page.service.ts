import { Injectable } from '@angular/core';
import { MenuItem } from '@lamnhan/ngx-useful';
import { PageDataService } from '@lamnhan/ngx-schemata';

import { FormSchemaItem, DataType } from '../../services/config/config.service';
import { Schemas } from '../../services/schema/schema.service';

@Injectable({
  providedIn: 'root'
})
export class PagePartService {  
  public readonly name = 'page';

  public readonly menuItem: MenuItem = {
    name: this.name,
    text: 'Pages',
    routerLink: ['admin', 'list', this.name],
    icon: `icon-dashboard-part-${this.name}`,
    activeAlso: [`admin/new/${this.name}`],
    subItems: [
      {
        text: 'All Pages',
        routerLink: ['admin', 'list', this.name],
      },
      {
        text: 'Add New',
        routerLink: ['admin', 'new', this.name],
      }
    ]
  };
  
  public readonly formSchema: FormSchemaItem[] = [
    Schemas.type,
    Schemas.description,
    Schemas.thumbnail,
    Schemas.image,
    Schemas.contentSrc,
    Schemas.content,
  ];

  public readonly dataTypes: DataType[]  = [
    { text: 'Page', value: 'page', icon: `icon-dashboard-${this.name}` },
  ];
  
  constructor(public readonly dataService: PageDataService) {}

}
