import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

import { DashboardPart } from '../../services/config/config.service';

@Component({
  selector: 'nguix-dashboard-link-editor',
  templateUrl: './link-editor.component.html',
  styleUrls: ['./link-editor.component.scss'],
})
export class LinkEditorComponent implements OnInit, OnChanges {
  @Input() part!: DashboardPart;
  @Input() fields!: string[];
  @Input() contentType!: string;
  @Input() contentLocale!: string;
  @Input() currentData?: Record<string, any>;

  @Output() save = new EventEmitter<any>();

  isEdit = false;
  hasData = false;
  selectedData: Record<string, any> = {};

  query = '';
  items: any[] = [];

  constructor() {}

  ngOnInit(): void {}
  
  ngOnChanges(): void {
    this.buildData();
  }

  search() {
    console.log({ query: this.query });
  }

  toggleItem(item: any, e: any) {
    const id = e.target.value;
    const checked = e.target.checked;
    if (checked) {
      this.selectedData[id] = (this.fields || [])
        .map(key => ({key, value: item[key]}))
        .reduce(
          (result, item) => {
            result[item.key] = item.value;
            return result;
          },
          {} as any,
        );
    } else {
      delete this.selectedData[id];
    }
  }

  submit() {
    // event
    this.save.emit(this.selectedData);
    // exit
    this.isEdit = false;
  }

  private buildData() {
    const currentDataKeys = Object.keys(this.currentData || {});
    this.hasData = !!currentDataKeys.length;
    this.selectedData = currentDataKeys
      .map(key => ({...(this.currentData as any)[key]}))
      .reduce(
        (result, item) => {
          result[item.id] = { ...item };
          return result;
        },
        {} as any,
      );
  }

}
