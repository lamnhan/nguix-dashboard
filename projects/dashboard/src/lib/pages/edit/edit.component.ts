import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Subscription, combineLatest, of } from 'rxjs';
import { tap, map, switchMap, take } from 'rxjs/operators';
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
  LinkingSchemaMeta,
  ImageCropping,
} from '../../services/config/config.service';
import { Schemas } from '../../services/schema/schema.service';
import { DataService } from '../../services/data/data.service';
import { DashboardService } from '../../services/dashboard/dashboard.service';

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

  activeType = 'default';
  activeLocale = 'en-US';

  isNew = false;
  isCopy = false;
  isTranslate = false;
  databaseItem?: DatabaseItem;
  prioritizedData: Record<string, any> = {};

  showUploader = false;
  uploadCallerData?: {
    schema: FormSchemaItem;
    formGroup: FormGroup;
    imageCropping?: ImageCropping;
  };

  activeDescriptions: Record<string, boolean> = {};

  public readonly page$ = combineLatest([
      this.route.params,
      this.route.data,
      this.route.queryParams,
    ])
    .pipe(
      switchMap(([params, data, queryParams]) => {
        // reset
        this.lockdown = false;
        // set data
        this.itemId = params.id;
        this.prioritizedData = queryParams;
        this.part = this.dashboardService.getPart(params.part);
        this.isCopy = data.copy;
        this.isNew = !this.itemId || this.isCopy;
        this.isTranslate = !this.part?.noI18n && this.isCopy && this.prioritizedData.locale;
        // not a proper data part
        if (!this.part?.dataService) {
          return of({ data: undefined });
        }
        // continue processing
        return (
          !this.itemId
            ? of(undefined) // new item
            : this.part.dataService.get(this.itemId, false) // get current data
        )
        .pipe(
          map((databaseItem: undefined | DatabaseItem) => {
            // save database item
            this.databaseItem = databaseItem;
            // build data
            const part = this.part as DashboardPart;
            const formSchema = this.getFormSchema(part);
            const formGroup = this.getFormGroup(formSchema, this.databaseItem);
            // result
            return {
              data: {
                part,
                formSchema,
                formGroup,
              },
            };
          }),
        );
      }),
      tap(({ data }) => {
        if (!data) return;
        // active type
        this.activeType =
          this.databaseItem?.type ||
          this.prioritizedData.type ||
          this.activeType;
        // active locale
        this.activeLocale =
          this.databaseItem?.locale ||
          this.prioritizedData.locale ||
          this.settingService.defaultLocale ||
          this.activeLocale;
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
        // set id
        const titleControl = data.formGroup?.get('title');
        if (titleControl) {
          this.titleChangesSubscription = titleControl.valueChanges.subscribe(title => {
            const idControl = data.formGroup?.get('id');
            if (idControl && this.isNew) {
              idControl.setValue(this.slugify(title));
              idControl.markAsDirty();
            }
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
        const localeControl = data.formGroup?.get('locale');
        if (localeControl) {
          this.localeChangesSubscription = localeControl.valueChanges
            .subscribe(locale => this.activeLocale = locale);
        }
        // active type
        const typeControl = data.formGroup?.get('type');
        if (typeControl) {
          this.typeChangesSubscription = typeControl.valueChanges
            .subscribe(type => this.activeType = type);
        }
      }),
    );

  private idChangesSubscription?: Subscription;
  private titleChangesSubscription?: Subscription;
  private statusChangesSubscription?: Subscription;
  private localeChangesSubscription?: Subscription;
  private typeChangesSubscription?: Subscription;

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
    if (this.titleChangesSubscription) {
      this.titleChangesSubscription.unsubscribe();
    }
    if (this.statusChangesSubscription) {
      this.statusChangesSubscription.unsubscribe();
    }
    if (this.localeChangesSubscription) {
      this.localeChangesSubscription.unsubscribe();
    }
    if (this.typeChangesSubscription) {
      this.typeChangesSubscription.unsubscribe();
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
    const value = radioItem.value;
    selections.forEach(selection => {
      if (selection.value === value) {
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

  listChanges(
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
        const control = formGroup.controls[name];
        if (control.dirty) {
          const value = control.value;
          result[name] = !isNaN(value) ? +value : value;
        }
        return result;
      },
      {} as Record<string, any>
    );
    // default data for new item
    if (this.isNew) {
      data.uid = this.userService.uid as string;
      data.createdAt = new Date().toISOString();
      data.updatedAt = data.createdAt;
    }
    // has form handler
    const mode = this.isNew ? 'create' : 'update';
    if (part.formHandler) {
      return part.formHandler({mode, data}, formGroup);
    }
    // default handler
    else if (part.dataService) {
      if (mode === 'create') {
        return this.dataService.createItem(
          part,
          data,
          () => {
            this.lockdown = false;
            this.navService.navigate(['app-dashboard', 'edit', part.name, data.id as string]);
          },
          error => {
            this.lockdown = false;
            alert(error.message);
          }
        );
      } else if (mode === 'update' && this.databaseItem) {
        // clean up unchangable fields
        ['uid', 'id', 'type', 'status', 'createdAt', 'locale', 'ogirin'].forEach(removeField => {
          delete data[removeField];
        });
        // update item
        return this.dataService.updateItem(
          part,
          this.databaseItem,
          data,
          () => {
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

  remove(part: DashboardPart, databaseItem: DatabaseItem) {
    return this.dataService.removePermanently(
      part,
      databaseItem,
      result => {
        if (result !== null) {
          this.navService.navigate(['app-dashboard', 'new', part.name]);
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
      const schema = part.formSchema.map(item => ({ ...item }));
      // i18n
      if (this.isNew && !part.noI18n) {
        // origin
        schema.unshift({ ...Schemas.origin, disabled: !this.isNew || this.isTranslate });
        // locale
        schema.unshift({
          ...Schemas.locale,
          disabled: !this.isNew || this.isTranslate,
          defaultValue: this.settingService.defaultLocale,
        });
      }
      // type
      if (this.isNew) {
        schema.unshift({
          ...Schemas.type,
          disabled:
            !this.isNew ||
            this.isTranslate ||
            (this.part?.contentTypes && this.part?.contentTypes.length <= 1)
        });
      }
      // id (new only)
      if (this.isNew) {
        schema.unshift({ ...Schemas.id, disabled: !this.isNew });
      }
      // title
      schema.unshift(Schemas.title);      
      // status
      if (this.isNew || (this.databaseItem?.status === 'draft')) {
        schema.push(Schemas.status);
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
      const { name, defaultValue, disabled, validators } = schema;
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
      // modify id and origin (for copy)
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
      if (name === 'type' && !value && this.part?.contentTypes && this.part?.contentTypes?.length > 0) {
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

  private processSchemaData(schema: FormSchemaItem, value: any) {
    const { type, children, selections } = schema;
    // 1. checkbox alike
    if (type === 'checkbox' && value &&  children) {
      children.forEach(child =>
        (value as string[]).indexOf(child.value) === -1 ? child.checked = false : child.checked = true);
    }
    // 2. radio alike
    if ((type === 'radio' || type === 'select') && value && selections) {
      selections.forEach(child =>
        (value as string) !== child.value ? child.selected = false : child.selected = true);
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
      if (part?.dataService) {
        schema.meta.part = part;
        schema.meta.currentData = value;
      }
    }
    // 7. list
    if (type === 'list') {
      schema.meta = { currentData: value };
    }
  }

  private slugify(text: string) {
    return text
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
  }
}
