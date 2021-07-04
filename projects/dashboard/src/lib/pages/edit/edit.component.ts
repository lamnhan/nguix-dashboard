import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { of, combineLatest } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { SettingService, UserService } from '@lamnhan/ngx-useful';

import { DashboardPart, DatabaseItem, FormSchemaItem } from '../../services/config/config.service';
import { DashboardService } from '../../services/dashboard/dashboard.service';

@Component({
  selector: 'nguix-dashboard-edit-page',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditPage implements OnInit {
  isNew = false;

  public readonly data$ = this.route.params.pipe(
    switchMap(params => {
      this.isNew = !params.id;
      const part = this.dashboardService.getPart(params.part);
      if (part?.getItem) {
        return combineLatest([
          of(part),
          !params.id
            ? of(null)
            : part.getItem(params.id).pipe(catchError(() => of(null))),
        ]);
      } else {
        return of([]);
      }
    }),
    map(([part, databaseItem]) => {
      if (!part || !part.formSchema || !part.formHandler) {
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
  );

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public settingService: SettingService,
    public userService: UserService,
    private dashboardService: DashboardService,
  ) {}

  ngOnInit(): void {}

  checkboxChanged(controlName: string, formGroup: FormGroup, children: any, item: Record<string, any>, e: any) {
    console.log({
      controlName,
      formGroup,
      children,
      item,
      e
    });
  }

  submit(part: DashboardPart, formGroup: FormGroup) {
    if (!part.formHandler) {
      return;
    }
    // mode
    const mode = this.isNew ? 'new' : 'update';
    // changed data
    const data = Object.keys(formGroup.controls).reduce(
      (result, name) => {
        const item = formGroup.controls[name];
        if (item.dirty) {
          result[name] = item.value;
        } else {
          console.log(item);
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
    // run handler
    return part.formHandler({mode, data}, formGroup);
  }

  private getFormSchema(part: DashboardPart) {
    if (!part.formSchema) {
      part.formSchema = [];
    }
    // set id & title
    else {
      // new only
      if (this.isNew) {
        part.formSchema.unshift({
          label: 'ID', name: 'id', type: 'input',
          validators: [Validators.required],
        });
      }
      // title
      part.formSchema.unshift({
        label: 'Title', name: 'title', type: 'input',
        validators: [Validators.required],
      });
      // locale
      part.formSchema.push({
        label: 'Locale', name: 'locale', type: 'locale',
        validators: [Validators.required]
      });
      // origin
      part.formSchema.push({
        label: 'Origin', name: 'origin', type: 'input',
        validators: [Validators.required]
      });
      // status
      part.formSchema.push({
        label: 'Status', name: 'status', type: 'status',
        validators: [Validators.required]
      });
    }
    // result
    return part.formSchema;
  }

  private getFormGroup(
    formSchema: FormSchemaItem[],
    databaseItem?: null | DatabaseItem
  ): FormGroup {
    const fields = {} as Record<string, any>;
    formSchema.forEach(schema => {
      const {name, validators} = schema;
      const value = !databaseItem || !databaseItem[name] ? '' : databaseItem[name];
      fields[name] = new FormControl(value, validators || []);
    });
    // result
    return this.formBuilder.group(fields);
  }

}
