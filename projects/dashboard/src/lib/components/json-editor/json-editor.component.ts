import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

interface Item {
  name: string;
  type: string;
  required?: boolean;
  defaultValue?: any;
}

@Component({
  selector: 'nguix-dashboard-json-editor',
  templateUrl: './json-editor.component.html',
  styleUrls: ['./json-editor.component.scss']
})
export class JsonEditorComponent implements OnInit {
  @Input() type?: 'record' | 'array' = 'record';
  @Input() currentData?: any[] | Record<string, any>;

  @Input() items?: Item[] = [];
  @Input() recordKey?: string = 'id';

  @Input() mode?: 'edit' | 'table' | 'raw' = 'table';
  @Output() change = new EventEmitter<any>();

  dataMatrix: any[] = [];

  constructor() {}

  ngOnInit(): void {
    this.buildDataMatrix();
    console.log(this.dataMatrix);
  }

  save() {
    const result = {};
    return this.change.emit(result);
  }

  private buildDataMatrix() {
    const currentData = this.currentData || (this.type === 'array' ? [] : {});
    this.dataMatrix = (
      currentData instanceof Array
      ? currentData
      : Object.keys(currentData)
          .map(key => (currentData as Record<string, any>)[key])
    )
    .map(data =>
      // this.items.reduce(
      //   (result, item) => {
      //     if (data[item.name]) {
      //       result[item.name] = data[item.name];
      //     } else {
      //       if (item.type === 'number') {
      //         result[item.name] = 0;
      //       } else if (item.type === 'boolean') {
      //         result[item.name] = false;
      //       } else {
      //         result[item.name] = '';
      //       }
      //     }
      //     return result;
      //   },
      //   {} as Record<string, any>
      // )
      (this.items || []).map(item => {
        const result = {name: item.name, value: data[item.name]} as {name: string, value: any};
        return result;
      })
    );
  }

}
