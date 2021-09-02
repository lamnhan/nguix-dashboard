import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { MenuItem } from '@lamnhan/ngx-useful';
import { OptionDataService } from '@lamnhan/ngx-schemata';

import { FormSchemaItem, ContentType } from '../../services/config/config.service';
import { Schemas } from '../../services/schema/schema.service';

@Injectable({
  providedIn: 'root'
})
export class OptionPartService {
  public readonly name = 'option';

  public readonly menuItem: MenuItem = {
    name: this.name,
    text: 'Options',
    routerLink: ['app-dashboard', 'list', this.name],
    icon: `icon-dashboard-part-${this.name}`,
    activeAlso: [`app-dashboard/new/${this.name}`],
    subItems: [
      {
        text: 'All Options',
        routerLink: ['app-dashboard', 'list', this.name],
      },
      {
        text: 'Add New',
        routerLink: ['app-dashboard', 'new', this.name],
      }
    ]
  };

  public readonly noI18n = true;

  public readonly formSchema: FormSchemaItem[] = [
    {
      ...Schemas.value,
      required: true,
      validators: [Validators.required],
    },
  ];

  public readonly contentTypes: ContentType[]  = [
    { text: 'Default', value: 'default', icon: `icon-dashboard-part-${this.name}` },
  ];

  constructor(public readonly dataService: OptionDataService) {}

}
