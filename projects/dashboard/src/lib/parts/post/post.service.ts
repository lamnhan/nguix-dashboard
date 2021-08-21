import { Injectable } from '@angular/core';
import { MenuItem } from '@lamnhan/ngx-useful';
import { PostDataService } from '@lamnhan/ngx-schemata';

import { FormSchemaItem, ContentType } from '../../services/config/config.service';
import { Schemas } from '../../services/schema/schema.service';

@Injectable({
  providedIn: 'root'
})
export class PostPartService {
  public readonly name = 'post';

  public readonly menuItem: MenuItem = {
    name: this.name,
    text: 'Posts',
    routerLink: ['app-admin', 'list', this.name],
    icon: `icon-dashboard-part-${this.name}`,
    activeAlso: [`app-admin/new/${this.name}`],
    subItems: [
      {
        text: 'All Posts',
        routerLink: ['app-admin', 'list', this.name],
      },
      {
        text: 'Add New',
        routerLink: ['app-admin', 'new', this.name],
      },
    ]
  };

  public readonly formSchema: FormSchemaItem[] = [
    Schemas.description,
    Schemas.thumbnails,
    Schemas.images,
    Schemas.toc,
    { label: 'TLDR', name: 'tldr', type: 'textarea' },
    { ...Schemas.duration, note: 'In minutes' },
    Schemas.content,
    Schemas.slides,
    { label: 'Audio', name: 'audio', type: 'upload' },
    { label: 'Video', name: 'video', type: 'upload' },    
    Schemas.authors,
    Schemas.parents,
    Schemas.categories,
    Schemas.tags,
    Schemas.relatedPosts,
    Schemas.keywords,
  ];

  public readonly contentTypes: ContentType[]  = [
    { text: 'Default', value: 'default', icon: `icon-dashboard-part-${this.name}` },
  ];

  constructor(public readonly dataService: PostDataService) {}
}
