import { Injectable } from '@angular/core';
import { MenuItem } from '@lamnhan/ngx-useful';

import { ConfigService } from '../config/config.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private configService: ConfigService) {}

  getMenu() {
    const {collections} = this.configService.getConfig();
    return collections.map(name => this.getBuiltinMenuItem(name));
  }

  private getBuiltinMenuItem(collection: string) {
    const builtinItems = {
      categories: {
        name: 'categories',
        text: 'Categories',
        routerLink: ['admin', 'list', 'categories'],
        icon: 'icon-categories'
      }
    } as Record<string, MenuItem>;
    return builtinItems[collection];
  }
}
