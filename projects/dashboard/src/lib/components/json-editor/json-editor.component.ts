import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';

interface JsonSchema {
  name: string;
  type: string;
  required?: boolean;
  defaultValue?: any;
  width?: number;
}

interface MatrixItem extends JsonSchema {
  value?: any;
}

@Component({
  selector: 'nguix-dashboard-json-editor',
  templateUrl: './json-editor.component.html',
  styleUrls: ['./json-editor.component.scss']
})
export class JsonEditorComponent implements OnInit, OnChanges {
  @Input() type?: 'record' | 'array';
  @Input() currentData?: any[] | Record<string, any>;

  @Input() schema?: JsonSchema[] = [];
  @Input() recordKey?: string;

  @Input() mode?: 'edit' | 'table' | 'raw' = 'table';
  @Output() save = new EventEmitter<any>();

  dataMatrix: MatrixItem[][] = [];
  dataRaw = '';

  constructor() {}

  ngOnInit(): void {
    this.buildData();
  }
  
  ngOnChanges(): void {
    this.buildData();
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
          result[item[this.recordKey as string || 'id']] = item;
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
    .map(data => (this.schema || []).map(schema => this.getMatrixItem(schema, data)));
  }

  private getMatrixItem(schema: JsonSchema, data: any = {}): MatrixItem {
    return { ...schema, value: data[schema.name] || schema.defaultValue };
  }

}
