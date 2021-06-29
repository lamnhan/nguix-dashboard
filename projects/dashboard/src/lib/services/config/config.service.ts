import { Injectable, Inject, InjectionToken } from '@angular/core';

export const DASHBOARD_CONFIG = new InjectionToken<DashboardConfig>('DashboardConfig');

export function dashboardConfig(config: DashboardConfig) {
  return {
    ...config,
  } as DashboardConfig;
}

export interface DashboardConfig {
  collections: string[];
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
