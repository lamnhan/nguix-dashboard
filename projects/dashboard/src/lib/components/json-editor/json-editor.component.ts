import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { of } from 'rxjs';
import { StorageItem } from '@lamnhan/ngx-useful';

import { ConfigService, ImageCropping, JsonSchemaMetaSchemaItem } from '../../services/config/config.service';

interface SchemaItem extends JsonSchemaMetaSchemaItem {
  value?: any;
}

type MatrixItem = SchemaItem[];

@Component({
  selector: 'nguix-dashboard-json-editor',
  templateUrl: './json-editor.component.html',
  styleUrls: ['./json-editor.component.scss']
})
export class JsonEditorComponent implements OnInit, OnChanges {
  @Input() type?: 'record' | 'array';
  @Input() recordKey?: string;
  @Input() schema?: JsonSchemaMetaSchemaItem[] = [];
  @Input() currentData?: any[] | Record<string, any>;
  @Input() mode?: 'edit' | 'table' | 'raw' = 'table';
  @Output() save = new EventEmitter<any>();

  dataMatrix: SchemaItem[][] = [];
  dataRaw = '';

  showUploader = false;
  uploadCallerData?: { schemaItem: SchemaItem; imageCropping?: ImageCropping };

  constructor(private configService: ConfigService) {}

  ngOnInit(): void {}
  
  ngOnChanges(): void {
    this.buildData();
  }

  openUploader(schemaItem: SchemaItem, matrixItem: MatrixItem) {
    // check if there is a value
    const isCurrentValue = schemaItem.value;
    const yes = !isCurrentValue ? true : confirm('Override current value?');
    // no value or override
    if (yes) {
      this.uploadCallerData = {
        schemaItem,
        imageCropping:
          !schemaItem.itemMetas
            ? undefined
            : schemaItem
                .itemMetas[matrixItem[0].value || '$never']
                ?.imageCropping as (undefined | ImageCropping),
      };
      this.showUploader = true;
    }
  }

  uploadChanges(media: StorageItem) {
    if (this.uploadCallerData) {
      const { uploadRetrieval = 'url' } = this.configService.getConfig();
      const value$ = uploadRetrieval === 'path'
        ? of(media.fullPath)
        : uploadRetrieval === 'url'
        ? media.downloadUrl$
        : media.downloadUrl$;
      value$.subscribe(value => {
        // set value
        (this.uploadCallerData?.schemaItem as SchemaItem).value = value;
        // reset caller data
        this.uploadCallerData = undefined;
      });
    }
  }

  add() {
    this.dataMatrix.push((this.schema || []).map(schema => this.getMatrixItem(schema)));
  }

  remove(i: number) {
    const yes = confirm('Remove item: ' + (i + 1));
    if (yes) {
      this.dataMatrix.splice(i, 1);
    }
  }

  submit() {
    const result = this.dataMatrix.map(items =>
      items.reduce(
        (result, item) => {
          if (item.value !== undefined && item.value !== null) {
            result[item.name] = item.value;
          }
          return result;
        },
        {} as any
      )
    );
    // emit
    this.save.emit(
      this.type === 'array'
      ? result
      : result.reduce(
        (result, item) => {
          result[
            item[
              this.recordKey as string || // 1. recordKey
              (
                !this.schema
                  ? 'id' // 3. default to id
                  : this.schema[0].name // 2. first column
              )
            ]
          ] = item;
          return result;
        },
        {} as any,
      )
    );
    // exit
    this.mode = 'table';
  }

  private buildData() {
    // raw
    this.dataRaw = !this.currentData ? '' : JSON.stringify(this.currentData, undefined, 2);
    // matrix
    const currentData = this.currentData || (this.type === 'array' ? [] : {});
    this.dataMatrix = (
      currentData instanceof Array
      ? currentData
      : Object.keys(currentData)
          .map(key => (currentData as Record<string, any>)[key])
    )
    .map(data =>
      (this.schema || []).map(schema => this.getMatrixItem(schema, data))
    );
  }

  private getMatrixItem(schema: JsonSchemaMetaSchemaItem, data: any = {}): SchemaItem {
    return { ...schema, value: data[schema.name] || schema.defaultValue };
  }

}
