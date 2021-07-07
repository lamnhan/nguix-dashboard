import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';

import { FormSchemaItem } from '../config/config.service';

export const Schemas = {
  id: { label: 'ID', name: 'id', type: 'input', validators: [Validators.required] },
  title: { label: 'Title', name: 'title', type: 'input', validators: [Validators.required] },
  description: { label: 'Description', name: 'description', type: 'textarea' },
  type: { label: 'Type', name: 'type', type: 'input' },
  thumbnail: { label: 'Thumbnail', name: 'thumbnail', type: 'input' },
  image: { label: 'Image', name: 'image', type: 'input'},
  contentSrc: { label: 'Content Source', name: 'contentSrc', type: 'input'},
  content: { label: 'Content', name: 'content', type: 'textarea'},
  count: { label: 'Count', name: 'count', type: 'number', defaultValue: 0 },
  only: { label: 'Only', name: 'only', type: 'only' },
  locale: { label: 'Locale', name: 'locale', type: 'locale', validators: [Validators.required] },
  origin: { label: 'Origin', name: 'origin', type: 'input', validators: [Validators.required] },
  status: {
    label: 'Status', name: 'status', type: 'status', defaultValue: 'draft', validators: [Validators.required]
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
