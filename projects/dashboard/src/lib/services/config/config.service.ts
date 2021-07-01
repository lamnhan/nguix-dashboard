import { Injectable, Inject, InjectionToken } from '@angular/core';
import { MenuItem } from '@lamnhan/ngx-useful';

export const DASHBOARD_CONFIG = new InjectionToken<DashboardConfig>('DashboardConfig');

export function dashboardConfig(config: DashboardConfig) {
  return config;
}

export interface DashboardConfig {
  parts: Array<string | CustomPart>;
}

export interface CustomPart {
  collection?: string;
  menuItem: MenuItem;
}

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
