import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Subscription, combineLatest } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { NavService, SettingService, UserService } from '@lamnhan/ngx-useful';

import { DashboardPart, DatabaseItem, FormSchemaItem } from '../../services/config/config.service';
import { Schemas } from '../../services/schema/schema.service';
import { DataService } from '../../services/data/data.service';
import { DashboardService } from '../../services/dashboard/dashboard.service';

import { GetPart, AddItem, UpdateItem } from '../../states/database/database.state';

@Component({
  selector: 'nguix-dashboard-edit-page',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditPage implements OnInit, OnDestroy {
  private part?: DashboardPart;
  private itemId?: string;
  
  lockdown = false;
  submitText = '-';

  isNew = false;
  isCopy = false;
  databaseItem?: DatabaseItem;
  prioritizedData: Record<string, any> = {};

  public readonly page$ = combineLatest([
    this.route.params,
    this.route.data,
    this.route.queryParams,
  ])
  .pipe(
    map(([params, data, queryParams]) => {
      this.itemId = params.id;
      this.isCopy = data.copy;
      this.prioritizedData = queryParams;
      this.isNew = !this.itemId || this.isCopy;
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
      }),
    );

  private idChangesSubscription?: Subscription;
  private statusChangesSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private formBuilder: FormBuilder,
    private navService: NavService,
    public settingService: SettingService,
    private userService: UserService,
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
  }

  checkboxChanges(
    controlName: string,
    formGroup: FormGroup,
    children: any,
    item: Record<string, any>,
    e: any
  ) {
    item.checked = e.target.checked;
    const value = children
      .filter((child: any) => child.checked)
      .map((child: any) => child.name);
    const control = formGroup.get(controlName);
    if (control) {
      control.setValue(value);
      control.markAsDirty();
    }
  }

  submit(part: DashboardPart, formGroup: FormGroup) {
    this.lockdown = true;
    // mode
    const mode = this.isNew ? 'new' : 'update';
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
    if (part.formHandler) {
      return part.formHandler({mode, data}, formGroup);
    } else if (part.dataService) {
      if (mode === 'new') {
        return this.store
          .dispatch(new AddItem(part, data.id, data))
          .subscribe(() => {
            this.lockdown = false;
            this.navService.navigate(['admin', 'edit', part.name, data.id as string]);
          });
      } else if(mode === 'update' && this.databaseItem) {
        return this.store
          .dispatch(new UpdateItem(part, this.databaseItem.id, data))
          .subscribe(() => {
            this.lockdown = false;
          });
      } else {
        return alert('No default action for mode: ' + mode);
      }
    } else {
      return alert('No form handler nor data service for this part.');
    }
  }

  private getSubmitText(status: string) {
    if (this.isNew) {
      return status === 'publish'
        ? 'Publish now'
        : status === 'draft'
        ? 'Save draft'
        : '-';
    } else {
      return status === 'publish'
        ? 'Update now'
        : status === 'draft'
        ? 'Save draft'
        : '-';
    }
  }

  private getFormSchema(part: DashboardPart) {
    if (!part.formSchema) {
      return [];
    }
    // set id & title
    else {
      const schema = part.formSchema.map(item => this.processSchema(item));
      const isTranslation = this.isCopy && this.prioritizedData.locale;
      // title
      schema.unshift(Schemas.title);
      // id (new only)
      schema.unshift({ ...Schemas.id, disabled: !this.isNew });
      // locale
      schema.push({
        ...Schemas.locale,
        disabled: !this.isNew || isTranslation,
        defaultValue: this.settingService.defaultLocale,
      });
      // origin
      schema.push({ ...Schemas.origin, disabled: !this.isNew || isTranslation });
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
    if (type === 'only') {
      item.children = this.dashboardService.getParts()
        .filter(item => ['front', 'category', 'tag'].indexOf(item.name) === -1) // excludes
        .map(item => ({ text: item.menuItem.text as string, name: item.name, checked: false }));
    }
    // 2. ...
    // result
    return item;
  }

  private processSchemaData(schema: FormSchemaItem, value: any) {
    const { type, children } = schema;
    if (!value || !children) { return; }
    // 1. checkbox alike
    if (type === 'checkbox' || type === 'only') {
      children.forEach(child => (value as string[]).indexOf(child.name) ? false : child.checked = true);
    }
    // 2. ...
  }
}
