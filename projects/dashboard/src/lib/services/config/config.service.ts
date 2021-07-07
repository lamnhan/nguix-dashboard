import { Injectable, Inject, InjectionToken } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { MenuItem, DatabaseData } from '@lamnhan/ngx-useful';

import { DashboardService } from '../dashboard/dashboard.service';

export const DASHBOARD_CONFIG = new InjectionToken<DashboardConfig>('DashboardConfig');

export function dashboardConfig(config: DashboardConfig) {
  return config;
}

export interface DashboardConfig {
  parts: Array<string | DashboardPart>;
  plugins?: DashboardPlugin[];
}

export type DashboardPlugin = (dashboardService: DashboardService) => any;

export interface DashboardPart {
  name: string;
  menuItem: MenuItem;
  dataTypes?: DataType[];
  dataService?: DatabaseData<any>;
  formSchema?: FormSchemaItem[];
  updateEffects?: UpdateEffect[];
  formHandler?: (result: FormResult, formGroup: FormGroup) => void;
}

export interface FormResult {
  mode: 'new' | 'update';
  data: Record<string, any>;
}

export type DatabaseItem = Record<string, any>;
export type GetAllResult = Observable<DatabaseItem[]>;
export type GetItemResult = Observable<DatabaseItem>;

export interface FormSchemaItem {
  label: string;
  name: string;
  type: SchemaType;
  disabled?: boolean;
  defaultValue?: any;
  placeholder?: string;
  description?: string;
  validators?: any[];
  children?: CheckboxAlikeChild[];
  data?: Record<string, any>;
}

export type SchemaType = string;

export interface CheckboxAlikeChild {
  text: string;
  name: string;
  checked: boolean;
}

export interface DataType {
  text: string;
  value: string;
  icon?: string;
}

export interface UpdateEffect {
  part: string;
  key: string;
  props: string[];
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
