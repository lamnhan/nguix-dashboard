import { InjectionToken } from '@angular/core';

export const DASHBOARD_CONFIG = new InjectionToken<ConfigService>(
  'ConfigService',
  {
    providedIn: 'root',
    factory: () => new ConfigService(),
  }
);

class ConfigService {
  constructor() {}
}