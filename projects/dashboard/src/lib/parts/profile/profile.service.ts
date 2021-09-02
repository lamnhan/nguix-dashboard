import { Injectable } from '@angular/core';
import { MenuItem } from '@lamnhan/ngx-useful';
import { ProfileDataService } from '@lamnhan/ngx-schemata';

import { FormSchemaItem, ContentType, JsonSchemaMeta, RadioAlikeChild } from '../../services/config/config.service';
import { Schemas } from '../../services/schema/schema.service';

@Injectable({
  providedIn: 'root'
})
export class ProfilePartService {
  public readonly name = 'profile';

  public readonly menuItem: MenuItem = {
    name: this.name,
    text: 'Profiles',
    routerLink: ['app-dashboard', 'list', this.name],
    icon: `icon-dashboard-part-${this.name}`,
    activeAlso: [`app-dashboard/new/${this.name}`],
    subItems: [
      {
        text: 'All Profiles',
        routerLink: ['app-dashboard', 'list', this.name],
      },
    ]
  };

  public readonly noI18n = true;

  public readonly formSchema: FormSchemaItem[] = [
    {
      label: 'Legit',
      name: 'legit',
      type: 'select',
      placeholder: 'Select legit',
      selections: [
        { text: 'Average', value: 'average' },
        { text: 'Official', value: 'official' },
        { text: 'Suspicious', value: 'suspicious' },
      ] as RadioAlikeChild[],
      description: 'It is "average" if not specified.',
    },
    {
      label: 'Rank',
      name: 'rank',
      type: 'text',
      description: 'Ranking structure of your organization, examples: 100CEO, 101CTO, 200HRHEAD, 300ITHEAD, ...',
    },
    {
      label: 'Badges',
      name: 'badges',
      type: 'list',
      note: 'Use <kbd>Tab</kbd> or <kbd>,</kbd> to separate.',
    },
    Schemas.categories,
    Schemas.tags,
    Schemas.relatedProfiles,
    Schemas.keywords,
  ];

  public readonly contentTypes: ContentType[]  = [
    { text: 'Default', value: 'default', icon: `icon-dashboard-part-${this.name}` },
  ];

  constructor(public readonly dataService: ProfileDataService) {}
}
