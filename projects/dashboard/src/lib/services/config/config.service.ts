import { Injectable, Inject, InjectionToken } from '@angular/core';
import { MenuItem } from '@lamnhan/ngx-useful';

export const DASHBOARD_CONFIG = new InjectionToken<DashboardConfig>('DashboardConfig');

export function dashboardConfig(config: DashboardConfig) {
  return config;
}

export interface DashboardConfig {
  collections: Array<string | CustomSchemata>;
}

export interface CustomSchemata {
  menuItem: MenuItem;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  constructor(@Inject(DASHBOARD_CONFIG) private config: DashboardConfig) {}
  getConfig() {
    return this.config;
  }
}
