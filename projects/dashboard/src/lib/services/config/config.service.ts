import { Injectable, Inject, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { MenuItem } from '@lamnhan/ngx-useful';

export const DASHBOARD_CONFIG = new InjectionToken<DashboardConfig>('DashboardConfig');

export function dashboardConfig(config: DashboardConfig) {
  return config;
}

export interface DashboardConfig {
  parts: Array<string | DashboardPart>;
}

export interface DashboardPart {
  name: string;
  menuItem: MenuItem;
  getAll?: () => GetAllResult;
  getItem?: (id: string) => GetItemResult;
}

export type DatabaseItem = Record<string, any>;
export type GetAllResult = Observable<DatabaseItem[]>;
export type GetItemResult = Observable<DatabaseItem>;

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  constructor(@Inject(DASHBOARD_CONFIG) private config: DashboardConfig) {}

  getConfig() {
    // include front by default
    if (this.config.parts.indexOf('front') === -1) {
      this.config.parts.unshift('front');
    }
    // final config
    return this.config;
  }
}
