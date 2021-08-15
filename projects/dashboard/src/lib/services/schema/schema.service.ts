import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';

import { FormSchemaItem, JsonSchemaMeta, LinkingSchemaMeta, ImageCropping } from '../config/config.service';

export const minimumLinkingFields = ['id', 'title', 'type'];

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
  description: { label: 'Description', name: 'description', type: 'textarea' },
  thumbnails: {
    label: 'Thumbnails',
    name: 'thumbnails',
    type: 'json',
    meta: {
      type: 'record',
      schema: [
        {name: 'name', type: 'string', required: true, width: 50},
        {
          name: 'src',
          type: 'upload',
          required: true,
          width: 250,
          itemMetas: {
            default: {
              imageCropping: { width: 720, height: 405 } as ImageCropping,
            },
          },
        },
      ],
      defaultData: {
        default: { name: 'default', src: '' },
      },
    } as JsonSchemaMeta,
  },
  images: {
    label: 'Images',
    name: 'images',    
    type: 'json',
    meta: {
      type: 'record',
      schema: [
        {name: 'name', type: 'string', required: true, width: 50},
        {name: 'src', type: 'upload', required: true, width: 250},
      ],
    } as JsonSchemaMeta,
  },
  srcs: {
    label: 'Srcs',
    name: 'srcs',   
    type: 'json',
    meta: {
      type: 'record',
      schema: [
        {name: 'name', type: 'string', required: true, width: 50},
        {name: 'src', type: 'upload', required: true, width: 250},
      ],
    } as JsonSchemaMeta,    
  },
  duration: { label: 'Duration', name: 'duration', type: 'number', defaultValue: 0 },
  content: { label: 'Content', name: 'content', type: 'content' },
  value: { label: 'Value', name: 'value', type: 'text' }, // TODO: add "dynamic" (for any/unknown) type
  count: { label: 'Count', name: 'count', type: 'number', defaultValue: 0 }, // TODO: add "count" type
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
        ...minimumLinkingFields,
        'createdAt',
        'thumbnails',
        'description',
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
        ...minimumLinkingFields,
        'createdAt',
        'thumbnails',
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
        ...minimumLinkingFields,
        'thumbnails',
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
        ...minimumLinkingFields,
        'count'
      ],
    } as LinkingSchemaMeta,
  },
  relatedPosts: {
    label: 'Related posts',
    name: 'relatedPosts',
    type: 'link',
    meta: {
      source: 'post',
      fields: [
        ...minimumLinkingFields,
        'createdAt',
        'thumbnails',
        'description',
        'duration',
      ],
    } as LinkingSchemaMeta,
  },
  relatedAudios: {
    label: 'Related audios',
    name: 'relatedAudios',
    type: 'link',
    meta: {
      source: 'audio',
      fields: [
        ...minimumLinkingFields,
        'createdAt',
        'thumbnails',
        'description',
        'duration',
      ],
    } as LinkingSchemaMeta,
  },
  relatedVideos: {
    label: 'Related videos',
    name: 'relatedVideos',
    type: 'link',
    meta: {
      source: 'video',
      fields: [
        ...minimumLinkingFields,
        'createdAt',
        'thumbnails',
        'description',
        'duration',
      ],
    } as LinkingSchemaMeta,
  },
  relatedBundles: {
    label: 'Related bundles',
    name: 'relatedBundles',
    type: 'link',
    meta: {
      source: 'bundle',
      fields: [
        ...minimumLinkingFields,
        'createdAt',
        'thumbnails',
        'description',
        'count',
      ],
    } as LinkingSchemaMeta,
  },
  relatedProfiles: {
    label: 'Related profiles',
    name: 'relatedProfiles',
    type: 'link',
    meta: {
      source: 'profile',
      fields: [
        ...minimumLinkingFields,
        'createdAt',
        'thumbnails',
        'description',
        'badges',
      ],
    } as LinkingSchemaMeta,
  },
  relatedProducts: {
    label: 'Related products',
    name: 'relatedProducts',
    type: 'link',
    meta: {
      source: 'product',
      fields: [
        ...minimumLinkingFields,
        'createdAt',
        'thumbnails',
        'description',
        'sku',
        'unit',
        'price',
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
  relatedPosts: {
    key: Schemas.relatedPosts.name,
    props: Schemas.relatedPosts.meta.fields,
  },
  relatedAudios: {
    key: Schemas.relatedAudios.name,
    props: Schemas.relatedAudios.meta.fields,
  },
  relatedVideos: {
    key: Schemas.relatedVideos.name,
    props: Schemas.relatedVideos.meta.fields,
  },
  relatedBundles: {
    key: Schemas.relatedBundles.name,
    props: Schemas.relatedBundles.meta.fields,
  },
  relatedProfiles: {
    key: Schemas.relatedProfiles.name,
    props: Schemas.relatedProfiles.meta.fields,
  },
  relatedProducts: {
    key: Schemas.relatedProducts.name,
    props: Schemas.relatedProducts.meta.fields,
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
