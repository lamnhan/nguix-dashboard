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
  parts: string[];
  plugins?: DashboardPlugin[];
  allowDirectContent?: boolean;
  uploadRetrieval?: 'path' | 'hybrid' | 'url';
}

export type DashboardPlugin = (dashboardService: DashboardService) => any;

export interface DashboardPart {
  name: string;
  menuItem: MenuItem;
  noI18n?: boolean;
  contentTypes?: ContentType[];
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
  required?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  defaultValue?: any;
  placeholder?: string;
  description?: string;
  validators?: any[];
  children?: CheckboxAlikeChild[];
  selections?: RadioAlikeChild[];
  meta?: Record<string, any>;
}

export type SchemaType = string;

export interface CheckboxAlikeChild {
  text: string;
  name: string;
  checked: boolean;
}

export interface RadioAlikeChild extends Omit<CheckboxAlikeChild, 'checked'> {
  selected: boolean;
}

export interface ContentType {
  text: string;
  value: string;
  icon?: string;
}

export interface UpdateEffect {
  part: string;
  collection: string;
  key: string;
  props: string[];
  idBuilder?: (id: string) => string;
}

export interface ContentSchemaMeta {
  // auto-generated from current value
  allowDirect?: boolean;
  isDirect?: boolean;
  contentHtml?: string;
}

export interface UploadSchemaMeta {
  imageCropping?: ImageCropping;
}

export interface HtmlSchemaMeta {
  // auto-generated from current value
  htmlContent?: string;
}

export interface JsonSchemaMeta {
  type: 'record' | 'array';
  recordKey?: string;
  schema: Array<JsonSchemaMetaSchemaItem>;
  defaultData?: any[] | Record<string, any>;
  // auto-generated from current value
  currentData?: Record<string, any> | any[];
}

export interface JsonSchemaMetaSchemaItem {
  name: string;
  type: string;
  required?: boolean;
  defaultValue?: any;
  width?: number;
  itemMetas?: Record<string, Record<string, any>>;
}

export interface LinkingSchemaMeta {
  source: string;
  fields: string[];
  contentType?: string;
  // auto-generated from source
  part?: DashboardPart;
  items$?: Observable<DatabaseItem[]>;
  currentData?: Record<string, any>;
}

export interface ImageCropping {
  width: number;
  height: number;
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
