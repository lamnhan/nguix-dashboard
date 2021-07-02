import { Injectable } from '@angular/core';
import { MenuItem } from '@lamnhan/ngx-useful';
import { PageDataService } from '@lamnhan/ngx-schemata';

import { GetAllResult, GetItemResult } from '../../services/config/config.service';

@Injectable({
  providedIn: 'root'
})
export class PagePartService {  
  public readonly name = 'page';

  public readonly menuItem: MenuItem = {
    name: this.name,
    text: 'Pages',
    routerLink: ['admin', 'list', this.name],
    icon: `icon-dashboard-${this.name}`,
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
  
  constructor(private dataService: PageDataService) {}

  getAll() {
    return this.dataService.getCollection(undefined, false) as unknown as GetAllResult;
  }

  getItem(id: string) {
    return this.dataService.getDoc(id, false) as unknown as GetItemResult
  }
}
