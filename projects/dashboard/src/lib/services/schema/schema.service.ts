import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';

import { FormSchemaItem } from '../config/config.service';

export const Schemas = {
  id: { label: 'ID', name: 'id', type: 'text', required: true, validators: [Validators.required] },
  title: { label: 'Title', name: 'title', type: 'text', required: true, validators: [Validators.required] },
  description: { label: 'Description', name: 'description', type: 'textarea' },
  thumbnail: { label: 'Thumbnail', name: 'thumbnail', type: 'text' },
  image: { label: 'Image', name: 'image', type: 'text'},
  duration: { label: 'Duration', name: 'duration', type: 'number', defaultValue: 1},
  contentSrc: { label: 'Content Source', name: 'contentSrc', type: 'text'},
  content: { label: 'Content', name: 'content', type: 'textarea'},
  count: { label: 'Count', name: 'count', type: 'number', defaultValue: 0 },
  only: { label: 'Only', name: 'only', type: 'only' },
  locale: { label: 'Locale', name: 'locale', type: 'locale', required: true, validators: [Validators.required] },
  origin: { label: 'Origin', name: 'origin', type: 'text', required: true, validators: [Validators.required] },
  type: { label: 'Type', name: 'type', type: 'type', required: true, validators: [Validators.required] },
  status: {
    label: 'Status', name: 'status', type: 'status', defaultValue: 'draft', required: true, validators: [Validators.required]
  },
  keywords: { label: 'Keywords', name: 'keywords', type: 'text' },
  categories: { label: 'Categories', name: 'categories', type: 'link', data: { source: 'category' }},
  tags: { label: 'Tags', name: 'tags', type: 'link', data: { source: 'tag' }},
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
