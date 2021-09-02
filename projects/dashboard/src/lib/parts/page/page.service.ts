import { Injectable } from '@angular/core';
import { MenuItem } from '@lamnhan/ngx-useful';
import { PageDataService } from '@lamnhan/ngx-schemata';

import { FormSchemaItem, ContentType } from '../../services/config/config.service';
import { Schemas } from '../../services/schema/schema.service';

@Injectable({
  providedIn: 'root'
})
export class PagePartService {  
  public readonly name = 'page';

  public readonly menuItem: MenuItem = {
    name: this.name,
    text: 'Pages',
    routerLink: ['app-dashboard', 'list', this.name],
    icon: `icon-dashboard-part-${this.name}`,
    activeAlso: [`app-dashboard/new/${this.name}`],
    subItems: [
      {
        text: 'All Pages',
        routerLink: ['app-dashboard', 'list', this.name],
      },
      {
        text: 'Add New',
        routerLink: ['app-dashboard', 'new', this.name],
      }
    ]
  };
  
  public readonly formSchema: FormSchemaItem[] = [
    Schemas.description,
    Schemas.thumbnails,
    Schemas.images,
    Schemas.content,
  ];

  public readonly contentTypes: ContentType[]  = [
    { text: 'Default', value: 'default', icon: `icon-dashboard-part-${this.name}` },
  ];
  
  constructor(public readonly dataService: PageDataService) {}

}
