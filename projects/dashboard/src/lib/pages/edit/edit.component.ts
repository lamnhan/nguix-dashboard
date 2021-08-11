import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Subscription, combineLatest, of } from 'rxjs';
import { tap, map, take } from 'rxjs/operators';
import { NavService, SettingService, UserService } from '@lamnhan/ngx-useful';
import { StorageItem } from '@lamnhan/ngx-useful';

import {
  DashboardPart,
  DatabaseItem,
  FormSchemaItem,
  CheckboxAlikeChild,
  RadioAlikeChild,
  ConfigService,
  ContentSchemaMeta,
  ImageCropping,
} from '../../services/config/config.service';
import { Schemas } from '../../services/schema/schema.service';
import { DataService } from '../../services/data/data.service';
import { DashboardService } from '../../services/dashboard/dashboard.service';

import { GetPart } from '../../states/database/database.state';

@Component({
  selector: 'nguix-dashboard-edit-page',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditPage implements OnInit, OnDestroy {
  private part?: DashboardPart;
  private itemId?: string;
  
  lockdown = false;
  submitText = 'Submit';
  activeLocale = 'en-US';

  isNew = false;
  isCopy = false;
  databaseItem?: DatabaseItem;
  prioritizedData: Record<string, any> = {};

  showUploader = false;
  uploadCallerData?: {
    schema: FormSchemaItem;
    formGroup: FormGroup;
    imageCropping?: ImageCropping;
  };

  public readonly page$ = combineLatest([
    this.route.params,
    this.route.data,
    this.route.queryParams,
  ])
  .pipe(
    map(([params, data, queryParams]) => {
      // reset
      this.lockdown = false;      
      // set data
      this.itemId = params.id;
      this.isCopy = data.copy;
      this.prioritizedData = queryParams;
      this.isNew = !this.itemId || this.isCopy;
      // get part
      this.part = this.dashboardService.getPart(params.part);
      return !this.part?.dataService ? {} : {part: this.part};
    }),
    tap(() => {
      if (this.part) {
        this.store.dispatch(new GetPart(this.part))
      }
    }),
  );

  public readonly data$ = this.store
    .select(state => state.database)
    .pipe(
      take(1),
      map(database => {
        const part = this.part as DashboardPart;
        const itemId = this.itemId as string;
        this.databaseItem = (database[part.name] || [])
          .filter((item: any) => item.id === itemId)
          .shift() as DatabaseItem;
        const formSchema = this.getFormSchema(part);
        const formGroup = this.getFormGroup(formSchema, this.databaseItem);
        return {
          part,
          formSchema,
          formGroup,
        };
      }),
      tap(data => {
        // submit text
        this.submitText = this.getSubmitText(
          this.isCopy || !this.databaseItem?.status
            ? 'draft'
            : this.databaseItem?.status
        );
        const statusControl = data.formGroup?.get('status');
        if (statusControl) {
          this.statusChangesSubscription = statusControl.valueChanges.subscribe(status => {
            this.submitText = this.getSubmitText(status);
          });
        }
        // set origin for default locale
        const idControl = data.formGroup?.get('id');
        if (idControl) {
          this.idChangesSubscription = idControl.valueChanges.subscribe(id => {
            const defaultLocale = this.settingService.defaultLocale;
            const locale = data.formGroup?.get('locale')?.value || defaultLocale;
            const originControl = data.formGroup?.get('origin');
            if (originControl && locale === defaultLocale) {
              originControl.setValue(id);
              originControl.markAsDirty();
            }
          });
        }
        // active locale
        this.activeLocale = this.databaseItem?.locale || this.settingService.defaultLocale;
        const localeControl = data.formGroup?.get('locale');
        if (localeControl) {
          this.localeChangesSubscription = localeControl.valueChanges
            .subscribe(locale => this.activeLocale = locale);
        }
      }),
    );

  private idChangesSubscription?: Subscription;
  private statusChangesSubscription?: Subscription;
  private localeChangesSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private formBuilder: FormBuilder,
    private navService: NavService,
    public settingService: SettingService,
    private userService: UserService,
    private configService: ConfigService,
    private dashboardService: DashboardService,
    public dataService: DataService
  ) {}

  ngOnInit(): void {}

  ngOnDestroy() {
    if (this.idChangesSubscription) {
      this.idChangesSubscription.unsubscribe();
    }
    if (this.statusChangesSubscription) {
      this.statusChangesSubscription.unsubscribe();
    }
    if (this.localeChangesSubscription) {
      this.localeChangesSubscription.unsubscribe();
    }
  }

  checkboxChanges(
    schema: FormSchemaItem,
    formGroup: FormGroup,
    children: CheckboxAlikeChild[],
    checkboxItem: CheckboxAlikeChild,
    e: any
  ) {
    checkboxItem.checked = e.target.checked;
    const value = children
      .filter((child: any) => child.checked)
      .map((child: any) => child.name);
    const control = formGroup.get(schema.name);
    if (control) {
      control.setValue(value);
      control.markAsDirty();
    }
  }

  radioChanges(
    schema: FormSchemaItem,
    formGroup: FormGroup,
    selections: RadioAlikeChild[],
    radioItem: RadioAlikeChild,
  ) {
    const value = radioItem.name;
    selections.forEach(selection => {
      if (selection.name === value) {
        selection.selected = true;
      } else {
        selection.selected = false;
      }
    });
    const control = formGroup.get(schema.name);
    if (control) {
      control.setValue(value);
      control.markAsDirty();
    }
  }

  openUploader(
    schema: FormSchemaItem,
    formGroup: FormGroup,
    imageCropping?: ImageCropping,
  ) {
    // check if there is a value
    const isCurrentValue = formGroup.get(schema.name)?.value;
    const yes = !isCurrentValue ? true : confirm('Override current value?');
    // no value or override
    if (yes) {
      this.uploadCallerData = {schema, formGroup, imageCropping};
      this.showUploader = true;
    }
  }

  uploadChanges(media: StorageItem) {
    if (this.uploadCallerData) {
      const {schema, formGroup} = this.uploadCallerData;
      const { uploadRetrieval = 'url' } = this.configService.getConfig();
      const value = uploadRetrieval === 'path' ? media.fullPath : media.downloadUrl;
      const control = formGroup.get(schema.name);
      if (control) {
        // set value
        control.setValue(value);
        control.markAsDirty();
        // reset data
        this.uploadCallerData = undefined;
      }
    }
  }

  htmlChanges(
    schema: FormSchemaItem,
    formGroup: FormGroup,
    value: string
  ) {
    const control = formGroup.get(schema.name);
    if (control) {
      control.setValue(value);
      control.markAsDirty();
    }
  }

  jsonChanges(
    schema: FormSchemaItem,
    formGroup: FormGroup,
    value: any
  ) {
    (schema.meta as any).currentData = value;
    const control = formGroup.get(schema.name);
    if (control) {
      control.setValue(value);
      control.markAsDirty();
    }
  }

  linkChanges(
    schema: FormSchemaItem,
    formGroup: FormGroup,
    value: any
  ) {
    (schema.meta as any).currentData = value;
    const control = formGroup.get(schema.name);
    if (control) {
      control.setValue(value);
      control.markAsDirty();
    }
  }

  submit(part: DashboardPart, formGroup: FormGroup) {
    this.lockdown = true;    
    // changed data
    const data = Object.keys(formGroup.controls).reduce(
      (result, name) => {
        const item = formGroup.controls[name];
        if (item.dirty) {
          result[name] = item.value;
        }
        return result;
      },
      {} as Record<string, any>
    );
    // default data
    if (this.isNew) {
      data.uid = this.userService.uid as string;
      data.createdAt = new Date().toISOString();
      data.updatedAt = data.createdAt;
    }
    // has form handler
    const mode = this.isNew ? 'new' : 'update';
    if (part.formHandler) {
      return part.formHandler({mode, data}, formGroup);
    }
    // default handler
    else if (part.dataService) {
      if (mode === 'new') {
        return this.dataService.addItem(
          part,
          data.id,
          data,
          () => {
            this.lockdown = false;
            this.navService.navigate(['app-admin', 'edit', part.name, data.id as string]);
          },
          error => {
            this.lockdown = false;
            alert(error.message);
          }
        );
      } else if(mode === 'update' && this.databaseItem) {
        return this.dataService.updateItem(
          part,
          this.databaseItem.id,
          data,
          result => {
            this.lockdown = false;
          },
          error => {
            this.lockdown = false;
            alert(error.message);
          }
        );
      } else {
        return alert('No default action for mode: ' + mode);
      }
    }
    // nothing
    else {
      return alert('No form handler nor data service for this part.');
    }
  }

  delete(part: DashboardPart, databaseItem: DatabaseItem) {
    return this.dataService.deletePermanently(
      part,
      databaseItem,
      result => {
        if (result !== null) {
          this.navService.navigate(['app-admin', 'new', part.name]);
        }
      }
    );
  }

  private getSubmitText(status: string) {
    if (this.isNew) {
      return status === 'publish'
        ? 'Publish now'
        : status === 'draft'
        ? 'Save draft'
        : 'New';
    } else {
      return status === 'publish'
        ? 'Update now'
        : status === 'draft'
        ? 'Save draft'
        : 'Update';
    }
  }

  private getFormSchema(part: DashboardPart) {
    if (!part.formSchema) {
      return [];
    }
    // set id & title
    else {
      const schema = part.formSchema.map(item => this.processSchema(item));
      // type
      schema.unshift({
        ...Schemas.type,
        disabled: !this.isNew || (this.part?.contentTypes && this.part?.contentTypes.length <= 1)
      });
      // title
      schema.unshift(Schemas.title);      
      // id (new only)
      schema.unshift({ ...Schemas.id, disabled: !this.isNew });
      // status
      if (this.isNew || (this.databaseItem?.status === 'draft')) {
        schema.push(Schemas.status);
      }
      // i18n
      if (!part.noI18n) {
        const isTranslation = this.isCopy && this.prioritizedData.locale;
        // locale
        schema.push({
          ...Schemas.locale,
          disabled: !this.isNew || isTranslation,
          defaultValue: this.settingService.defaultLocale,
        });
        // origin
        schema.push({ ...Schemas.origin, disabled: !this.isNew || isTranslation });
      }
      // result
      return schema;
    }
  }

  private getFormGroup(
    formSchema: FormSchemaItem[],
    databaseItem?: null | DatabaseItem
  ): FormGroup {
    const fields = {} as Record<string, any>;
    // build fields
    formSchema.forEach(schema => {
      const {name, defaultValue, disabled, validators} = schema;
      const value = !databaseItem || !databaseItem[name] ? '' : databaseItem[name];
      let isDirty = false;
      const control = new FormControl(
        !disabled ? value : {value, disabled},
        validators || []
      );
      // default value
      if (!value && defaultValue !== undefined && defaultValue !== null) {
        control.setValue(defaultValue);
        isDirty = true;
      }
      // modify id and origin
      if (value && this.isCopy) {
        // id
        if (name === 'id') {
          control.setValue(
            this.prioritizedData.locale
              // localized
              ? value + '-' + (this.prioritizedData.locale as string).toLowerCase()
              // copying
              : value + '-copy'
          );
        }
        // title
        if (name === 'title') {
          control.setValue(
            this.prioritizedData.locale
              // localized
              ? value
              // copying
              : value + ' Copy'
          );
        }
        // origin
        if (name === 'origin') {
          control.setValue(
            this.prioritizedData.locale
              // localized
              ? value
              // copying
              : value + '-copy'
          );
        }
        // status
        if (name === 'status') {
          control.setValue('draft');
        }
        // mark as dirty
        isDirty = true;
      }
      // type
      if (name === 'type' && this.part?.contentTypes && this.part?.contentTypes?.length > 0) {
        control.setValue(this.part?.contentTypes[0].value);
        isDirty = true;
      }
      // prioritized data
      if (this.prioritizedData[name]) {
        control.setValue(this.prioritizedData[name]);
        isDirty = true;
      }
      // save control
      if (isDirty || (this.isCopy && value)) {
        control.markAsDirty();
      }
      fields[name] = control;
      // further process for special data types
      this.processSchemaData(schema, this.prioritizedData[name] || value);
    });
    // result
    return this.formBuilder.group(fields);
  }

  private processSchema(schema: FormSchemaItem) {
    const item = {...schema};
    const { type } = schema;
    // 1. only
    if (type === 'only' && this.part?.updateEffects) {
      item.selections = this.part?.updateEffects
        .map(item => {
          const part = this.dashboardService.getPart(item.part);
          if (!part) {
            return null;
          }
          return (part.contentTypes || []).map(type => ({
            text: `${item.collection}:${type.value}`,
            name: `${item.collection}:${type.value}`,
            selected: false,
          })) as RadioAlikeChild[];
        })
        .filter(item => !!item)
        .reduce(
          (result, item) => {
            result = (result as any[]).concat(item as RadioAlikeChild[]);
            return result;
          },
          [] as any[],
        ) as RadioAlikeChild[];
    }
    // result
    return item;
  }

  private processSchemaData(schema: FormSchemaItem, value: any) {
    const { type, children, selections } = schema;
    // 1. checkbox alike
    if (type === 'checkbox' && value &&  children) {
      children.forEach(child =>
        (value as string[]).indexOf(child.name) === -1 ? false : child.checked = true);
    }
    // 2. radio alike
    if ((type === 'radio' || type === 'only') && value &&  selections) {
      selections.forEach(child =>
        (value as string) !== child.name ? false : child.selected = true);
    }
    // 3. content
    if (type === 'content') {
      const allowDirect = !!this.configService.getConfig().allowDirectContent;
      schema.meta = { allowDirect } as ContentSchemaMeta;
      if (!value || value.substr(0, 4) === 'http') {
        schema.meta.isDirect = false;
        schema.meta.contentHtml = '<p></p>';
      } else {
        schema.meta.isDirect = true;
        schema.meta.contentHtml = value;
      }
    }
    // 4. html
    if (type === 'html') {
      schema.meta = { htmlContent: value };
    }
    // 5. json
    if (type === 'json' && schema.meta) {
      schema.meta.currentData = value || schema.meta.defaultData;
    }
    // 6. link
    if (type === 'link' && schema.meta && schema.meta.source) {
      const part = this.dashboardService.getPart(schema.meta.source as string);
      if (part) {
        schema.meta.part = part;
        schema.meta.items$ = this.store
          .dispatch(new GetPart(part)) 
          .pipe(
            map(state => state.database[part.name]),
          );
        schema.meta.currentData = value;
      }
    }
  }
}
