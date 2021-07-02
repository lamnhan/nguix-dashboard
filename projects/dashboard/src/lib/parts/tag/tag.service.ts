import { Injectable } from '@angular/core';
import { MenuItem } from '@lamnhan/ngx-useful';
import { TagDataService } from '@lamnhan/ngx-schemata';

import { GetAllResult, GetItemResult } from '../../services/config/config.service';

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

  constructor(private dataService: TagDataService) {}

  getAll() {
    return this.dataService.getCollection(undefined, false) as unknown as GetAllResult;
  }

  getItem(id: string) {
    return this.dataService.getDoc(id, false) as unknown as GetItemResult
  }
}
