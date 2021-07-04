import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { of, combineLatest, Subscription } from 'rxjs';
import { tap, map, switchMap, catchError, take } from 'rxjs/operators';
import { NavService, SettingService, UserService } from '@lamnhan/ngx-useful';

import { DashboardPart, DatabaseItem, FormSchemaItem } from '../../services/config/config.service';
import { DashboardService } from '../../services/dashboard/dashboard.service';

@Component({
  selector: 'nguix-dashboard-edit-page',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditPage implements OnInit, OnDestroy {
  itemId?: string;
  isNew = false;
  submitText = 'Submit';

  public readonly data$ = this.route.params.pipe(
    switchMap(params => {
      this.itemId = params.id;
      this.isNew = !params.id;
      const part = this.dashboardService.getPart(params.part);
      if (part?.dataService) {
        return combineLatest([
          of(part),
          !params.id
            ? of(null)
            : part
                .dataService
                .getDoc(params.id, false)
                .pipe(catchError(() => of(null))),
        ]);
      } else {
        return of([]);
      }
    }),
    map(([part, databaseItem]) => {
      if (!part || !part.formSchema) {
        return {};
      }
      const formSchema = this.getFormSchema(part);
      const formGroup = this.getFormGroup(formSchema, databaseItem);
      return {
        part,
        formSchema,
        formGroup,
      };
    }),
    tap(data => {
      // submit text
      this.submitText = this.getSubmitText(data.formGroup?.get('status')?.value || 'draft');
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
    private formBuilder: FormBuilder,
    private navService: NavService,
    public settingService: SettingService,
    private userService: UserService,
    private dashboardService: DashboardService,
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
        part.dataService
          .add(data.id as string, data)
          .pipe(take(1))
          .subscribe(() =>
            this.navService.navigate(['admin', 'edit', part.name, data.id as string])
          );
      } else {
        part.dataService
          .update(this.itemId as string, data)
          .pipe(take(1))
          .subscribe(() => alert('Update successfully!'));
      }
    } else {
      return alert('No form handler nor data service for this part.');
    }
  }

  private getSubmitText(status: string) {
    if (this.isNew) {
      return status === 'publish'
        ? 'Publish now'
        : status === 'archive'
        ? 'Add archive'
        : status === 'draft'
        ? 'Save draft'
        : 'Submit';
    } else {
      return status === 'publish'
        ? 'Update item'
        : status === 'archive'
        ? 'Archive item'
        : status === 'draft'
        ? 'Draft item'
        : 'Submit';
    }
  }

  private getFormSchema(part: DashboardPart) {
    if (!part.formSchema) {
      return [];
    }
    // set id & title
    else {
      const schema = [...part.formSchema];
      // title
      schema.unshift({
        label: 'Title', name: 'title', type: 'input',
        validators: [Validators.required],
      });
      // id (new only)
      if (this.isNew) {
        schema.unshift({
          label: 'ID', name: 'id', type: 'input',
          validators: [Validators.required],
        });
      }
      // locale
      schema.push({
        label: 'Locale', name: 'locale', type: 'locale',
        defaultValue: this.settingService.defaultLocale,
        validators: [Validators.required]
      });
      // origin
      schema.push({
        label: 'Origin', name: 'origin', type: 'input',
        validators: [Validators.required]
      });
      // status
      schema.push({
        label: 'Status', name: 'status', type: 'status',
        defaultValue: 'draft',
        validators: [Validators.required]
      });
      // result
      return schema;
    }
  }

  private getFormGroup(
    formSchema: FormSchemaItem[],
    databaseItem?: null | DatabaseItem
  ): FormGroup {
    const fields = {} as Record<string, any>;
    formSchema.forEach(schema => {
      const {name, defaultValue, validators} = schema;
      const value = !databaseItem || !databaseItem[name] ? '' : databaseItem[name];
      const control = new FormControl(value, validators || []);
      if (!value && defaultValue !== undefined && defaultValue !== null) {
        control.setValue(defaultValue);
        control.markAsDirty();
      }
      fields[name] = control;
    });
    // result
    return this.formBuilder.group(fields);
  }

}
