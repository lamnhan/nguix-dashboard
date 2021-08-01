import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';

import { FormSchemaItem, JsonSchemaMeta, LinkingSchemaMeta } from '../config/config.service';

const mimimumLinkingFields = ['id', 'title', 'type'];

export const Schemas = {
  id: {
    label: 'ID',
    name: 'id',
    type: 'text',
    required: true,
    validators: [Validators.required],
  },
  title: {
    label: 'Title',
    name: 'title',
    type: 'text',
    required: true,
    validators: [Validators.required],
  },  
  type: {
    label: 'Type',
    name: 'type',
    type: 'type',
    required: true,
    validators: [Validators.required],
  },  
  status: {
    label: 'Status',
    name: 'status',
    type: 'status',
    defaultValue: 'draft',
    required: true,
    validators: [Validators.required],
  },  
  locale: {
    label: 'Locale',
    name: 'locale',
    type: 'locale',
    required: true,
    validators: [Validators.required],
  },
  origin: {
    label: 'Origin',
    name: 'origin',
    type: 'text',
    required: true,
    validators: [Validators.required],
  },
  only: {
    label: 'Only',
    name: 'only',
    type: 'only',
    required: true,
    validators: [Validators.required],
  },
  description: { label: 'Description', name: 'description', type: 'textarea' },
  thumbnail: { label: 'Thumbnail', name: 'thumbnail', type: 'upload' },
  image: { label: 'Image', name: 'image', type: 'upload' },
  src: { label: 'Src', name: 'src', type: 'upload' },
  duration: { label: 'Duration', name: 'duration', type: 'number', defaultValue: 0 },
  content: { label: 'Content', name: 'content', type: 'content' },
  value: { label: 'Value', name: 'value', type: 'text' }, // TODO: add "dynamic" (for any/unknown) type
  count: { label: 'Count', name: 'count', type: 'count', defaultValue: 0 }, // TODO: add "count" type
  keyword: { label: 'Keyword', name: 'keyword', type: 'text' },
  toc: {
    label: 'TOC',
    name: 'toc',
    type: 'json',
    meta: {
      type: 'array',
      schema: [
        {name: 'text', type: 'string', required: true, width: 150},
        {name: 'level', type: 'number', required: true, defaultValue: 1},
        {name: 'id', type: 'string', width: 100},
        {name: 'href', type: 'string', width: 150},
        {name: 'routerLink', type: 'string', width: 150},
      ],
    } as JsonSchemaMeta,
  },
  slides: {
    label: 'Slides',
    name: 'slides',
    type: 'json',
    meta: {
      type: 'array',
      schema: [
        {name: 'id', type: 'string', required: true, width: 100},
        {name: 'title', type: 'string', width: 150},
        {name: 'image', type: 'string', required: true, width: 150},
        {name: 'description', type: 'string', width: 150},
      ],
    } as JsonSchemaMeta,
  },
  props: {
    label: 'Props',
    name: 'props',
    type: 'json',
    meta: {
      type: 'record',
      recordKey: 'name',
      schema: [
        {name: 'name', type: 'string', required: true, width: 100},
        {name: 'value', type: 'string', required: true, width: 150},
      ],
    } as JsonSchemaMeta,
  },
  authors: {
    label: 'Authors',
    name: 'authors',
    type: 'link',
    meta: {
      source: 'profile',
      fields: [
        ...mimimumLinkingFields,
        'createdAt',
        'thumbnail',
        'description',
        'thumbnail',
        'badges',
      ],
    } as LinkingSchemaMeta,
  },
  parents: {
    label: 'Parents',
    name: 'parents',
    type: 'link',
    meta: {
      source: 'bundle',
      fields: [
        ...mimimumLinkingFields,
        'createdAt',
        'thumbnail',
        'description',
        'count',
      ],
    } as LinkingSchemaMeta,
  },
  categories: {
    label: 'Categories',
    name: 'categories',
    type: 'link',
    meta: {
      source: 'category',
      fields: [
        ...mimimumLinkingFields,
        'thumbnail',
        'description',
        'count'
      ],
    } as LinkingSchemaMeta,
  },
  tags: {
    label: 'Tags',
    name: 'tags',
    type: 'link',
    meta: {
      source: 'tag',
      fields: [
        ...mimimumLinkingFields,
        'count'
      ],
    } as LinkingSchemaMeta,
  },
};


export const Effects = {
  authors: {
    key: Schemas.authors.name,
    props: Schemas.authors.meta.fields,
  },
  parents: {
    key: Schemas.parents.name,
    props: Schemas.parents.meta.fields,
  },
  categories: {
    key: Schemas.categories.name,
    props: Schemas.categories.meta.fields,
  },
  tags: {
    key: Schemas.tags.name,
    props: Schemas.tags.meta.fields,
  },
};

@Injectable({
  providedIn: 'root'
})
export class SchemaService {

  constructor() {}

  list() {
    return Object.keys(Schemas).map(name => this.get(name));
  }

  all() {
    return Schemas as Record<string, FormSchemaItem>;
  }

  get(name: string) {
    return (Schemas as Record<string, FormSchemaItem>)[name];
  }
}
